import { createFileRoute } from "@tanstack/react-router";
import {
  Globe2, Heart, Users, ShieldCheck, ListChecks,
  HandHeart, Stethoscope, Leaf, Check,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { StoryTimeline } from "@/components/site/StoryTimeline";
import heroImg from "@/assets/about-hero.jpg";
import naltoLogo from "@/assets/nalto-member.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Orchard Healthcare Staffing" },
      { name: "description", content: "Orchard is a healthcare staffing company built by clinicians. Learn about our mission, values, NALTO membership, and code of ethics." },
      { property: "og:title", content: "About — Orchard Healthcare Staffing" },
      { property: "og:description", content: "Built by clinicians, for clinicians. Premium locum tenens staffing with integrity and care." },
      { property: "og:url", content: "/about" },
      { property: "og:image", content: heroImg },
      { property: "twitter:image", content: heroImg },
    ],
    links: [{ rel: "canonical", href: "/about" }],
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

      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImg}
          alt="Healthcare professionals in a modern hospital corridor"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d2a40]/85 via-[#1a4a6e]/70 to-[#467A9F]/75" />
        <div className="relative mx-auto max-w-4xl px-6 lg:px-10 pt-42 pb-24 lg:pt-50 lg:pb-32 text-center text-white">
          <span className="enter-up inline-block rounded-full bg-white/15 backdrop-blur px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] border border-white/25">
            About Orchard
          </span>
          <h1 className="enter-up mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight" style={{ animationDelay: "90ms" }}>
            Orchard is a healthcare<br className="hidden md:block" /> staffing company.
          </h1>
        </div>
      </section>

      {/* SUB-PARAGRAPH */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            <Reveal>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-[var(--primary)]">
                Orchard is more than a company — we are healthcare providers.
              </h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="text-lg md:text-xl leading-relaxed text-[var(--deep)] lg:pt-2">
                We have first-hand experience with what it takes to work in and run a hospital. With years of specialized hospital experience, Orchard can help providers and hospitals find the perfect fit needed to provide the highest standard of care possible.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION + MISSION */}
      <section className="gradient-soft">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 md:py-28">
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
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">Our Mission</div>
                <p className="mt-6 text-2xl md:text-3xl lg:text-[2rem] font-semibold leading-[1.2] tracking-tight">
                  Our mission is to help hospitals create and maintain sustainable programs through long term staffing and consulting.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="gradient-soft">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 md:py-28">
          <Reveal className="text-center max-w-2xl mx-auto">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">Core Values</div>
            <h2 className="mt-4 text-3xl md:text-5xl font-bold text-[var(--deep)] tracking-tight">
              The principles we practice every day
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, body }, i) => (
              <Reveal
                key={title}
                delay={(i % 4) * 90}
                className="group lift-lg glass rounded-3xl p-7 flex flex-col h-full"
              >
                <div className="icon-pop inline-flex h-12 w-12 items-center justify-center rounded-2xl gradient-teal text-white shadow-[var(--shadow-soft)]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[var(--deep)] tracking-tight">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section id="our-story" className="scroll-mt-24 bg-white">
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

      {/* NALTO */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <Reveal className="flex justify-center md:justify-start">
              <div className="lift-lg rounded-3xl bg-[var(--ice)] p-10 md:p-14 shadow-[var(--shadow-soft)] w-full max-w-sm flex items-center justify-center">
                <img
                  src={naltoLogo}
                  alt="NALTO Member — National Association of Locum Tenens Organizations"
                  loading="lazy"
                  className="max-w-[240px] w-full h-auto"
                />
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">Partnership</div>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[var(--deep)] tracking-tight">
                Proud NALTO Member
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-[var(--deep)]/85">
                We are proud to announce our partnership with NALTO, the gold standard in locum tenens physician staffing! With a strong commitment to ethics, accountability, and industry-leading standards, NALTO is a key partner on our path to ensure that healthcare providers and facilities get the best possible match.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CODE OF ETHICS */}
      <section className="gradient-soft">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 py-20 md:py-28">
          <Reveal className="text-center max-w-3xl mx-auto">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">Standards</div>
            <h2 className="mt-4 text-3xl md:text-5xl font-bold text-[var(--deep)] tracking-tight">
              Our Code of Ethics
            </h2>
          </Reveal>

          <Reveal delay={120} className="mt-12 max-w-3xl mx-auto space-y-6 text-[var(--deep)]/85 text-lg leading-relaxed">
            <p>
              To ensure the highest standard of business and ethical conduct, Orchard maintains strict Codes of Ethics and Standards of Practice based on the standards set out by the National Association of Physician Recruiters (NAPR) and the National Association of Locum Tenens Organizations (NALTO). The combined practice and ethical standards of NAPR.
            </p>
            <p>
              The Code of Ethics and Standards of Practice for NALTO. Orchard ensures the ethical standards of practice by upholding the following key principles:
            </p>
          </Reveal>

          <div className="mt-14 grid sm:grid-cols-2 gap-6 auto-rows-fr">
            {ethics.map((e, i) => (
              <Reveal key={e.title} delay={(i % 2) * 90} className="group lift-lg glass rounded-2xl p-6 md:p-7 flex items-start gap-5 min-h-[140px]">
                <div className="icon-pop flex-none inline-flex h-11 w-11 items-center justify-center rounded-xl gradient-teal text-white shadow-[var(--shadow-soft)]">
                  <Check className="h-5 w-5" strokeWidth={3} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--deep)] tracking-tight text-base md:text-lg">{e.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{e.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
