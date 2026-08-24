import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { applyToJob, type ApplyResult } from "@/lib/api/jobs.functions";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, Stethoscope } from "lucide-react";
import { FormConsent } from "./FormConsent";
import { useRecaptcha } from "@/lib/recaptcha";

/**
 * reCAPTCHA site keys are public — they ship in the HTML — but they are locked
 * to a domain list, so the preview host and the live domain need different
 * keys unless both are registered against one. Reading it from the environment
 * lets each deployment carry its own without a code change. Falls back to the
 * key registered for orchardcorp.com.
 */
const SITE_KEY =
  import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? "6LfpApAsAAAAAJGnaVnxcbJVdndYjgJeW_8KPZ_n";

const inputCls =
  "w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[15px] text-[var(--deep)] placeholder:text-[var(--muted-foreground)] shadow-sm transition-all focus:border-[var(--teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--teal)]/15";
const labelCls =
  "mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--deep)]/75";

function Outcome({
  tone,
  title,
  children,
}: {
  tone: "good" | "bad";
  title: string;
  children: React.ReactNode;
}) {
  const good = tone === "good";
  return (
    <div
      className={`rounded-2xl border p-7 text-center ${
        good ? "border-[var(--teal)]/30 bg-[var(--ice)]" : "border-[var(--border)] bg-white"
      }`}
    >
      <span
        className={`mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-sm ${
          good ? "gradient-teal" : "bg-[var(--deep)]/70"
        }`}
      >
        {good ? <CheckCircle2 className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
      </span>
      <h3 className="mt-4 text-xl font-bold text-[var(--deep)]">{title}</h3>
      <div className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[var(--muted-foreground)]">
        {children}
      </div>
    </div>
  );
}

const MAX_RESUME_MB = 3;
const RESUME_TYPES = ".pdf,.doc,.docx";

/** Strip the `data:...;base64,` prefix the FileReader adds. */
function readAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).replace(/^data:[^;]*;base64,/, ""));
    reader.onerror = () => reject(new Error("Could not read that file"));
    reader.readAsDataURL(file);
  });
}

