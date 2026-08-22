import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

/**
 * Lets the CDN serve HTML instead of running the render for every visitor.
 *
 * Nothing here is per-user — no accounts, no session — and the job feed is
 * already cached server-side with its own TTL, so a minute at the edge costs
 * no freshness that the data does not already have. `stale-while-revalidate`
 * means the refresh happens behind a cache hit rather than in front of a
 * visitor.
 *
 * Browsers still revalidate every time (max-age=0), so a deploy is never
 * hidden behind a stale local copy.
 *
 * GET HTML only — server-function POSTs write to Salesforce and must never be
 * cached. The framework already sets its own "max-age=0, must-revalidate" on
 * every document, so this deliberately overwrites rather than deferring to an
 * existing header; robots.txt and sitemap.xml return earlier in the handler
 * and never reach here, so their own policy is untouched.
 */
function withEdgeCache(request: Request, response: Response): Response {
  if (request.method !== "GET" || response.status !== 200) return response;
  if (!(response.headers.get("content-type") ?? "").includes("text/html")) return response;

  const headers = new Headers(response.headers);
  headers.set("cache-control", "public, max-age=0, s-maxage=60, stale-while-revalidate=600");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      const { pathname } = url;

      // Old .html URLs from the previous site, 301'd before anything else so
      // they never reach the router and 404.
      const { legacyRedirect } = await import("./lib/redirects.server");
      const redirect = legacyRedirect(url);
      if (redirect) return redirect;

      // robots.txt and sitemap.xml are generated, not static files: the job
      // pages are the crawlable surface that matters and they come from
      // Salesforce, so a file in public/ would be stale immediately.
      if (pathname === "/robots.txt") {
        const { robotsTxt } = await import("./lib/sitemap.server");
        return robotsTxt();
      }
      if (pathname === "/sitemap.xml") {
        const { sitemapXml } = await import("./lib/sitemap.server");
        return await sitemapXml();
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return withEdgeCache(request, await normalizeCatastrophicSsrResponse(response));
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
