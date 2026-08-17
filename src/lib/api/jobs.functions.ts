import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { Job, JobDetail } from "../salesforce.server";

/**
 * Public shape of the jobs feed. The Salesforce error detail is deliberately
 * dropped here — visitors get a generic message, operators get the console log.
 */
export type JobsFeed =
  | { status: "ok"; jobs: Job[] }
  | { status: "unconfigured" }
  | { status: "error" };

export type JobDetailResult =
  | { status: "ok"; job: JobDetail }
  /** Unknown id, or a job that no longer passes the public filter. */
  | { status: "not-found" }
  | { status: "unconfigured" }
  | { status: "error" };

export const getJobs = createServerFn({ method: "GET" }).handler(async (): Promise<JobsFeed> => {
  const { fetchJobs } = await import("../salesforce.server");
  const result = await fetchJobs();

  if (result.status === "ok") return { status: "ok", jobs: result.jobs };
  if (result.status === "unconfigured") return { status: "unconfigured" };
  return { status: "error" };
});

export const getJob = createServerFn({ method: "GET" })
  .inputValidator(z.object({ id: z.string().min(1).max(20) }))
  .handler(async ({ data }): Promise<JobDetailResult> => {
    const { fetchJobById } = await import("../salesforce.server");
    const result = await fetchJobById(data.id);

    if (result === null) return { status: "not-found" };
    if (result && "error" in result) {
      return result.error === "unconfigured" ? { status: "unconfigured" } : { status: "error" };
    }
    return { status: "ok", job: result };
  });
