import { createServerFn } from "@tanstack/react-start";

import type { Job } from "../salesforce.server";

/**
 * Public shape of the jobs feed. The Salesforce error detail is deliberately
 * dropped here — visitors get a generic message, operators get the console log.
 */
export type JobsFeed =
  | { status: "ok"; jobs: Job[] }
  | { status: "unconfigured" }
  | { status: "error" };

export const getJobs = createServerFn({ method: "GET" }).handler(async (): Promise<JobsFeed> => {
  const { fetchJobs } = await import("../salesforce.server");
  const result = await fetchJobs();

  if (result.status === "ok") return { status: "ok", jobs: result.jobs };
  if (result.status === "unconfigured") return { status: "unconfigured" };
  return { status: "error" };
});
