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
  // NPI is exactly ten digits; anything else is a typo, not a number.
  npi: z
    .string()
    .trim()
    .regex(/^\d{10}$/)
    .optional()
    .or(z.literal("")),
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
      npi: data.npi || undefined,
      smsOptIn: data.smsOptIn,
      resume: data.resume,
    });
  });
