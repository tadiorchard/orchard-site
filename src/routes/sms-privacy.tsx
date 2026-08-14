import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/sms-privacy")({
  head: () => ({
    meta: [
      { title: "SMS Privacy Policy | Orchard Corp" },
      {
        name: "description",
        content:
          "How Orchard Corp collects, uses, and safeguards information related to SMS communications.",
      },
    ],
  }),
  component: SmsPrivacyPage,
});

function SmsPrivacyPage() {
  return (
    <main id="top" className="min-h-screen">
      <Navbar overlay tone="light" />

      <div className="mx-auto max-w-4xl px-6 lg:px-10 pt-34 pb-16 md:pt-38 md:pb-20 text-[var(--foreground)] leading-relaxed">
        <h1 className="text-2xl md:text-3xl font-bold">SMS Privacy Policy</h1>

        <p className="mt-4">
          Privacy Policy Disclaimer: Mobile Opt in, SMS Consent, and phone
          numbers collected for SMS communication purposes will not be shared
          with any third party and affiliates for marketing purposes.
        </p>

        <div className="mt-8 space-y-8">
          <section>
            <h2 className="text-lg font-semibold">Overview</h2>
            <p className="mt-3">
              At Orchard, Inc ("we," "us," "our"), we value your privacy and are
              committed to protecting your personal information. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your
              information when you opt-in to receive SMS/text messages from us.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Information We Collect</h2>
            <p className="mt-3">
              When you sign up for our SMS/texting services, we may collect the
              following information:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Phone Number: Required to send you SMS/text messages.</li>
              <li>Name: Optional, but helps personalize our messages.</li>
              <li>Consent Records: To document your opt-in to our SMS/texting services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">How We Use Your Information</h2>
            <p className="mt-3">We use the information we collect to:</p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Send you updates and other information via SMS/text messages.</li>
              <li>Respond to your inquiries and provide customer support.</li>
              <li>
                Monitor and analyze trends, usage, and activities related to our
                SMS/texting services.
              </li>
              <li>Improve our services and develop new features.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Sharing Your Information</h2>
            <p className="mt-3">
              We do not sell, trade, or otherwise transfer your personal
              information to outside parties, including for marketing purposes. We
              may share your information with:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>
                Service Providers: Third-party vendors who assist us in operating
                our SMS/texting services and conducting our business, with the
                exception of not sharing information obtained by SMS opt-in and
                phone numbers collected for SMS consent.
              </li>
              <li>
                Legal Compliance: When required by law, such as to comply with a
                subpoena, or similar legal process.
              </li>
              <li>
                Business Transfers: In connection with a merger, sale of company
                assets, or other business transaction, with the exception of not
                sharing information obtained by SMS opt-in and phone numbers
                collected for SMS consent.
              </li>
              <li>You can send us your documentation via info@orchardcorp.com</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Your Choices</h2>
            <p className="mt-3">
              You may opt out of receiving SMS/text messages from us at any time
              by:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Texting "STOP" to the number from which you received the message.</li>
              <li>Contact us at info@orchardcorp.com.</li>
            </ul>
            <p className="mt-3">
              Please note that even if you opt out of receiving promotional
              messages, we may still send you transactional or administrative
              messages.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Data Security</h2>
            <p className="mt-3">
              We implement a variety of security measures to maintain the safety
              of your personal information. However, no method of transmission
              over the Internet or method of electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Children's Privacy</h2>
            <p className="mt-3">
              Our SMS/texting services are not intended for individuals under the
              age of 13. We do not knowingly collect personal information from
              children under 13. If we become aware that we have collected
              information from a child under 13, we will take steps to delete such
              information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Changes to This Privacy Policy</h2>
            <p className="mt-3">
              We may update this Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on our website.
              You are advised to review this Privacy Policy periodically for any
              changes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Contact Us</h2>
            <p className="mt-3">
              If you have any questions or concerns about this Privacy Policy or
              our practices, please contact us at:
            </p>
            <p className="mt-3">
              Orchard, Inc
              <br />
              580 Orchard Lane,
              <br />
              Glencoe, IL 60022
              <br />
              legal@orchardcorp.com
              <br />
              847 861 5300
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
