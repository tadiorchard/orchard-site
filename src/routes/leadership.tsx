import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { headlineMilestones } from "@/lib/timeline";
import {
  Scale,
  Landmark,
  ShieldCheck,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import indiraPhoto from "@/assets/Indira-saladi.jpg";
import ramPhoto from "@/assets/ram-saladi.jpg";
import jamesPhoto from "@/assets/james-cantrell.jpg";
import naltoLogo from "@/assets/nalto-member.png";
import leadershipHero from "@/assets/hero-doctors.jpg";

export const Route = createFileRoute("/leadership")({
  head: () => ({
    meta: [
      { title: "Leadership — Orchard" },
      { name: "description", content: "Meet the clinicians and operators behind Orchard: physician-founded leadership, a clinical governance framework, and sixteen years of locum tenens experience." },
      { property: "og:title", content: "Leadership — Orchard" },
      { property: "og:description", content: "The clinicians and operators behind Orchard." },
      { property: "og:url", content: "/leadership" },
    ],
    links: [{ rel: "canonical", href: "/leadership" }],
  }),
  component: LeadershipPage,
});

type Profile = {
  name: string;
  title: string;
  photo: string;
  bio: string;
  /** Short credential chips shown under the name */
  tags: string[];
  linkedin?: string;
};

const founders: Profile[] = [
  {
    name: "Indira Saladi",
    title: "President & Board Director",
    photo: indiraPhoto,
    tags: ["Engineer", "IP Attorney", "President, 10+ yrs"],
    bio: "Indira Saladi is President and Board Director of Orchard, which she has helped build since its founding and led full-time as President for nearly a decade — growing it from a physician-founded staffing firm into a national locum tenens company. An engineer and intellectual property attorney by training, Indira brings a rare combination of technical, legal, and operational rigor to the business, building on the clinical governance framework established by founder Dr. N. Ram Saladi. She oversees Orchard's strategic direction and key contracts, including the firm's VA Federal Supply Schedule contract.",
  },
  {
    name: "Dr. N. Ram Saladi",
    title: "Chief Medical Officer & Co-Founder",
    photo: ramPhoto,
    tags: ["Practicing Hospitalist", "Clinical Governance", "Founded 2010"],
    bio: "Dr. N. Ram Saladi is the founder of Orchard, which he launched in 2010 to build a locum tenens firm governed by clinicians rather than sold by recruiters. A practicing hospitalist with deep health system experience, Dr. Saladi established the clinical governance framework that underpins every Orchard placement, from provider vetting to service line integration. His clinically led quality process is why Orchard maintains a sub-1% fallout rate and sixteen years without a malpractice lawsuit, and it remains the foundation on which the company's national growth is built.",
  },
];

const executives: Profile[] = [
  {
    name: "James Cantrell",
    title: "Chief Executive Officer",
    photo: jamesPhoto,
    tags: ["10 Years in Healthcare Staffing", "Scale & Expansion"],
    bio: "James Cantrell is the Chief Executive Officer of Orchard, where he leads the company's transformation into a nationally recognized locum tenens firm. He is a healthcare staffing industry veteran with over ten years of leadership experience in healthcare. James has built and scaled recruiting organizations across some of the sector's most respected firms before joining Orchard. His mandate is scale: accelerating national expansion, deepening client partnerships, and elevating both provider and client experience as the company enters its next phase of growth.",
  },
];

const stats = [
  { value: "2010", label: "Founded" },
  { value: "16+", label: "Years, no malpractice suit" },
  { value: "<1%", label: "Provider fallout rate" },
  { value: "50", label: "States covered" },
];

const milestones = headlineMilestones;

function ProfileCard({ profile, delay = 0 }: { profile: Profile; delay?: number }) {
  return (
    <Reveal
      delay={delay}
      className="group lift-lg flex flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-white shadow-[var(--shadow-soft)]"
    >
      <div className="flex flex-col gap-6 p-6 sm:flex-row sm:p-7">
        <div className="relative mx-auto h-[168px] w-[150px] shrink-0 overflow-hidden rounded-2xl bg-[var(--ice)] sm:mx-0">
          <img
            src={profile.photo}
            alt={`${profile.name}, ${profile.title}`}
            loading="lazy"
            className="h-full w-full object-cover object-top"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-bold leading-tight text-[var(--deep)]">{profile.name}</h3>
          <p className="mt-1.5 text-sm font-semibold text-[var(--ocean)]">{profile.title}</p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {profile.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-[var(--ocean)]/20 bg-[var(--ice)] px-2.5 py-1 text-[11px] font-semibold text-[var(--ocean)]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--border)] px-6 pb-6 pt-5 sm:px-7">
        <p className="text-[14.5px] leading-relaxed text-[var(--muted-foreground)]">{profile.bio}</p>
      </div>
    </Reveal>
  );
}

