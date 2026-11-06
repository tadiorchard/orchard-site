import type { FeedJob } from "./salesforce.server";
import { US_STATES } from "./taxonomy";

/**
 * The LocumTenens.com job feed, served at /feeds/locumtenens.xml.
 *
 * Deliberately a second feed rather than a change to /feeds/marit.xml.
 *
 * Every other board we have syndicated to reads the Indeed-style feed
 * (<source>/<job>, lowercase fields). LocumTenens.com specifies a different
 * document entirely: <Jobs>/<Job>, PascalCase, with Locations, Titles and
 * Specialties nested. The two cannot be the same file — and the dates settle
 * it, because Indeed-style feeds require YYYY-MM-DD while this one requires
 * MM/DD/YYYY. Editing the shared feed to suit this spec would hand every
 * other board a document it cannot parse, and a board that cannot parse a
 * feed treats every job in it as gone.
 *
 * So the helpers below are duplicated from maritFeed.server.ts on purpose.
 * Per-board serializers are meant to be independent: a fix one board asks for
 * must not be able to reach another board's output.
 *
 * Both feeds read the same fetchFeedJobs() query, so neither can advertise a
 * role the site does not.
 *
 * Deliberately absent:
 *   - <RequiredOnCall>, <RequiredCertification>. No field in the CRM holds
 *     either, and inferring them from description prose would be a guess
 *     published as a filter value. Both default to No on their side.
 *   - <BulletPoint1..3>. Optional highlights with nothing to populate them.
 *   - City inside <Location>. Their specification shows State only, and the
 *     client facility is confidential in all but a handful of records.
 */

const CONTACT_EMAIL = "marketing@orchardcorp.com";

/**
 * XML 1.0 forbids most control characters outright — a single stray one in a
 * pasted description makes the entire document unparseable, which would take
 * every job off the board at once, not just the one with the bad byte.
 */
// eslint-disable-next-line no-control-regex
const INVALID_XML_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g;

/** A CDATA section ends at the first "]]>", so any inside are split in two. */
function cdata(value: string): string {
  const clean = value.replace(INVALID_XML_CHARS, "");
  return `<![CDATA[${clean.split("]]>").join("]]]]><![CDATA[>")}]]>`;
}

function field(tag: string, value: string | null | undefined, indent = "    "): string {
  if (value == null || value.trim() === "") return "";
  return `${indent}<${tag}>${cdata(value.trim())}</${tag}>\n`;
}

/**
 * JobDuration, from the CRM's job class.
 *
 * "Locum to Perm" has to be tested before "Permanent" — it contains the word,
 * and collapsing it to Permanent would hide a locum opening on a locum board.
 */
function toJobDuration(jobClass: string | null): string {
  if (!jobClass) return "Locum Tenens";
  if (/locum[\s-]*(to|or)[\s-]*perm/i.test(jobClass)) return "Locum or Permanent";
  if (/perm/i.test(jobClass)) return "Permanent";
  return "Locum Tenens";
}

/**
 * Their expiration dates are MM/DD/YYYY, and only a date still ahead of us:
 * an assignment end date nobody updated would retire a live role. A date in
 * any other format is dropped on their side, which silently defaults the job
 * to expiring a year from posting.
 */
function toExpirationDate(value: string | null): string | null {
  if (!value) return null;
  const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00Z` : value);
  if (Number.isNaN(d.getTime()) || d.getTime() <= Date.now()) return null;
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${mm}/${dd}/${d.getUTCFullYear()}`;
}

/**
 * Titles, from the "Provider Credentials" line the description already
 * carries. That line is the one source populated on every record — the CRM's
 * provider type field is blank on the CRNA roles, and reads "Advanced
 * Practice" or "Allied Health" on others, neither of which says which title
 * to send.
 *
 * Physician sends MD and DO as two titles: their importer accepts "Physician"
 * and splits it anyway, and being explicit keeps the mapping visible here.
 */
