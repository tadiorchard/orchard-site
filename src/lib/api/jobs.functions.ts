import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import process from "node:process";

import type { ApplicationResult, Job, JobDetail } from "../salesforce.server";

/**
 * Public shape of the jobs feed. The Salesforce error detail is deliberately
 * dropped here — visitors get a generic message, operators get the console log.
 */
export type JobsFeed =
  { status: "ok"; jobs: Job[] } | { status: "unconfigured" } | { status: "error" };

export type JobDetailResult =
  /** `applyEnabled` is false until a reCAPTCHA secret exists; the page then
   *  offers the contact route instead of a form that would reject everyone. */
  | { status: "ok"; job: JobDetail; applyEnabled: boolean; specialties: string[] }
  /** Unknown id, or a job that no longer passes the public filter. */
  | { status: "not-found" }
  | { status: "unconfigured" }
  | { status: "error" };

/** Counts behind the hub page and the sitemap, derived from the live feed. */
export type Taxonomy = {
  states: Array<{ code: string; name: string; slug: string; count: number }>;
  specialties: Array<{ name: string; slug: string; count: number }>;
  total: number;
};

export const getTaxonomy = createServerFn({ method: "GET" }).handler(async (): Promise<Taxonomy> => {
  const { fetchJobs } = await import("../salesforce.server");
  const { US_STATES, stateSlug, specialtySlug } = await import("../taxonomy");
  const result = await fetchJobs();
  if (result.status !== "ok") return { states: [], specialties: [], total: 0 };

  const stateCounts = new Map<string, number>();
  const specialtyCounts = new Map<string, number>();
  for (const job of result.jobs) {
    const code = job.state?.toUpperCase();
    if (code && US_STATES[code]) stateCounts.set(code, (stateCounts.get(code) ?? 0) + 1);
    const specialty = job.specialty?.trim();
    if (specialty) specialtyCounts.set(specialty, (specialtyCounts.get(specialty) ?? 0) + 1);
  }

  return {
    states: [...stateCounts.entries()]
      .map(([code, count]) => ({ code, name: US_STATES[code], slug: stateSlug(code)!, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    specialties: [...specialtyCounts.entries()]
      .map(([name, count]) => ({ name, slug: specialtySlug(name), count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    total: result.jobs.length,
  };
});

export type LandingResult =
  | { status: "ok"; kind: "state" | "specialty"; name: string; jobs: Job[]; cities: string[]; related: Array<{ name: string; slug: string; count: number }> }
  | { status: "not-found" }
  | { status: "error" };

export const getLandingPage = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string().min(1).max(60) }))
  .handler(async ({ data }): Promise<LandingResult> => {
    const { fetchJobs } = await import("../salesforce.server");
    const { resolveSlug, specialtySlug, stateSlug, US_STATES } = await import("../taxonomy");
    const result = await fetchJobs();
    if (result.status !== "ok") return { status: "error" };

    const specialties = [...new Set(result.jobs.map((j) => j.specialty?.trim()).filter(Boolean))] as string[];
    const target = resolveSlug(data.slug, specialties);
    if (!target) return { status: "not-found" };

    const jobs =
      target.kind === "state"
        ? result.jobs.filter((j) => j.state?.toUpperCase() === target.code)
        : result.jobs.filter((j) => j.specialty?.trim() === target.name);

    // Cross-links give each page somewhere to send a visitor whose search was
    // close but not exact, and spread crawl depth across the whole set. A state
    // page lists the specialties open there; a specialty page lists the states.
    const counts = new Map<string, number>();
    for (const job of jobs) {
      const key =
        target.kind === "state" ? job.specialty?.trim() : job.state?.toUpperCase();
      if (!key) continue;
      if (target.kind === "specialty" && !US_STATES[key]) continue;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    const related = [...counts.entries()]
      .map(([key, count]) =>
        target.kind === "state"
          ? { name: key, slug: specialtySlug(key), count }
          : { name: US_STATES[key], slug: stateSlug(key) ?? "", count },
      )
      .filter((r) => r.slug)
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);

    const cities = [...new Set(jobs.map((j) => j.city).filter(Boolean))].slice(0, 8) as string[];

    return { status: "ok", kind: target.kind, name: target.name, jobs, cities, related };
  });

/**
 * The roles a page leads with: High priority first, newest within that, then
 * topped up with the newest of whatever else is open so the row is never left
 * half empty.
 *
 * Shared because the homepage and the provider inquiry page both front a
 * short list, and two copies of this had already drifted — one sorted, the
 * other took whatever the feed happened to return first.
 */
export function featuredJobs(jobs: Job[], count: number): Job[] {
  const byNewest = (a: Job, b: Job) => (b.postedAt ?? "").localeCompare(a.postedAt ?? "");
  const high = jobs.filter((j) => j.priority === "High").sort(byNewest);
  const rest = jobs.filter((j) => j.priority !== "High").sort(byNewest);
  return [...high, ...rest].slice(0, count);
}

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
    const { fetchJobById, getSpecialtyOptions } = await import("../salesforce.server");
    const result = await fetchJobById(data.id);

    if (result === null) return { status: "not-found" };
    if (result && "error" in result) {
      return result.error === "unconfigured" ? { status: "unconfigured" } : { status: "error" };
    }
    return {
      status: "ok",
      job: result,
      applyEnabled: !!process.env.RECAPTCHA_SECRET_KEY,
      specialties: await getSpecialtyOptions(),
    };
  });

/** Mirrors the form; `website` is a honeypot that real users never fill in. */
const applicationSchema = z.object({
  jobId: z.string().regex(/^[a-zA-Z0-9]{15,18}$/),
  firstName: z.string().trim().min(1).max(40),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(120),
  phone: z.string().trim().max(40).optional(),
  dateAvailable: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal("")),
  licenseStatus: z.string().trim().max(500).optional(),
  specialty: z.string().trim().max(120).optional(),
  resume: z
    .object({
      filename: z.string().min(1).max(255),
      contentType: z.string().max(120),
      // 3 MB raw, base64 inflated by a third, plus headroom.
      base64: z.string().max(4_400_000),
    })
    .optional(),
  smsOptIn: z.boolean().default(false),
  termsAccepted: z.boolean(),
  captchaToken: z.string().max(4000),
  website: z.string().max(0).optional(),
});