export function ApplyForm({
  jobId,
  reference,
  specialties,
}: {
  jobId: string;
  reference: string | null;
  specialties: string[];
}) {
  const [result, setResult] = useState<ApplyResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [captchaMissing, setCaptchaMissing] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const captchaRef = useRef<HTMLDivElement>(null);

  const { getToken, reset: resetCaptcha } = useRecaptcha(captchaRef, SITE_KEY);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const captchaToken = getToken();
    if (!captchaToken) {
      setCaptchaMissing(true);
      return;
    }
    setCaptchaMissing(false);

    // Read the resume before anything else so a bad file fails fast and locally.
    let resume: { filename: string; contentType: string; base64: string } | undefined;
    const file = (data.get("resume") as File | null) ?? null;
    if (file && file.size > 0) {
      if (file.size > MAX_RESUME_MB * 1024 * 1024) {
        setResumeError(`That file is over ${MAX_RESUME_MB} MB. Please attach a smaller one.`);
        return;
      }
      if (!/\.(pdf|docx?)$/i.test(file.name)) {
        setResumeError("Please attach a PDF or Word document.");
        return;
      }
      try {
        resume = {
          filename: file.name,
          contentType: file.type || "application/pdf",
          base64: await readAsBase64(file),
        };
      } catch {
        setResumeError("Could not read that file. Please try another.");
        return;
      }
    }
    setResumeError(null);
    setSubmitting(true);

    try {
      const outcome = await applyToJob({
        data: {
          jobId,
          firstName: String(data.get("firstName") ?? ""),
          lastName: String(data.get("lastName") ?? ""),
          email: String(data.get("email") ?? ""),
          phone: String(data.get("phone") ?? ""),
          dateAvailable: String(data.get("dateAvailable") ?? ""),
          licenseStatus: String(data.get("licenseStatus") ?? ""),
          specialty: String(data.get("specialty") ?? ""),
          smsOptIn: data.get("sms_opt_in__c") === "on",
          termsAccepted: data.get("terms_agreed") === "on",
          resume,
          captchaToken,
          website: String(data.get("website") ?? ""),
        },
      });
      setResult(outcome);
      if (outcome.status !== "created" && outcome.status !== "duplicate") {
        resetCaptcha();
      }
    } catch {
      setResult({ status: "error" });
      resetCaptcha();
    } finally {
      setSubmitting(false);
    }
  }

  if (result?.status === "created") {
    return (
      <Outcome tone="good" title="Application received">
        Thank you — your details are with our team and a physician-led recruiter will be in touch.{" "}
        {reference && (
          <>
            Your reference is <strong className="text-[var(--deep)]">{reference}</strong>.
          </>
        )}{" "}
        We won't present you to any facility without your explicit approval.
      </Outcome>
    );
  }

  if (result?.status === "duplicate") {
    return (
      <Outcome tone="good" title="You've already applied for this one">
        We have your application for this role on file, so there's nothing more to do. If anything
        has changed, call us on 847 861 5300 and we'll update your file.
      </Outcome>
    );
  }

  if (result?.status === "needs-review") {
    return (
      <Outcome tone="good" title="We already have you on file">
        That email is already in our system, so we've flagged your interest rather than creating a
        second record. A recruiter will be in touch about this role — or call 847 861 5300 to speak
        to someone now.
      </Outcome>
    );
  }

  if (result?.status === "job-unavailable") {
    return (
      <Outcome tone="bad" title="This role just closed">
        It was filled or withdrawn while you were filling this in — sorry.{" "}
        <Link to="/jobs" className="font-semibold text-[var(--ocean)] underline">
          Browse the current openings
        </Link>
        .
      </Outcome>
    );
  }

  if (result?.status === "bad-resume") {
    return (
      <Outcome tone="bad" title="We couldn't accept that file">
        Resumes need to be a PDF or Word document under {MAX_RESUME_MB} MB.
        <div className="mt-5">
          <button
            type="button"
            onClick={() => setResult(null)}
            className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--deep)] transition-colors hover:bg-[var(--ice)]"
          >
            Back to the form
          </button>
        </div>
      </Outcome>
    );
  }

  if (result?.status === "rejected") {
    return (
      <Outcome tone="bad" title="We couldn't verify that">
        The robot check didn't go through — it may simply have expired while you were typing. Please
        try again.
        <div className="mt-5">
          <button
            type="button"
            onClick={() => setResult(null)}
            className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--deep)] transition-colors hover:bg-[var(--ice)]"
          >
            Back to the form
          </button>
        </div>
      </Outcome>
    );
  }

  if (result) {
    return (
      <Outcome tone="bad" title="We couldn't submit that">
        Something went wrong on our side. Please try again, or call us on 847 861 5300 and we'll
        take your details directly.
        <div className="mt-5">
          <button
            type="button"
            onClick={() => setResult(null)}
            className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--deep)] transition-colors hover:bg-[var(--ice)]"
          >
            Try again
          </button>
        </div>
      </Outcome>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Honeypot — off-screen and hidden from assistive tech. */}
      <div className="absolute left-[-9999px]" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className={labelCls}>
            First name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            maxLength={40}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="lastName" className={labelCls}>
            Last name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            maxLength={80}
            className={inputCls}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={labelCls}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={120}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelCls}>
            Phone
          </label>
          <input id="phone" name="phone" type="tel" maxLength={40} className={inputCls} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-[1fr_1.6fr]">
        <div>
          <label htmlFor="dateAvailable" className={labelCls}>
            Available from
          </label>
          <input id="dateAvailable" name="dateAvailable" type="date" className={inputCls} />
        </div>
        <div>
          <label htmlFor="licenseStatus" className={labelCls}>
            Licensure
          </label>
          <input
            id="licenseStatus"
            name="licenseStatus"
            type="text"
            maxLength={300}
            placeholder="States you're licensed in, or IMLC status"
            className={inputCls}
          />
        </div>
      </div>

      {/* Full width since NPI was removed — it used to sit alongside. */}
      <div className="grid gap-5">
        <div>
          <label htmlFor="specialty" className={labelCls}>
            Specialty
          </label>
          {specialties.length > 0 ? (
            <span className="relative block">
              <Stethoscope className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ocean)]" />
              <select
                id="specialty"
                name="specialty"
                defaultValue=""
                className="w-full appearance-none rounded-xl border border-[var(--border)] bg-white py-3 pl-10 pr-9 text-[15px] text-[var(--deep)] shadow-sm transition-all focus:border-[var(--teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--teal)]/15"
              >
                <option value="">Select your specialty…</option>
                {specialties.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </span>
          ) : (
            /* Salesforce unreachable — a free-text box beats no field at all. */
            <input
              id="specialty"
              name="specialty"
              type="text"
              maxLength={120}
              className={inputCls}
            />
          )}
        </div>
      </div>

      <div>
        <label htmlFor="resume" className={labelCls}>
          Resume or CV <span className="normal-case tracking-normal opacity-60">(optional)</span>
        </label>
        <input
          id="resume"
          name="resume"
          type="file"
          accept={RESUME_TYPES}
          className="w-full cursor-pointer rounded-xl border border-dashed border-[var(--border)] bg-white px-4 py-3 text-[14px] text-[var(--muted-foreground)] shadow-sm transition-all file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-[var(--ice)] file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-[0.1em] file:text-[var(--ocean)] hover:border-[var(--teal)]"
        />
        <p className="mt-2 text-xs text-[var(--muted-foreground)]">
          PDF or Word, up to {MAX_RESUME_MB} MB.
        </p>
        {resumeError && <p className="mt-2 text-sm font-semibold text-[#B4432F]">{resumeError}</p>}
      </div>

      <div className="flex justify-center pt-1">
        <div className="recaptcha-fit">
          {/* Provider-side consent copy is the right one here: this applicant
              works assignments, so shift confirmations and job alerts describe
              what they would actually receive. Terms is required and blocks
              submit; SMS is optional, as the TCPA requires. */}
          <FormConsent />

          <div ref={captchaRef} />
        </div>
      </div>
      {captchaMissing && (
        <p className="text-center text-sm font-semibold text-[#B4432F]">
          Please confirm you're not a robot.
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-semibold text-white shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
        style={{ background: "linear-gradient(135deg, #3D9AB8 0%, #5097D5 50%, #467A9F 100%)" }}
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting…
          </>
        ) : (
          <>
            Submit application
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      <p className="text-center text-xs leading-relaxed text-[var(--muted-foreground)]">
        We promise not to present any physician or provider anywhere without their explicit
        approval. You stay in control.
      </p>
    </form>
  );
}