const CREDENTIAL_TITLES: Array<[RegExp, string[]]> = [
  [/\bMD\s*\/\s*DO\b|\bMD\b|\bDO\b/i, ["MD", "DO"]],
  [/\bCRNA\b|nurse anesthetist/i, ["CRNA"]],
  [/\bNP\b|nurse practitioner/i, ["NP"]],
  [/\bPA\b|physician assistant/i, ["PA"]],
];

/** Fallback when no credentials line parsed, from the CRM's provider type. */
const PROVIDER_TYPE_TITLES: Array<[RegExp, string[]]> = [
  [/^physician$/i, ["MD", "DO"]],
  [/nurse anesthetist|crna/i, ["CRNA"]],
  [/nurse practitioner/i, ["NP"]],
  [/physician assistant/i, ["PA"]],
];

/**
 * Allied health specialties carry their own title, and take precedence: these
 * records show MD/DO on the credentials line, which is the CRM's default
 * rather than the truth for a perfusion or audiology opening. The three
 * mappings are the ones LocumTenens.com specified; "Other" is their answer
 * for optometry, which has no title of its own in their list.
 */
const SPECIALTY_TITLES: Array<[RegExp, string[]]> = [
  [/perfusion/i, ["CCP"]],
  [/audiolog/i, ["AuD"]],
  [/optometr/i, ["Other"]],
];

function toTitles(job: FeedJob, credentials: string | null): string[] {
  for (const [pattern, titles] of SPECIALTY_TITLES) {
    if (job.specialty && pattern.test(job.specialty)) return titles;
  }
  if (credentials) {
    for (const [pattern, titles] of CREDENTIAL_TITLES) {
      if (pattern.test(credentials)) return titles;
    }
  }
  if (job.providerType) {
    for (const [pattern, titles] of PROVIDER_TYPE_TITLES) {
      if (pattern.test(job.providerType)) return titles;
    }
  }
  // Required field. "Other" is a valid value and keeps the posting live; the
  // alternative is omitting it and having the whole job rejected.
  return ["Other"];
}

/** The "Provider Credentials" line, wherever the description's markup puts it. */
function readCredentials(html: string | null): string | null {
  if (!html) return null;
  const match = /Provider\s+Credentials:?\s*(?:<\/[^>]+>)*\s*([^<]{1,60})/i.exec(html);
  return match ? match[1].trim() || null : null;
}

/**
 * The block the description opens with, which is the posting's own headline.
 *
 * Anchored to the start on purpose. An unanchored search for "a heading that
 * has a <strong> somewhere after it" would happily lift the first paragraph
 * of a description that opened with prose instead, and publish it as the
 * headline. Anchored, a description that does not begin with a heading simply
 * falls through to the headline built from fields.
 */
const LEAD_BLOCK = /^\s*<(h1|h2|h3|h4|p)\b[^>]*>([\s\S]*?)<\/\1>/i;

