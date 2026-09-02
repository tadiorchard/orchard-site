import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { seo } from "@/lib/seo";

/**
 * A fixed date, not `new Date()`. The page previously rendered the current
 * year, so it claimed to have been revised today no matter when it was read —
 * on a legal document that is the one field that has to be true. Update this
 * by hand when the terms actually change.
 */
const LAST_UPDATED = "2 September 2026";

type Section = { id: string; heading: string; body: Array<string | string[]> };

const SECTIONS: Section[] = [
  {
    id: "acceptance",
    heading: "1. Acceptance of these terms",
    body: [
      "These Terms and Conditions (the “Terms”) govern your access to and use of the Orchard Corp website at www.orchardcorp.com and any related services, forms, job listings, and portals we make available (together, the “Services”).",
      "By accessing the site, submitting a form, applying to an assignment, or otherwise using the Services, you agree to be bound by these Terms. If you do not agree, please do not use the Services.",
    ],
  },
  {
    id: "about",
    heading: "2. Who we are",
    body: [
      "Orchard Corp (“Orchard”, “we”, “us”) is a physician-founded healthcare staffing organization. We place locum tenens and permanent clinicians with hospitals, health systems, and clinics, and provide the credentialing, licensing, and logistics support that surrounds those placements.",
      "Orchard is a staffing and recruitment company. We are not a healthcare provider, we do not practise medicine, and we do not direct or supervise the clinical care delivered by the providers we place.",
    ],
  },
  {
    id: "eligibility",
    heading: "3. Eligibility",
    body: [
      "You must be at least 18 years old and legally able to enter a binding agreement to use the Services. If you use the Services on behalf of a hospital, practice, or other organization, you represent that you are authorised to bind that organization to these Terms.",
    ],
  },
  {
    id: "no-medical-advice",
    heading: "4. No medical advice and no provider–patient relationship",
    body: [
      "Nothing on this site is medical advice, and no content here should be relied on for diagnosis or treatment. Using the Services does not create a provider–patient relationship between you and Orchard, or between you and any clinician listed or placed through us.",
      "Clinical decisions in any assignment remain the responsibility of the treating clinician and the facility, subject to that facility's medical staff bylaws, policies, and supervision.",
    ],
  },
  {
    id: "no-guarantee",
    heading: "5. No guarantee of placement or engagement",
    body: [
      "Submitting an application, joining our network, or requesting coverage does not create an employment relationship, a contract for services, or any obligation on Orchard to present, place, or engage you.",
      "Assignments are offered subject to client requirements, credentialing outcomes, licensure, background and reference checks, and availability. Any engagement is governed by a separate written agreement between the parties, and where that agreement conflicts with these Terms, that agreement controls.",
    ],
  },
  {
    id: "listings",
    heading: "6. Job listings and availability",
    body: [
      "Listings are drawn from our live system and change frequently. Rates, dates, locations, schedules, and requirements are estimates or client-stated requirements and may change or be withdrawn at any time without notice.",
      "We make reasonable efforts to keep listings accurate but do not warrant that any listing is current, complete, or still open at the time you view it.",
    ],
  },
  {
    id: "submissions",
    heading: "7. Information you submit",
    body: [
      "You agree that any information you provide — including your name, contact details, work history, licences, certifications, and references — is accurate, current, and yours to share. Providing false or misleading credentialing information may result in withdrawal from consideration and, where required, notification to a client or licensing body.",
      "You authorise Orchard to verify the information you submit, including contacting references, primary sources, licensing boards, and previous employers, and to share relevant information with clients considering you for an assignment. We do not present a provider to a facility without that provider's approval.",
      "Do not submit protected health information, patient records, or any third party's personal data through this site.",
    ],
  },
  {
    id: "portal",
    heading: "8. Accounts and the provider portal",
    body: [
      "Some Services require an account, including the provider portal. You are responsible for the accuracy of your account information, for keeping your credentials confidential, and for activity that occurs under your account. Tell us promptly if you believe your account has been accessed without your authorisation.",
      "We may suspend or terminate access to an account at our discretion, including where we believe the Terms have been breached.",
    ],
  },
  {
    id: "acceptable-use",
    heading: "9. Acceptable use",
    body: [
      "You agree not to:",
      [
        "use the Services for any unlawful purpose, or in breach of any applicable healthcare, employment, privacy, or telemarketing law;",
        "scrape, harvest, or systematically extract listings, contact details, or other content, whether by automated means or otherwise;",
        "misrepresent your identity, credentials, licensure, or authority to act for an organization;",
        "attempt to gain unauthorised access to any part of the Services, or interfere with their operation or security;",
        "upload malicious code, or use the Services to send unsolicited commercial messages;",
        "reproduce, resell, or commercially exploit any part of the Services without our written permission.",
      ],
    ],
  },
  {
    id: "ip",
    heading: "10. Intellectual property",
    body: [
      "The Services, including their text, design, graphics, logos, and arrangement, are owned by Orchard or its licensors and are protected by intellectual property laws. The Orchard name and logo are our trademarks. Third-party marks appearing on the site, including those of professional associations, belong to their respective owners and are used to identify those organizations.",
      "You may view and print pages for your own non-commercial use. No other licence is granted.",
    ],
  },
  {
    id: "third-party",
    heading: "11. Third-party services and links",
    body: [
      "The Services link to and rely on third-party platforms, including our provider portal, analytics, live chat, and security tooling. We are not responsible for the content, practices, or availability of third-party sites and services, and linking to them is not an endorsement.",
    ],
  },
  {
    id: "communications",
    heading: "12. Communications",
    body: [
      "By providing your contact details, you agree that we may contact you about your enquiry, application, or assignment by email, telephone, and — where you have separately consented — by text message.",
      "Our text message programme is governed by additional terms. Message and data rates may apply, message frequency varies, and you may opt out at any time by replying STOP.",
    ],
  },
  {
    id: "privacy",
    heading: "13. Privacy",
    body: [
      "Information you provide is handled in accordance with our published privacy notices. Please review them before submitting personal information.",
    ],
  },
  {
    id: "eeo",
    heading: "14. Equal opportunity",
    body: [
      "Orchard is committed to equal opportunity. We do not discriminate against providers or applicants on the basis of race, colour, religion, sex, sexual orientation, gender identity, national origin, age, disability, veteran status, genetic information, or any other characteristic protected by applicable law, and we do not accept client instructions that would require us to do so.",
    ],
  },
  {
    id: "disclaimer",
    heading: "15. Disclaimers",
    body: [
      "THE SERVICES ARE PROVIDED “AS IS” AND “AS AVAILABLE”, WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.",
      "We do not warrant that the Services will be uninterrupted, secure, or error-free, or that any listing, rate, or requirement shown is accurate or current.",
    ],
  },
  {
    id: "liability",
    heading: "16. Limitation of liability",
    body: [
      "TO THE FULLEST EXTENT PERMITTED BY LAW, ORCHARD AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS, REVENUE, DATA, OR GOODWILL, ARISING OUT OF OR RELATING TO YOUR USE OF THE SERVICES.",
      "Nothing in these Terms excludes liability that cannot lawfully be excluded.",
    ],
  },
  {
    id: "indemnity",
    heading: "17. Indemnification",
    body: [
      "You agree to indemnify and hold Orchard harmless from claims, losses, and reasonable costs arising out of your misuse of the Services, your breach of these Terms, or your submission of inaccurate or unauthorised information.",
    ],
  },
  {
    id: "changes",
    heading: "18. Changes to the Services and to these Terms",
    body: [
      "We may modify or discontinue any part of the Services at any time. We may also update these Terms; the date at the top of this page shows when they were last revised, and your continued use after a change constitutes acceptance of the revised Terms.",
    ],
  },
  {
    id: "law",
    heading: "19. Governing law",
    body: [
      "These Terms are governed by the laws of the State of Illinois, without regard to its conflict of laws rules. You agree to the exclusive jurisdiction of the state and federal courts located in Illinois for any dispute arising out of these Terms or the Services.",
    ],
  },
  {
    id: "general",
    heading: "20. General",
    body: [
      "If any provision of these Terms is found unenforceable, the remainder stays in effect. Our failure to enforce a provision is not a waiver of it. These Terms, together with any separate written agreement between us, are the entire agreement between you and Orchard regarding the Services.",
    ],
  },
];

