import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/sms-terms")({
  head: () => ({
    meta: [
      { title: "SMS/MMS Terms & Conditions | Orchard Corp" },
      {
        name: "description",
        content:
          "Orchard Corp SMS/MMS Terms & Conditions — consent, message frequency, opt-out, and support details.",
      },
    ],
  }),
  component: SmsTermsPage,
});

function SmsTermsPage() {
  return (
    <main id="top" className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-4xl px-6 lg:px-10 py-16 md:py-20 text-[var(--foreground)] leading-relaxed">
        <h1 className="text-2xl md:text-3xl font-bold">
          Orchard Corp – SMS/MMS Terms &amp; Conditions
        </h1>

        <div className="mt-8 space-y-8">
          <section>
            <h2 className="text-lg font-semibold">1. SMS Consent Communication</h2>
            <p className="mt-3">
              Phone numbers obtained through the SMS consent process will only be
              used for communications related to job opportunities, shift
              assignments, and recruitment services provided by Orchard Corp. Your
              phone number will not be shared with third parties for marketing
              purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">2. Types of SMS Communications</h2>
            <p className="mt-3">
              If you consent to receive text messages from Orchard Corp, you may
              receive communications related to:
            </p>
            <p className="mt-4 font-medium">Marketing</p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Job alerts and available temporary healthcare positions</li>
            </ul>
            <p className="mt-4 font-medium">Customer Care</p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Shift confirmations and scheduling updates</li>
              <li>Daily reminders or instructions regarding upcoming assignments</li>
              <li>Compliance requirements, onboarding, and documentation requests</li>
              <li>Follow-up messages regarding job performance or client feedback</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">3. Message Frequency</h2>
            <p className="mt-3">
              Message frequency will vary depending on staffing needs and your
              availability. For example:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>
                You may receive multiple SMS messages per day with job offers,
                scheduling updates, or urgent staffing requests.
              </li>
              <li>
                Additional messages may be sent to confirm shifts, provide
                instructions, or deliver compliance-related information.
              </li>
            </ul>
            <p className="mt-4">
              Disclosure: “Message frequency may vary. You may receive multiple
              job-related text messages per day depending on available
              opportunities and your assignments.”
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">4. Potential Fees for SMS Messaging</h2>
            <p className="mt-3">
              Orchard Corp does not charge for SMS/MMS communications. However,
              standard message and data rates may apply depending on your wireless
              carrier and plan. Fees may vary if messages are received domestically
              or internationally.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">5. Opt-In Method</h2>
            <p className="mt-3">
              You may opt in to receive SMS messages from Orchard Corp by:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Submitting your mobile number via our online registration form</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">6. Opt-Out Method</h2>
            <p className="mt-3">
              You may opt out of SMS communications at any time by replying STOP,
              END, CANCEL, UNSUBSCRIBE, or QUIT to any message you receive from us.
              You may also email info@orchardcorp.com or call 847 861 5300 to
              request removal from the SMS list. A final confirmation message will
              be sent to acknowledge your opt-out.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">7. Help</h2>
            <p className="mt-3">For help with SMS services:</p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Reply with the keyword HELP to any Orchard Corp SMS</li>
              <li>Call us at : 847 861 5300</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">8. Standard Messaging Disclosures</h2>
            <ul className="mt-3 list-disc pl-6 space-y-1">
              <li>Message and data rates may apply.</li>
              <li>
                Message frequency may vary depending on job availability and shift
                assignments.
              </li>
              <li>Opt out at any time by texting STOP.</li>
              <li>
                For assistance, text HELP, or visit our{" "}
                <Link to="/sms-privacy" className="underline">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <a href="#top" className="underline">
                  Terms and Conditions
                </a>
                .
              </li>
            </ul>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