function textOf(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * The posting's own headline, and the exact block it came from.
 *
 * Every description opens with one — "Urology Locum Tenens | Colorado" — and
 * it beats anything assembled from fields, because it carries the detail the
 * specialty field flattens: a role filed under Emergency Medicine whose
 * headline reads "Family Medicine - Urgent Care". LocumTenens.com asked for
 * exactly this in preference to the short title.
 *
 * The block comes back so the description can have it removed. Their own
 * worked example starts the Description at "Provider Details", because the
 * headline is sent as its own element; left in both places it prints twice.
 */
function leadHeadline(html: string | null): { text: string; block: string } | null {
  if (!html) return null;
  const match = LEAD_BLOCK.exec(html);
  if (!match) return null;
  const [block, tag, inner] = match;
  const text = textOf(inner).replace(/^[\s|:–—-]+|[\s|:–—-]+$/g, "");
  if (text.length < 8 || text.length > 140) return null;
  // A heading is always the headline. A leading <p> only counts as one when it
  // looks like one — bolded, or carrying the "Specialty Duration | State"
  // shape. Descriptions are written by hand and some open with <h1> plain,
  // some with <p><strong>, some with a <span> inside either.
  const isHeading = /^h[1-4]$/i.test(tag);
  const looksLikeHeadline =
    /<strong/i.test(inner) || text.includes("|") || /\b(locum|permanent)\b/i.test(text);
  if (!isHeading && !looksLikeHeadline) return null;
  return { text, block };
}

/** Built from fields when the description has no headline to take. */
function builtHeadline(job: FeedJob, duration: string): string {
  const state = job.state ? (US_STATES[job.state.toUpperCase()] ?? job.state) : null;
  const specialty = job.specialty ?? job.title;
  return [specialty, duration].filter(Boolean).join(" ") + (state ? ` | ${state}` : "");
}

/**
 * Specialty.
 *
 * Sent as the CRM holds it. Five values do not match their list, and they
 * offered to add the mappings on their side rather than have us rename
 * anything — the right way round, since this field also feeds the website and
 * every other board.
 *
 * The fallback strips the state suffix the short title carries ("Cardiology-CA"),
 * which is the thing their report asked us not to send unprocessed.
 */
function toSpecialty(job: FeedJob): string | null {
  if (job.specialty?.trim()) return job.specialty.trim();
  const fromTitle = job.title.replace(/\s*[-–]\s*[A-Z]{2}\s*$/, "").trim();
  return fromTitle || null;
}

function jobXml(job: FeedJob): string {
  const duration = toJobDuration(job.jobClass);
  const credentials = readCredentials(job.descriptionHtml);
  const titles = toTitles(job, credentials);
  const specialty = toSpecialty(job);

  const lead = leadHeadline(job.descriptionHtml);
  const headline = lead ? lead.text : builtHeadline(job, duration);
  // A literal string, so nothing in the markup is read as a replacement pattern.
  const description = lead
    ? job.descriptionHtml!.replace(lead.block, "").trim() || job.descriptionHtml
    : (job.descriptionHtml ?? job.descriptionText ?? job.title);

  let xml = "  <Job>\n";
  xml += field("JobReferenceID", job.reference ?? job.id);
  xml += field("ContactEmail", CONTACT_EMAIL);
  xml += field("Headline", headline);
  xml += field("Description", description);
  xml += field("JobDuration", duration);
  xml += field("ExpirationDate", toExpirationDate(job.endDate));

  if (job.state) {
    xml += "    <Locations>\n      <Location>\n";
    xml += field("State", job.state.toUpperCase(), "        ");
    xml += "      </Location>\n    </Locations>\n";
  }

  xml += "    <Titles>\n";
  for (const title of titles) xml += field("Title", title, "      ");
  xml += "    </Titles>\n";

  if (specialty) {
    xml += "    <Specialties>\n";
    xml += field("Specialty", specialty, "      ");
    xml += "    </Specialties>\n";
  }

  return xml + "  </Job>\n";
}

export function locumTenensFeedXml(jobs: FeedJob[]): string {
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    "<Jobs>\n" +
    jobs.map(jobXml).join("") +
    "</Jobs>\n"
  );
}

/**
 * The HTTP response for the feed.
 *
 * On failure this answers 503 and never an empty document, for the same
 * reason the Marit feed does: a board reads a feed as the complete list of
 * open roles, so an empty <Jobs> would deactivate all of them in one fetch.
 * A failed fetch makes them keep the last good copy instead.
 */
export async function locumTenensFeedResponse(): Promise<Response> {
  const { fetchFeedJobs } = await import("./salesforce.server");
  const result = await fetchFeedJobs();

  if (result.status !== "ok" || result.jobs.length === 0) {
    return new Response("Feed temporarily unavailable\n", {
      status: 503,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "retry-after": "900",
        "cache-control": "no-store",
      },
    });
  }

  return new Response(locumTenensFeedXml(result.jobs), {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=900, stale-while-revalidate=3600",
      "x-robots-tag": "noindex",
    },
  });
}
