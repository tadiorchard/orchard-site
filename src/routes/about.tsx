import { createFileRoute } from "@tanstack/react-router";
import {
  Globe2, Heart, Users, ShieldCheck, ListChecks,
  HandHeart, Stethoscope, Leaf, Check, MapPin, Phone, Mail,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer, socials } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { StoryTimeline } from "@/components/site/StoryTimeline";
import heroImg from "@/assets/about-hero.jpg";
import naltoLogo from "@/assets/nalto-member.png";
import naprLogo from "@/assets/NAPR.png";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => seo({
      title: "About Orchard — Physician-Founded Healthcare Staffing",
      description:
        "A healthcare staffing company built by clinicians. Our mission, values, NALTO and NAPR membership, and the clinical governance behind every placement.",
      path: "/about",
    }),
  component: AboutPage,
});

const values = [
  { icon: Globe2, title: "Locum Tenens, Nationwide", body: "We staff healthcare providers coast to coast with precision and care." },
  { icon: Heart, title: "People First, Joy Always", body: "We lead with compassion and take our work seriously — but we never forget to bring joy to the people we serve and the teams we build alongside them." },
  { icon: Users, title: "Respect and Inclusion", body: "Every voice matters. Every background belongs." },
  { icon: ShieldCheck, title: "Zero Tolerance for Bad Service", body: "We hold ourselves to the highest standard." },
  { icon: ListChecks, title: "Details Matter", body: "We double-check everything—because accuracy saves time and builds trust." },
  { icon: HandHeart, title: "Hospitality Mindset", body: "We welcome every physician, partner, and client like a guest in our home." },
  { icon: Stethoscope, title: "Physician-Centric", body: "We reward those who help us grow. Ask about our referral program." },
  { icon: Leaf, title: "Deeply Rooted in Health", body: "Our foundation is built on a commitment to advancing health and wellness for providers and patients alike." },
];

const ethics = [
  { title: "Fulfillment of all contractual obligations.", body: "Orchard will ensure that all provider placement contracts are fulfilled without coercion and to the greatest possible integrity." },
  { title: "Preservation of confidence.", body: "Orchard knows when information is confidential and will never release the confidential information of a hospital or an Orchard provider to any third party without explicit consent." },
  { title: "Proper solicitation of referral.", body: "Orchard doesn't contact hospitals for unsolicited referral and forbids its providers from offering payment as a method of ensuring placement." },
  { title: "Proper permission for information disclosure.", body: "Orchard won't distribute the personal information or qualifications of a provider to a hospital offering prospective placement without first consulting the provider and receiving consent." },
  { title: "Accurate and complete maintenance of records.", body: "Orchard keeps meticulous and accurate records of all information related to its providers, clients, and all contractual agreements between the two." },
  { title: "Accurate representations.", body: "Orchard will never misrepresent the qualifications of an Orchard provider nor the nature of a position with a hospital." },
];

