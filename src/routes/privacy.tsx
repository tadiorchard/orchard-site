import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { seo } from "@/lib/seo";

/** Fixed, not computed — a policy that claims to change daily tells you nothing. */
const LAST_UPDATED = "2 September 2026";

type Section = { id: string; heading: string; body: Array<string | string[]> };

const SECTIONS: Section[] = [
  {
    id: "scope",
    heading: "1. About this policy",
    body: [
      "This policy explains what Orchard Corp (“Orchard”, “we”, “us”) collects when you use www.orchardcorp.com, how we use it, who we share it with, and the choices you have.",
      "Our text message programme has its own policy, which carriers require us to publish separately. Where the two overlap, the SMS policy governs mobile opt-in data and phone numbers collected for SMS consent.",
    ],
  },
  {
    id: "who-we-are",
    heading: "2. Who we are",
    body: [
      "Orchard is a physician-founded healthcare staffing organization. We place locum tenens and permanent clinicians with hospitals, health systems, and clinics, and handle the credentialing and logistics around those placements.",
      "We are a staffing company, not a healthcare provider. We do not deliver clinical care and we do not hold patient records.",
    ],
  },
  {
    id: "what-we-collect",
    heading: "3. Information we collect",
    body: [
      "Information you give us. When you complete a form — a coverage request, a provider enquiry, a job application, a referral, a careers or investor enquiry — we collect what that form asks for. Depending on the form this may include:",
      [
        "name, email address, and telephone number;",
        "for clinicians: specialty, provider type, credentials, licensure and state of licence, board status, work history, availability, and the content of anything you attach or write;",
        "for facilities: organization, role, and the details of the coverage you are requesting;",
        "the consent choices you made on the form, and a record of when you made them.",
      ],
      "Information collected automatically. Like most sites, we and our providers collect technical data such as IP address, browser and device type, referring page, and the pages you view. This comes from analytics, security, and hosting tooling rather than from anything you type.",
      "Live chat. If you use the chat widget, its provider processes the messages you send and basic session information.",
    ],
  },
  {
    id: "no-phi",
    heading: "4. What we do not want",
    body: [
      "Please do not send us patient information, medical records, or any other protected health information through this website or the chat widget. We have no need for it, and the site is not built to receive it.",
      "As a staffing company we are not a HIPAA covered entity in respect of this website. Where we act as a business associate under a specific client agreement, that agreement governs instead.",
    ],
  },
  {
    id: "how-we-use",
    heading: "5. How we use your information",
    body: [
      "We use what you give us to:",
      [
        "respond to your enquiry and contact you about it;",
        "assess your suitability for assignments, and present you to facilities where you have agreed to it;",
        "verify credentials, licensure, and references;",
        "arrange credentialing, licensing, travel, and housing for an assignment;",
        "keep records of consent and of our dealings with you;",
        "operate, secure, and improve the website;",
        "meet our legal and contractual obligations.",
      ],
    ],
  },
  {
    id: "sharing-employers",
    heading: "6. Sharing with hospitals and facilities — only with your consent",
    body: [
      "If you are a clinician, the point of applying is that a facility eventually sees your details. We do not do that automatically.",
      "We never present a provider to a hospital, health system, or clinic without that provider's explicit approval first. You decide which opportunities your profile is submitted for. Where you approve a submission, we share the information the facility needs to evaluate you and to credential you — typically your CV, licensure and certifications, work history, and references.",
      "Facilities receiving your information handle it under their own policies and obligations, and we are not responsible for what they do with it once shared.",
    ],
  },
  {
    id: "service-providers",
    heading: "7. Service providers",
    body: [
      "We use third parties to run the business. They may process your information on our behalf, and only for the purposes we set:",
      [
        "Salesforce — our customer relationship system, where form submissions, applications, and candidate records are stored;",
        "Google Analytics — website usage measurement;",
        "Google reCAPTCHA — spam and abuse prevention on our forms;",
        "Tidio — the live chat widget;",
        "Cloudflare and Vercel — content delivery, security, and hosting.",
      ],
      "We do not sell your personal information, and we do not share it for cross-context behavioural advertising.",
    ],
  },
  {
    id: "other-sharing",
    heading: "8. Other circumstances in which we share",
    body: [
      "We may disclose information where the law requires it — for example in response to a subpoena, court order, or lawful request from a regulator — and where we need to establish, exercise, or defend legal claims, or protect the safety of any person.",
      "If Orchard is involved in a merger, acquisition, or sale of assets, information may transfer as part of that transaction. Mobile opt-in data and phone numbers collected for SMS consent are excluded, as set out in our SMS policy.",
    ],
  },
  {
    id: "cookies",
    heading: "9. Cookies and analytics",
    body: [
      "We use cookies and similar technologies to keep the site working, to measure how it is used, and to protect our forms from abuse. Analytics cookies are set by Google Analytics; others are set by our chat, security, and hosting providers.",
      "Most browsers let you refuse or delete cookies through their settings. Google publishes a browser add-on that opts you out of Google Analytics across every site that uses it. Blocking some cookies may affect how parts of the site behave.",
    ],
  },
  {
    id: "sms",
    heading: "10. Text messages",
    body: [
      "Where you have separately opted in, we may contact you by SMS. Message and data rates may apply, frequency varies, and you can stop at any time by replying STOP.",
      "Mobile opt-in data, SMS consent, and phone numbers collected for SMS purposes are not shared with any third party or affiliate for marketing purposes. Our SMS policy sets this out in full.",
    ],
  },
  {
    id: "retention",
    heading: "11. How long we keep information",
    body: [
      "We keep information for as long as we need it for the purpose it was given, and afterwards for as long as required to meet legal, tax, contractual, and record-keeping obligations. Credentialing records for a placement are generally kept longer than a general enquiry, because clients and regulators may require them.",
      "You can ask us to delete information we no longer need — see your choices below.",
    ],
  },
  {
    id: "security",
    heading: "12. Security",
    body: [
      "We use reasonable administrative and technical safeguards, including encrypted transport, access controls on our systems, and abuse protection on our forms. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    id: "choices",
    heading: "13. Your choices and rights",
    body: [
      "You can, at any time:",
      [
        "ask what personal information we hold about you and request a copy;",
        "ask us to correct information that is wrong or out of date;",
        "ask us to delete information we no longer have a reason to keep;",
        "withdraw your approval for us to present you to a particular facility, or to any facility;",
        "opt out of marketing email using the unsubscribe link, or of SMS by replying STOP.",
      ],
      "Depending on where you live, state privacy law may give you additional rights, including the right not to be discriminated against for exercising them. To make a request, email info@orchardcorp.com from the address you gave us, or call the number below. We may need to verify your identity before acting, particularly where credentialing records are involved.",
    ],
  },
  {
    id: "children",
    heading: "14. Children",
    body: [
      "The Services are for adults. We do not knowingly collect information from anyone under 18. If you believe a child has given us information, contact us and we will delete it.",
    ],
  },
  {
    id: "location",
    heading: "15. Where we operate",
    body: [
      "Orchard operates in the United States and our services are directed to the United States. Information you provide is processed and stored in the United States, which may have data protection rules that differ from those where you live.",
    ],
  },
  {
    id: "changes",
    heading: "16. Changes to this policy",
    body: [
      "We may update this policy. The date at the top of the page shows when it was last revised, and material changes will be reflected there. Continuing to use the site after a change means you accept the revised policy.",
    ],
  },
];

export const Route = createFileRoute("/privacy")({
  head: () =>
    seo({
      title: "Privacy Policy | Orchard Corp",
      description:
        "What Orchard collects through this website and its forms, how it is used, who it is shared with, and your choices. Provider details are shared with facilities only with consent.",
      path: "/privacy",
    }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <Navbar overlay />

      <section
        className="pt-38 pb-20 text-white lg:pt-46 lg:pb-24"
        style={{
          background: "linear-gradient(135deg, #0C5289 0%, #0A4A7C 60%, #083d68 100%)",
        }}
      >
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">Privacy Policy</h1>
          <p className="mt-5 text-white/75">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-10 lg:py-20">
        {/* The single question most people arrive with, answered before the
            contents rather than at section six. */}
        <div className="rounded-2xl border border-[var(--teal)]/30 bg-[var(--ice)]/70 p-6 sm:p-7">
          <h2 className="text-[17px] font-bold text-[var(--deep)]">
            The short version, for clinicians
          </h2>
          <p className="mt-3 leading-relaxed text-[var(--slate)]">
            We never send your details to a hospital without your say-so. You decide which
            opportunities you are submitted for, we do not sell your information, and you can ask us
            to correct or delete it at any time.
          </p>
        </div>

        <nav
          aria-label="Contents"
          className="mt-8 rounded-2xl border border-[var(--border)] bg-white p-6 sm:p-7"
        >
          <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--slate)]">
            Contents
          </h2>
          <ol className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-[15px] text-[var(--ocean)] transition-colors hover:text-[var(--deep)] hover:underline"
                >
                  {s.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-12 space-y-12">
          {SECTIONS.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-28">
              <h2 className="text-xl font-bold text-[var(--deep)] md:text-[22px]">
                {section.heading}
              </h2>
              <div className="mt-4 space-y-4 leading-relaxed text-[var(--slate)]">
                {section.body.map((part, i) =>
                  Array.isArray(part) ? (
                    <ul key={i} className="ml-5 list-disc space-y-2">
                      {part.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p key={i}>{part}</p>
                  ),
                )}
              </div>
            </section>
          ))}

          <section
            id="contact"
            className="scroll-mt-28 rounded-2xl border border-[var(--border)] bg-[var(--ice)]/60 p-7"
          >
            <h2 className="text-xl font-bold text-[var(--deep)]">17. Contact us</h2>
            <p className="mt-4 leading-relaxed text-[var(--slate)]">
              For any privacy question or request, email{" "}
              <a
                href="mailto:info@orchardcorp.com"
                className="font-semibold text-[var(--ocean)] hover:underline"
              >
                info@orchardcorp.com
              </a>{" "}
              or call{" "}
              <a
                href="tel:+18478615300"
                className="font-semibold text-[var(--ocean)] hover:underline"
              >
                847 861 5300
              </a>
              .
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted-foreground)]">
              See also our{" "}
              <Link to="/terms" className="font-semibold text-[var(--ocean)] hover:underline">
                Terms and Conditions
              </Link>
              ,{" "}
              <Link to="/sms-terms" className="font-semibold text-[var(--ocean)] hover:underline">
                SMS Terms
              </Link>
              , and{" "}
              <Link to="/sms-privacy" className="font-semibold text-[var(--ocean)] hover:underline">
                SMS Privacy Policy
              </Link>
              .
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
