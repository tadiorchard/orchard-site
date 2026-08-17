import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { applyToJob, type ApplyResult } from "@/lib/api/jobs.functions";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";

const SITE_KEY = "6LfpApAsAAAAAJGnaVnxcbJVdndYjgJeW_8KPZ_n";

declare global {
  interface Window {
    grecaptcha?: { getResponse: (id?: number) => string; reset: (id?: number) => void };
  }
}

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

export function ApplyForm({ jobId, reference }: { jobId: string; reference: string | null }) {
  const [result, setResult] = useState<ApplyResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [captchaMissing, setCaptchaMissing] = useState(false);
  const captchaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (document.querySelector('script[src*="recaptcha/api.js"]')) return;
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const captchaToken = window.grecaptcha?.getResponse() ?? "";
    if (!captchaToken) {
      setCaptchaMissing(true);
      return;
    }
    setCaptchaMissing(false);
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
          boardStatus: String(data.get("boardStatus") ?? ""),
          message: String(data.get("message") ?? ""),
          smsOptIn: data.get("smsOptIn") === "on",
          captchaToken,
          website: String(data.get("website") ?? ""),
        },
      });
      setResult(outcome);
      if (outcome.status !== "created" && outcome.status !== "duplicate") {
        window.grecaptcha?.reset();
      }
    } catch {
      setResult({ status: "error" });
      window.grecaptcha?.reset();
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

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="dateAvailable" className={labelCls}>
            Available from
          </label>
          <input id="dateAvailable" name="dateAvailable" type="date" className={inputCls} />
        </div>
        <div>
          <label htmlFor="boardStatus" className={labelCls}>
            Board status
          </label>
          <input
            id="boardStatus"
            name="boardStatus"
            type="text"
            maxLength={200}
            placeholder="Board certified / eligible"
            className={inputCls}
          />
        </div>
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

      <div>
        <label htmlFor="message" className={labelCls}>
          Anything else we should know?
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={2000}
          className={`${inputCls} min-h-[110px] resize-y`}
        />
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--ice)] p-4">
        <input
          type="checkbox"
          id="smsOptIn"
          name="smsOptIn"
          className="mt-1 h-5 w-5 flex-none cursor-pointer accent-[var(--teal)]"
        />
        <label
          htmlFor="smsOptIn"
          className="text-xs leading-relaxed text-[var(--muted-foreground)]"
        >
          Text me about this and similar assignments. Reply STOP to opt out, HELP to 847 861 5300
          for help. Message and data rates may apply, frequency varies. See our{" "}
          <Link to="/sms-privacy" className="font-semibold text-[var(--ocean)] underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link to="/sms-terms" className="font-semibold text-[var(--ocean)] underline">
            Terms &amp; Conditions
          </Link>
          .
        </label>
      </div>

      <div className="flex justify-center pt-1">
        <div className="recaptcha-fit">
          <div ref={captchaRef} className="g-recaptcha" data-sitekey={SITE_KEY} />
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