export const Route = createFileRoute("/terms")({
  head: () =>
    seo({
      title: "Terms and Conditions | Orchard Corp",
      description:
        "The terms governing use of the Orchard Corp website, job listings, provider portal, and staffing services.",
      path: "/terms",
    }),
  component: TermsPage,
});

function TermsPage() {
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
          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">Terms and Conditions</h1>
          <p className="mt-5 text-white/75">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-10 lg:py-20">
        {/* Contents. A twenty-section document is unusable without one, and it
            is the difference between a page somebody scans and a page somebody
            scrolls past. */}
        <nav
          aria-label="Contents"
          className="rounded-2xl border border-[var(--border)] bg-[var(--ice)]/60 p-6 sm:p-7"
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

          <section id="contact" className="scroll-mt-28 rounded-2xl border border-[var(--border)] bg-[var(--ice)]/60 p-7">
            <h2 className="text-xl font-bold text-[var(--deep)]">21. Contact</h2>
            <p className="mt-4 leading-relaxed text-[var(--slate)]">
              Questions about these Terms can be sent to{" "}
              <a
                href="mailto:info@orchardcorp.com"
                className="font-semibold text-[var(--ocean)] hover:underline"
              >
                info@orchardcorp.com
              </a>{" "}
              or{" "}
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
              <Link to="/sms-terms" className="font-semibold text-[var(--ocean)] hover:underline">
                SMS Terms
              </Link>{" "}
              and{" "}
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
