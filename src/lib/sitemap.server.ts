import { SITE_URL, absoluteUrl } from "./seo";

/**
 * robots.txt and sitemap.xml, served from the SSR entry.
 *
 * They are generated rather than dropped in public/ for one reason: the job
 * pages are the crawlable surface that matters here, and there are hundreds of
 * them coming from Salesforce. A static file would be stale the day it shipped.
 */

/** Pages that exist but should not be crawled — thin, transactional, or private. */
const EXCLUDED = new Set([
  "/telemedicine",
  "/consulting",
  "/credentialing",
  "/thank-you",
]);

/** Static routes with the weight each carries for a staffing site. */
const STATIC_ROUTES: Array<{ path: string; changefreq: string; priority: string }> = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/jobs", changefreq: "daily", priority: "0.9" },
  { path: "/locum-tenens-jobs", changefreq: "daily", priority: "0.9" },
  { path: "/client-inquiry", changefreq: "monthly", priority: "0.8" },
  { path: "/provider-inquiry", changefreq: "monthly", priority: "0.8" },
  { path: "/services", changefreq: "monthly", priority: "0.7" },
  { path: "/providers", changefreq: "monthly", priority: "0.7" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/leadership", changefreq: "monthly", priority: "0.5" },
  { path: "/testimonials", changefreq: "monthly", priority: "0.5" },
  { path: "/refer-a-friend", changefreq: "monthly", priority: "0.5" },
  { path: "/careers", changefreq: "weekly", priority: "0.5" },
  { path: "/investors", changefreq: "monthly", priority: "0.4" },
  { path: "/inquiry", changefreq: "monthly", priority: "0.4" },
  { path: "/terms", changefreq: "yearly", priority: "0.2" },
  { path: "/sms-terms", changefreq: "yearly", priority: "0.2" },
  { path: "/sms-privacy", changefreq: "yearly", priority: "0.2" },
];

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function robotsTxt(): Response {
  // No Disallow lines. The pages we keep out of the index carry a noindex tag,
  // and a page Google is blocked from crawling is a page whose noindex it never
  // reads — blocking them would strand them in the index as bare URLs instead.
  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${absoluteUrl("/sitemap.xml")}`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}

export async function sitemapXml(): Promise<Response> {
  const today = new Date().toISOString().slice(0, 10);

  const entries = STATIC_ROUTES.filter((r) => !EXCLUDED.has(r.path)).map((r) => ({
    loc: absoluteUrl(r.path),
    lastmod: today,
    changefreq: r.changefreq,
    priority: r.priority,
  }));

  // Live roles, plus a landing page per state and specialty that has enough
  // openings to justify one. If Salesforce is unreachable the sitemap still
  // ships the static pages — a partial sitemap beats a 500 to a crawler.
  try {
    const { fetchJobs } = await import("./salesforce.server");
    const { US_STATES, stateSlug, specialtySlug, landingPath, MIN_JOBS_FOR_PAGE } = await import(
      "./taxonomy"
    );
    const result = await fetchJobs();
    if (result.status === "ok") {
      for (const job of result.jobs) {
        entries.push({
          loc: absoluteUrl(`/jobs/${job.id}`),
          lastmod: job.postedAt ? job.postedAt.slice(0, 10) : today,
          changefreq: "daily",
          priority: "0.7",
        });
      }

      const states = new Map<string, number>();
      const specialties = new Map<string, number>();
      for (const job of result.jobs) {
        const code = job.state?.toUpperCase();
        if (code && US_STATES[code]) states.set(code, (states.get(code) ?? 0) + 1);
        const specialty = job.specialty?.trim();
        if (specialty) specialties.set(specialty, (specialties.get(specialty) ?? 0) + 1);
      }

      const landing: string[] = [];
      for (const [code, count] of states) {
        const slug = stateSlug(code);
        if (slug && count >= MIN_JOBS_FOR_PAGE) landing.push(slug);
      }
      for (const [name, count] of specialties) {
        if (count >= MIN_JOBS_FOR_PAGE) landing.push(specialtySlug(name));
      }
      for (const slug of landing) {
        entries.push({
          loc: absoluteUrl(landingPath(slug)),
          lastmod: today,
          changefreq: "daily",
          priority: "0.8",
        });
      }
    }
  } catch (error) {
    console.error("sitemap: job feed unavailable", error);
  }

  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries
      .map(
        (e) =>
          "  <url>\n" +
          `    <loc>${xmlEscape(e.loc)}</loc>\n` +
          `    <lastmod>${e.lastmod}</lastmod>\n` +
          `    <changefreq>${e.changefreq}</changefreq>\n` +
          `    <priority>${e.priority}</priority>\n` +
          "  </url>",
      )
      .join("\n") +
    "\n</urlset>\n";

  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      // Jobs move daily; an hour keeps crawlers current without hammering the CRM.
      "cache-control": "public, max-age=3600",
    },
  });
}

export { SITE_URL };
