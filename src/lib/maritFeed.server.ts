import { absoluteUrl } from "./seo";
import type { FeedJob } from "./salesforce.server";

/**
 * The Marit Health job feed, served at /feeds/marit.xml.
 *
 * Built to their "XML Jobs Feed Documentation". Two things in that document
 * disagree with each other, and this follows the example over the prose:
 *
 *   - The prose says the root is <feed>; the example uses <source>. <source>
 *     is the Indeed format their example is copied from, and it is what their
 *     parser will have been tested against.
 *   - The example's <url> line is missing the "<" before its CDATA, which is
 *     not well-formed XML. Reproducing it would make the whole feed invalid.
 *
 * Deliberately absent:
 *   - <email>. Orchard's choice: applications go through the job page on
 *     orchardcorp.com so they land in Salesforce as Candidate Tracking records,
 *     rather than in an inbox via Marit's Easy Apply.
 *   - <salary>. There is no rate field in the org to take it from.
 *   - <postalcode>, <streetaddress>. The client facility is confidential and
 *     the feed must not say more than the site does.
 *   - <publisher>. Their document marks it as for ATS vendors only.
 */

const COMPANY = "Orchard Corp";

/**
 * XML 1.0 forbids most control characters outright — a single stray one in a
 * pasted description makes the entire document unparseable, which would take
 * every job off the board at once, not just the one with the bad byte.
 * Tab, newline and carriage return are allowed and are left alone.
 */
// eslint-disable-next-line no-control-regex
const INVALID_XML_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g;

/**
 * Wraps a value in CDATA. A CDATA section ends at the first "]]>", so any that
 * appear in the content are split across two sections — the standard escape.
 */
function cdata(value: string): string {
  const clean = value.replace(INVALID_XML_CHARS, "");
  return `<![CDATA[${clean.split("]]>").join("]]]]><![CDATA[>")}]]>`;
}

function field(tag: string, value: string | null | undefined): string {
  if (value == null || value.trim() === "") return "";
  return `    <${tag}>${cdata(value.trim())}</${tag}>\n`;
}

/** Open_Date is a bare date; Marit's example wants a full UTC timestamp. */
function toTimestamp(value: string | null): string | null {
  if (!value) return null;
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00Z` : value;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().replace(/\.\d{3}Z$/, "Z");
}

/**
 * Only a date still ahead of us. Boards pull a posting once its expiration
 * passes, and an assignment end date nobody updated would retire a live role.
 */
function toExpiration(value: string | null): string | null {
  if (!value) return null;
  const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00Z` : value);
  if (Number.isNaN(d.getTime()) || d.getTime() <= Date.now()) return null;
  return d.toISOString().slice(0, 10);
}

/** Locum tenens is contract work; anything classed permanent is full time. */
function toJobType(jobClass: string | null): string {
  return jobClass && /perm/i.test(jobClass) ? "fulltime" : "contract";
}

function toExperience(value: string | null): string | null {
  const years = Number(value);
  return Number.isFinite(years) && years > 0 ? `${years}+ years` : null;
}

function toCategory(job: FeedJob): string | null {
  const parts = [job.specialty, job.providerType].filter(
    (p, i, all): p is string => !!p && all.indexOf(p) === i,
  );
  return parts.length ? parts.join(", ") : null;
}

function jobXml(job: FeedJob): string {
  return (
    "  <job>\n" +
    field("title", job.title) +
    field("date", toTimestamp(job.postedAt)) +
    field("referencenumber", job.reference ?? job.id) +
    field("requisitionid", job.id) +
    field("url", absoluteUrl(`/jobs/${job.id}`)) +
    field("company", COMPANY) +
    field("sourcename", COMPANY) +
    field("city", job.city) +
    field("state", job.state) +
    field("country", "US") +
    // Formatted where the CRM has it, so the posting keeps its paragraphs and
    // lists on Marit rather than arriving as one block of text.
    field("description", job.descriptionHtml ?? job.descriptionText ?? job.title) +
    field("jobtype", toJobType(job.jobClass)) +
    field("category", toCategory(job)) +
    field("experience", toExperience(job.minimumYearsExperience)) +
    field("expirationdate", toExpiration(job.endDate)) +
    "  </job>\n"
  );
}

export function maritFeedXml(jobs: FeedJob[]): string {
  return (
    '<?xml version="1.0" encoding="utf-8"?>\n' +
    "<source>\n" +
    jobs.map(jobXml).join("") +
    "</source>\n"
  );
}

/**
 * The HTTP response for the feed.
 *
 * On failure this answers 503 and never an empty feed. Marit's rule is that
 * any job missing from the feed is marked inactive, so an empty <source> —
 * the natural thing to send when Salesforce is unreachable — would take every
 * Orchard listing off their board in one fetch. A failed fetch makes them keep
 * the last good copy instead.
 */
export async function maritFeedResponse(): Promise<Response> {
  const { fetchFeedJobs } = await import("./salesforce.server");
  const result = await fetchFeedJobs();

  if (result.status !== "ok" || result.jobs.length === 0) {
    return new Response("Feed temporarily unavailable\n", {
      status: 503,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "retry-after": "900",
        // Not cached, or one outage would be served to every fetch for the
        // life of the cache entry.
        "cache-control": "no-store",
      },
    });
  }

  return new Response(maritFeedXml(result.jobs), {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      // Fifteen minutes at the edge: fresh enough that a filled role leaves
      // the board the same day, without a Salesforce query per fetch.
      "cache-control": "public, max-age=0, s-maxage=900, stale-while-revalidate=3600",
      // A data feed, not a page. It should never appear in search results.
      "x-robots-tag": "noindex",
    },
  });
}