export type ApplyResult = ApplicationResult | { status: "rejected" } | { status: "bad-resume" };

/**
 * Confirms the reCAPTCHA token with Google.
 *
 * Fails closed: without a configured secret this returns false, so an
 * unverified request can never write into the CRM. A public endpoint that
 * creates Contacts is exactly what spam bots look for.
 */
async function captchaPassed(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret || !token) return false;
  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const body = (await response.json()) as { success?: boolean };
    return body.success === true;
  } catch {
    return false;
  }
}

export const applyToJob = createServerFn({ method: "POST" })
  .inputValidator(applicationSchema)
  .handler(async ({ data }): Promise<ApplyResult> => {
    if (data.website) return { status: "rejected" };
    // The checkbox is `required` in the markup, but a scripted post never sees
    // the markup. Refused here too, so no application is stored without it.
    if (!data.termsAccepted) return { status: "rejected" };
    if (!(await captchaPassed(data.captchaToken))) return { status: "rejected" };

    if (data.resume) {
      const { ALLOWED_RESUME_TYPES, MAX_RESUME_BYTES } = await import("../salesforce.server");
      const allowed: readonly string[] = ALLOWED_RESUME_TYPES;
      if (!allowed.includes(data.resume.contentType)) return { status: "bad-resume" };
      // base64 is 4 chars per 3 bytes; close enough to enforce the cap.
      if ((data.resume.base64.length * 3) / 4 > MAX_RESUME_BYTES) return { status: "bad-resume" };
    }

    const { submitApplication } = await import("../salesforce.server");
    return submitApplication({
      jobId: data.jobId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || undefined,
      dateAvailable: data.dateAvailable || undefined,
      licenseStatus: data.licenseStatus || undefined,
      specialty: data.specialty || undefined,
      smsOptIn: data.smsOptIn,
      resume: data.resume,
    });
  });
