import { Link } from "@tanstack/react-router";

/**
 * SMS consent + Terms agreement checkboxes, shared by every Salesforce form.
 *
 * SMS consent is intentionally OPTIONAL: under the TCPA you may not condition
 * a service on agreeing to receive marketing messages. Terms agreement IS
 * required, which is a permissible condition of using the service.
 */
export function FormConsent() {
  return (
    <div className="space-y-3">
      {/* SMS opt-in — optional */}
      <div className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--ice)] p-4">
        <input
          type="checkbox"
          id="sms_opt_in"
          name="sms_opt_in__c"
          className="mt-1 h-5 w-5 flex-none cursor-pointer accent-[var(--teal)]"
        />
        <label htmlFor="sms_opt_in" className="text-xs leading-relaxed text-[var(--muted-foreground)]">
          By checking this box, you agree to receive SMS messages from Orchard Corp
          related to Marketing for Job alerts and available temporary healthcare
          positions and customer care sms and Customer Care for shift confirmations
          and scheduling updates, Daily reminders or instructions regarding upcoming
          assignments, Compliance requirements, onboarding, and documentation
          requests, Follow-up messages regarding job performance or client feedback.
          You may reply STOP to opt out at any time. Reply to HELP to 847 861 5300
          for assistance. Messages and data rates may apply. Message frequency will
          vary. Learn more on our{" "}
          <Link to="/sms-privacy" className="font-semibold text-[var(--ocean)] underline">
            Privacy Policy
          </Link>{" "}
          page and{" "}
          <Link to="/sms-terms" className="font-semibold text-[var(--ocean)] underline">
            Terms &amp; Conditions
          </Link>
          .
        </label>
      </div>

      {/* Terms agreement — required */}
      <div className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-white p-4">
        <input
          type="checkbox"
          id="terms_agreed"
          name="terms_agreed"
          required
          className="mt-1 h-5 w-5 flex-none cursor-pointer accent-[var(--teal)]"
        />
        <label htmlFor="terms_agreed" className="text-xs leading-relaxed text-[var(--muted-foreground)]">
          <span className="font-semibold text-[var(--deep)]">I agree to the Terms &amp; Conditions.</span>{" "}
          I have read and accept Orchard Corp's{" "}
          <Link to="/sms-terms" className="font-semibold text-[var(--ocean)] underline">
            Terms &amp; Conditions
          </Link>{" "}
          and{" "}
          <Link to="/sms-privacy" className="font-semibold text-[var(--ocean)] underline">
            Privacy Policy
          </Link>
          . <span className="text-[var(--deep)]/60">(Required)</span>
        </label>
      </div>
    </div>
  );
}
