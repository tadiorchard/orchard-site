import { createServerFn } from "@tanstack/react-start";

/**
 * The live half of the sitewide search index.
 *
 * Deliberately slim. The overlay matches on title, place and specialty, so
 * shipping descriptions would multiply the payload for text nobody types into
 * a search box. Around 320 open roles lands near 25KB of JSON before
 * compression.
 *
 * It is fetched on first open rather than at page load: search is a deliberate
 * act, and a visitor who never opens it should not pay for the index.
 */
export type SearchJob = {
  id: string;
  title: string;
  city: string | null;
  state: string | null;
  specialty: string | null;
};

export type SearchLanding = {
  name: string;
  slug: string;
  count: number;
  kind: "state" | "specialty";
};

export type SearchIndex = {
  jobs: SearchJob[];
  landing: SearchLanding[];
};

export const getSearchIndex = createServerFn({ method: "GET" }).handler(
  async (): Promise<SearchIndex> => {
    const { fetchJobs } = await import("../salesforce.server");
    const { US_STATES, stateSlug, specialtySlug, MIN_JOBS_FOR_PAGE } = await import(
      "../taxonomy"
    );

    const result = await fetchJobs();
    // A CRM outage degrades search to the marketing pages rather than killing
    // it — the static half of the index lives on the client regardless.
    if (result.status !== "ok") return { jobs: [], landing: [] };

    const jobs: SearchJob[] = result.jobs.map((job) => ({
      id: job.id,
      title: job.title,
      city: job.city,
      state: job.state,
      specialty: job.specialty,
    }));

    const stateCounts = new Map<string, number>();
    const specialtyCounts = new Map<string, number>();
    for (const job of result.jobs) {
      const code = job.state?.toUpperCase();
      if (code && US_STATES[code]) stateCounts.set(code, (stateCounts.get(code) ?? 0) + 1);
      const specialty = job.specialty?.trim();
      if (specialty) specialtyCounts.set(specialty, (specialtyCounts.get(specialty) ?? 0) + 1);
    }

    // Only landing pages that actually exist. The hub gates them on a job
    // minimum, and offering a search result that 404s is worse than offering
    // nothing.
    const landing: SearchLanding[] = [];
    for (const [code, count] of stateCounts) {
      const slug = stateSlug(code);
      if (slug && count >= MIN_JOBS_FOR_PAGE) {
        landing.push({ name: US_STATES[code], slug, count, kind: "state" });
      }
    }
    for (const [name, count] of specialtyCounts) {
      if (count >= MIN_JOBS_FOR_PAGE) {
        landing.push({ name, slug: specialtySlug(name), count, kind: "specialty" });
      }
    }
    landing.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    return { jobs, landing };
  },
);