function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar overlay />

      {/* HERO — the opening statement lives here now, not in a separate band */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImg}
          alt="Healthcare professionals in a modern hospital corridor"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Carries type across the full width now, so it is darker than a
            headline-only hero would need. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(120deg, rgba(10,32,52,0.94) 0%, rgba(13,42,64,0.90) 45%, rgba(26,74,110,0.82) 100%)",
          }}
        />

        <div className="relative mx-auto max-w-[88rem] px-6 pt-36 pb-20 lg:px-10 lg:pt-40 lg:pb-24 text-white">
          <span className="enter-up inline-block rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur">
            About Orchard
          </span>
          <h1
            className="enter-up mt-6 max-w-3xl text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl"
            style={{ animationDelay: "90ms" }}
          >
            Orchard is a healthcare staffing company.
          </h1>

          <p
            className="enter-up mt-12 max-w-4xl border-t border-white/20 pt-10 text-lg leading-relaxed text-white/85 lg:mt-14 lg:pt-12 lg:text-xl"
            style={{ animationDelay: "180ms" }}
          >
            {/* Lead sentence carries the accent so it reads as the thesis while
                staying part of one flowing paragraph. */}
            <strong className="font-bold text-[#6FB4E6]">
              Orchard is more than a company — we are a clinically governed staffing firm.
            </strong>{" "}
            Founded and led by a practicing hospitalist, we have first-hand experience with what it takes to work in and run a hospital. That perspective shapes every placement we make, helping providers and hospitals find a fit that holds up to the highest standard of care.
          </p>
        </div>
      </section>

      {/* VALUE PROPOSITION + MISSION */}
      <section className="gradient-soft">
        <div className="mx-auto max-w-[88rem] px-6 py-20 lg:px-10 md:py-24">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {/* WHAT WE DO */}
            <Reveal className="lift-lg flex flex-col justify-center rounded-[2rem] bg-white p-10 md:p-12 shadow-[var(--shadow-soft)]">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
                What we do
              </span>
              <h2 className="mt-6 text-2xl md:text-3xl lg:text-[2rem] font-bold leading-[1.2] text-[var(--deep)] tracking-tight">
                We connect hospitals with experienced and competitive healthcare providers.
              </h2>
              <p className="mt-4 text-lg md:text-xl leading-relaxed text-[var(--deep)]/85">
                We pride ourselves on integrity, reliability, and the highest quality of care.
              </p>
            </Reveal>

            {/* OUR MISSION */}
            <Reveal
              delay={150}
              className="lift-lg relative overflow-hidden rounded-[2rem] p-10 md:p-12 text-white shadow-[var(--shadow-float)] flex flex-col justify-center"
              style={{ background: "linear-gradient(135deg, #2E5470 0%, #467A9F 55%, #3D9AB8 100%)" }}
            >
              <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
              <div className="relative">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                  Our Mission
                </span>
                <p className="mt-6 text-2xl md:text-3xl lg:text-[2rem] font-bold leading-[1.2] tracking-tight">
                  Our mission is to help hospitals create and maintain sustainable programs through long term, clinically governed staffing.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="bg-white">
        <div className="mx-auto max-w-[88rem] px-6 py-20 lg:px-10 md:py-24">
          <Reveal className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">Core Values</div>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[var(--deep)] tracking-tight">
              The principles we practice every day
            </h2>
          </Reveal>

          {/* One hairline grid rather than eight floating cards — reads as a
              considered set instead of a scatter of tiles. */}
          <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, body }, i) => (
              <Reveal
                key={title}
                delay={(i % 4) * 70}
                className="group flex flex-col bg-white p-7 transition-colors hover:bg-[var(--ice)]/60"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--ocean)]/15 bg-[var(--ice)] text-[var(--ocean)]">
                  <Icon className="icon-pop h-5 w-5" strokeWidth={1.7} />
                </span>
                <h3 className="mt-5 text-[17px] font-bold leading-snug tracking-tight text-[var(--deep)]">
                  {title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[var(--muted-foreground)]">{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section id="our-story" className="gradient-soft scroll-mt-24">
        <div className="mx-auto max-w-[88rem] px-6 py-20 lg:px-10 md:py-24">
          <Reveal className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
              Our story
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--deep)] md:text-4xl">
              Our story, in three eras
            </h2>
            <p className="mt-4 leading-relaxed text-[var(--muted-foreground)]">
              A physician-founded staffing firm built for the long term.
            </p>
          </Reveal>

          <div className="mt-12">
            <StoryTimeline />
          </div>
        </div>
      </section>

      {/* MEMBERSHIPS */}
      <section className="bg-white">
        <div className="mx-auto max-w-[88rem] px-6 py-20 lg:px-10 md:py-24">
          <Reveal className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
              Partnerships
            </div>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[var(--deep)] tracking-tight">
              Memberships &amp; standards
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {[
              {
                logo: naltoLogo,
                alt: "NALTO Member — National Association of Locum Tenens Organizations",
                title: "Proud NALTO Member",
                body: "Orchard is a proud NALTO member and an active contributor to the organization's Vendor and Credentialing Committees. NALTO — the gold standard in locum tenens physician staffing — sets the ethical and operational bar for the industry, and Orchard team members help shape it from the inside.",
                link: undefined as { href: string; label: string } | undefined,
              },
              {
                logo: naprLogo,
                alt: "NAPR — National Association of Physician Recruiters",
                title: "NAPR Compliant",
                body: "Orchard operates to the professional standards of the National Association of Physician Recruiters (NAPR). Our Codes of Ethics and Standards of Practice are built on NAPR's — binding us on confidentiality, proper solicitation, accurate records, and honest representation of every provider and every position we fill.",
                link: { href: "#code-of-ethics", label: "Read our Code of Ethics" },
              },
            ].map((m, i) => (
              <Reveal
                key={m.title}
                delay={i * 120}
                className="flex flex-col gap-8 rounded-[2rem] border border-[var(--border)] bg-[var(--ice)]/40 p-8 md:flex-row md:items-center md:gap-10 md:p-10"
              >
                {/* Fixed logo panel so two very different aspect ratios still
                    line up across the pair. */}
                <span className="flex h-32 w-full flex-none items-center justify-center rounded-2xl bg-white p-6 shadow-[var(--shadow-soft)] md:w-48">
                  <img
                    src={m.logo}
                    alt={m.alt}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain"
                  />
                </span>
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ocean)]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--ocean)]">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    {m.title}
                  </span>
                  <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted-foreground)]">
                    {m.body}
                  </p>
                  {m.link && (
                    <a
                      href={m.link.href}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--ocean)] transition-colors hover:text-[var(--deep)]"
                    >
                      {m.link.label} →
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CODE OF ETHICS */}
      <section id="code-of-ethics" className="gradient-soft scroll-mt-24">
        <div className="mx-auto max-w-[88rem] px-6 py-20 lg:px-10 md:py-24">
          <Reveal className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">Standards</div>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[var(--deep)] tracking-tight">
              Our Code of Ethics
            </h2>
          </Reveal>

          <Reveal delay={120} className="mt-6 max-w-3xl space-y-5 text-[17px] leading-relaxed text-[var(--muted-foreground)]">
            <p>
              To ensure the highest standard of business and ethical conduct, Orchard maintains strict Codes of Ethics and Standards of Practice based on the standards set out by the National Association of Physician Recruiters (NAPR) and the National Association of Locum Tenens Organizations (NALTO). The combined practice and ethical standards of NAPR.
            </p>
            <p>
              The Code of Ethics and Standards of Practice for NALTO. Orchard ensures the ethical standards of practice by upholding the following key principles:
            </p>
          </Reveal>

          {/* Numbered rather than six identical ticks — a numbered principle can
              be referred to, and the sequence reads as a code. */}
          <div className="mt-12 grid gap-x-12 gap-y-9 md:grid-cols-2">
            {ethics.map((e, i) => (
              <Reveal
                key={e.title}
                delay={(i % 2) * 80}
                className="flex items-start gap-5 border-t border-[var(--border)] pt-7"
              >
                <span className="flex-none text-2xl font-bold tabular-nums leading-none text-[var(--ocean)]/35">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="text-[17px] font-bold leading-snug tracking-tight text-[var(--deep)]">
                    {e.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-[var(--muted-foreground)]">
                    {e.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TO REACH US */}
      <section id="contact" className="bg-white scroll-mt-24">
        <div className="mx-auto max-w-[88rem] px-6 py-20 lg:px-10 md:py-24">
          <Reveal className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
              Get in touch
            </div>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[var(--deep)] tracking-tight">
              How to reach us
            </h2>
          </Reveal>

          {/* Same hairline grid as the values and ethics sections above, so this
              reads as part of the page rather than a bolted-on contact card. */}
          <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            <Reveal className="border-t border-[var(--border)] pt-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--ice)] text-[var(--ocean)]">
                <MapPin className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <h3 className="mt-4 text-[17px] font-bold tracking-tight text-[var(--deep)]">Visit</h3>
              <address className="mt-2.5 text-[15px] not-italic leading-relaxed text-[var(--muted-foreground)]">
                Orchard, Inc
                <br />
                580 Orchard Lane
                <br />
                Glencoe, IL 60022
              </address>
            </Reveal>

            <Reveal delay={80} className="border-t border-[var(--border)] pt-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--ice)] text-[var(--ocean)]">
                <Phone className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <h3 className="mt-4 text-[17px] font-bold tracking-tight text-[var(--deep)]">Call</h3>
              <a
                href="tel:+18478615300"
                className="mt-2.5 inline-block text-[15px] leading-relaxed text-[var(--muted-foreground)] transition-colors hover:text-[var(--ocean)]"
              >
                +1 847 861 5300
              </a>
            </Reveal>

            <Reveal delay={160} className="border-t border-[var(--border)] pt-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--ice)] text-[var(--ocean)]">
                <Mail className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <h3 className="mt-4 text-[17px] font-bold tracking-tight text-[var(--deep)]">Email</h3>
              <a
                href="mailto:info@orchardcorp.com"
                className="mt-2.5 inline-block break-all text-[15px] leading-relaxed text-[var(--muted-foreground)] transition-colors hover:text-[var(--ocean)]"
              >
                info@orchardcorp.com
              </a>
            </Reveal>
          </div>

          <Reveal delay={240} className="mt-12 flex flex-wrap items-center gap-4 border-t border-[var(--border)] pt-8">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--deep)]/70">
              Follow us
            </span>
            <div className="flex items-center gap-3">
              {socials.map(({ label, href, color, shape, path }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className={`block h-10 w-10 overflow-hidden bg-white ring-1 ring-[var(--border)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ocean)] ${shape}`}
                >
                  <svg viewBox="0 0 24 24" className="h-full w-full" fill={color} aria-hidden>
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