function SectionHeading({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <Reveal className="max-w-2xl">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ocean)]">{eyebrow}</span>
      <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-[var(--deep)]">{title}</h2>
      {sub && <p className="mt-4 leading-relaxed text-[var(--muted-foreground)]">{sub}</p>}
    </Reveal>
  );
}

function LeadershipPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar overlay />

      {/* HERO */}
      <section className="relative overflow-hidden text-white" style={{ background: "#072C4A" }}>
        <img
          src={leadershipHero}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Brand-tinted overlay — image reads through, text stays legible */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(140deg, rgba(20,99,159,0.90) 0%, rgba(12,82,137,0.90) 38%, rgba(9,63,107,0.91) 72%, rgba(7,44,74,0.93) 100%)",
          }}
        />
        <div
          aria-hidden
          className="float-slow pointer-events-none absolute -top-28 -right-20 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "#1A82CD" }}
        />
        <div className="relative mx-auto max-w-4xl px-6 lg:px-10 pt-38 pb-20 md:pt-46 md:pb-28 text-center">
          <span className="enter-up inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]">
            Leadership
          </span>
          <h1 className="enter-up mt-6 text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.06]" style={{ animationDelay: "90ms" }}>
            The clinicians and operators behind Orchard.
          </h1>
          <p className="enter-up mt-6 text-lg text-white/85 leading-relaxed" style={{ animationDelay: "180ms" }}>
            Physician-founded, operator-led, and accountable for every placement
            we make.
          </p>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-12 md:py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 80} className="text-center">
                <div className="text-3xl md:text-4xl font-bold tabular-nums tracking-tight text-[var(--deep)]">
                  {s.value}
                </div>
                <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  {s.label}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDERS */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 md:py-24">
          <SectionHeading
            eyebrow="Founders"
            title="Where Orchard came from"
            sub="A physician and an engineer-attorney who built the company around clinical governance rather than sales volume."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-2 items-start">
            {founders.map((p, i) => (
              <ProfileCard key={p.name} profile={p} delay={i * 120} />
            ))}
          </div>
        </div>
      </section>

      {/* EXECUTIVE LEADERSHIP */}
      <section className="gradient-soft">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 md:py-24">
          <SectionHeading
            eyebrow="Executive Leadership"
            title="Where Orchard is going"
            sub="The operating team accountable for national growth and day-to-day delivery."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-2 items-start">
            {executives.map((p, i) => (
              <ProfileCard key={p.name} profile={p} delay={i * 120} />
            ))}

            {/* Open roles — keeps the grid balanced and points to careers */}
            <Reveal
              delay={120}
              className="flex h-full flex-col justify-center rounded-3xl border border-dashed border-[var(--ocean)]/30 bg-white/60 p-8 text-center"
            >
              <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl gradient-teal text-white shadow-[var(--shadow-soft)]">
                <UserPlus className="h-6 w-6" strokeWidth={1.7} />
              </span>
              <h3 className="mt-4 text-lg font-bold text-[var(--deep)]">We're growing the team</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                Leadership and operating roles open across recruiting,
                credentialing, IT, and marketing.
              </p>
              <Link
                to="/careers"
                className="cta mx-auto mt-5 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white gradient-teal shadow-[var(--shadow-soft)]"
              >
                View open roles
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* MILESTONES TIMELINE */}
      <section
        className="relative overflow-hidden text-white"
        style={{ background: "linear-gradient(140deg, #14639F 0%, #0C5289 38%, #093F6B 72%, #072C4A 100%)" }}
      >
        <div
          aria-hidden
          className="float-slower pointer-events-none absolute -bottom-28 -left-20 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "#1A82CD" }}
        />
        <div className="relative mx-auto max-w-5xl px-6 lg:px-10 py-20 md:py-24">
          <Reveal className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Our story</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">Company milestones</h2>
          </Reveal>

          <ol className="relative mt-12 space-y-8 border-l border-white/20 pl-8 md:pl-10">
            {milestones.map((m, i) => (
              <Reveal as="li" key={`${m.year}-${m.title}`} delay={i * 110} className="relative">
                <span className="absolute -left-[3.3rem] flex h-11 w-11 items-center justify-center rounded-full gradient-teal text-[11px] font-bold tabular-nums shadow-[var(--shadow-soft)] md:-left-[3.8rem]">
                  {m.year}
                </span>
                <h3 className="text-xl font-bold">{m.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-white/75">{m.body}</p>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={480} className="mt-10 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-white/15 border border-white/25">
                <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <div>
                <div className="text-lg font-bold">Sixteen years without a malpractice lawsuit</div>
                <p className="mt-1 text-[15px] leading-relaxed text-white/75">
                  The result of a clinically led vetting process owned by our
                  physician founder — not a resume screen.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* RECOGNITION & AFFILIATIONS */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 md:py-24">
          <SectionHeading
            eyebrow="Recognition & Affiliations"
            title="Credentials behind the team"
            sub="Independent standards our leadership holds the business to."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3 items-stretch">
            <Reveal className="lift-lg flex flex-col items-center justify-center rounded-3xl border border-[var(--border)] bg-[var(--ice)]/60 p-8 text-center">
              <img
                src={naltoLogo}
                alt="NALTO Member — National Association of Locum Tenens Organizations"
                loading="lazy"
                className="h-20 w-auto max-w-[190px] object-contain"
              />
              <div className="mt-5 font-bold text-[var(--deep)]">NALTO Member</div>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted-foreground)]">
                The gold standard for ethics and accountability in locum tenens.
              </p>
            </Reveal>

            <Reveal delay={110} className="lift-lg flex flex-col items-center justify-center rounded-3xl border border-[var(--border)] bg-[var(--ice)]/60 p-8 text-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-2xl gradient-teal text-white shadow-[var(--shadow-soft)]">
                <Landmark className="h-9 w-9" strokeWidth={1.6} />
              </span>
              <div className="mt-5 font-bold text-[var(--deep)]">VA Federal Supply Schedule</div>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted-foreground)]">
                Credentialing, compliance, and reporting that meet federal requirements.
              </p>
            </Reveal>

            <Reveal delay={220} className="lift-lg flex flex-col items-center justify-center rounded-3xl border border-[var(--border)] bg-[var(--ice)]/60 p-8 text-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-2xl gradient-teal text-white shadow-[var(--shadow-soft)]">
                <Scale className="h-9 w-9" strokeWidth={1.6} />
              </span>
              <div className="mt-5 font-bold text-[var(--deep)]">NAPR Standards of Practice</div>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted-foreground)]">
                Our code of ethics follows NAPR and NALTO practice standards.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden gradient-soft">
        <div
          aria-hidden
          className="float-slow pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full opacity-20 blur-3xl"
          style={{ background: "#1A82CD" }}
        />
        <div className="relative mx-auto max-w-4xl px-6 lg:px-10 py-20 md:py-24 text-center">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--deep)]">
              Meet the team behind your next placement.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[var(--muted-foreground)]">
              Tell us what you need and you'll be working directly with the
              people on this page.
            </p>
          </Reveal>
          <Reveal delay={120} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/client-inquiry"
              className="cta inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white gradient-teal shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-float)]"
            >
              Request Coverage
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/provider-inquiry"
              className="cta inline-flex items-center gap-2 rounded-full border border-[var(--ocean)]/30 bg-white px-7 py-3.5 text-sm font-bold text-[var(--deep)] shadow-[var(--shadow-soft)] hover:bg-[var(--ice)]"
            >
              Find Your Next Assignment
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
