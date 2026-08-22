/**
 * 301s from the previous site's URLs.
 *
 * These pages have been indexed on this domain for years and carry whatever
 * authority the old site earned. Left to 404 they lose it; a permanent
 * redirect passes it to the page that replaced them.
 *
 * 301 rather than 302 on purpose — a temporary redirect tells Google to keep
 * the old URL as the indexed one, which is the opposite of what a migration
 * wants.
 */
const EXPLICIT: Record<string, string> = {
  "/index.html": "/",
  "/job-openings.html": "/jobs",
  "/about.html": "/about",
  "/staffing.html": "/staffing",
  "/services.html": "/services",
  // The old site's CEO page; the equivalent here covers the whole team.
  "/ceo.html": "/leadership",
};

/**
 * Routes a bare `.html` strip is allowed to land on. The old site may hold
 * URLs beyond the list above, and `/contact.html` → `/contact` would be a
 * redirect into a 404 — worse than the 404 it replaced. Only names that
 * exist here are followed.
 */
const KNOWN_ROUTES = new Set([
  "/about",
  "/careers",
  "/client-inquiry",
  "/consulting",
  "/credentialing",
  "/inquiry",
  "/investors",
  "/jobs",
  "/leadership",
  "/provider-inquiry",
  "/providers",
  "/refer-a-friend",
  "/services",
  "/sms-privacy",
  "/sms-terms",
  "/staffing",
  "/telemedicine",
  "/terms",
]);

/** Returns a 301 for a legacy URL, or null to let the router handle it. */
export function legacyRedirect(url: URL): Response | null {
  const path = url.pathname.toLowerCase();

  let target = EXPLICIT[path] ?? null;
  if (!target && path.endsWith(".html")) {
    const stripped = path.slice(0, -".html".length);
    if (KNOWN_ROUTES.has(stripped)) target = stripped;
  }
  if (!target) return null;

  return new Response(null, {
    status: 301,
    headers: {
      // Relative, so the redirect is correct on whichever host served it.
      location: `${target}${url.search}`,
      "cache-control": "public, max-age=3600",
    },
  });
}
