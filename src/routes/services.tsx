import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import bannerServices from "@/assets/banner-services.jpg";
import {
  UserRound,
  Users,
  CalendarClock,
  ShieldCheck,
  Clock,
  BadgeCheck,
  Headset,
  MonitorPlay,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/services")({
  head: () => seo({
      title: "Services — Staffing & Telemedicine | Orchard",
      description:
        "Orchard provides white-glove medical staffing and 24/7 telemedicine specialist coverage for hospitals.",
      path: "/services",
    }),
  component: ServicesPage,
});

const staffing = [
  {
    icon: UserRound,
    title: "Place Local Providers",
    desc: "We place local, specialized providers with years of experience in hospitals.",
  },
  {
    icon: Users,
    title: "Place Advanced Staff",
    desc: "We place advanced staff to help manage and lead new hospital programs.",
  },
  {
    icon: CalendarClock,
    title: "Fill Complex Scheduling Gaps",
    desc: "We place blocks of providers to help you fill complex scheduling gaps.",
  },
  {
    icon: ShieldCheck,
    title: "Provide Quality & Consistency",
    desc: "We provide consistent contracts so you can keep the same set of providers until positions are permanently filled.",
  },
];

const telemed = [
  {
    icon: Clock,
    title: "24-7 Specialist Coverage",
    desc: "We offer on-demand around-the-clock access to our team of remote specialists.",
  },
  {
    icon: BadgeCheck,
    title: "Highly Qualified Physicians",
    desc: "We hand-select only the most trusted, highly-qualified and experienced professionals.",
  },
  {
    icon: Headset,
    title: "Fast & Reliable Facilitation",
    desc: "We facilitate the process to remove friction and get specialists connected within minutes.",
  },
];


function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold tracking-[0.22em] uppercase text-[var(--ocean)]">
      {children}
    </span>
  );
}

function ServicesPage() {
  return (
    <main className="min-h-screen">
      <Navbar overlay />

      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <img
          src={bannerServices}
          alt="Healthcare professionals collaborating"
          width={1920}
          height={800}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(12,82,137,0.82) 0%, rgba(8,52,90,0.78) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-6 lg:px-10 pt-42 pb-24 lg:pt-50 lg:pb-32 text-center text-white">
          <span className="enter-up inline-block text-xs font-semibold tracking-[0.22em] uppercase text-white/85">
            Our Services
          </span>
          <h1 className="enter-up mt-5 text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.08]" style={{ animationDelay: "90ms" }}>
            Staffing &amp; Telemedicine
          </h1>
          <p className="enter-up mt-6 text-lg text-white/85 leading-relaxed" style={{ animationDelay: "180ms" }}>
            Two integrated offerings, one shared standard of care — designed
            to help hospitals deliver consistent, high-quality service.
          </p>
        </div>
      </section>

      {/* SECTION A — Staffing */}
      <section className="py-24 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal className="max-w-3xl mx-auto text-center">
            <SectionLabel>Staffing</SectionLabel>
            <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--deep)] leading-tight">
              Temporary, Long-Term &amp; Permanent Staffing
            </h2>
            <p className="mt-6 text-lg text-[var(--muted-foreground)] leading-relaxed">
              Orchard is a trusted staffing partner for hospitals. If you're
              looking to move beyond traditional low-touch locum tenens
              programs, and seeking a more personalized, quality-conscious,
              white-glove alternative, you're in the right place.
            </p>
          </Reveal>

          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {staffing.map((g, i) => (
              <Reveal
                key={g.title}
                delay={i * 120}
                className="group rounded-3xl p-8 lift-lg text-center border border-[var(--ocean)]/15 shadow-[var(--shadow-soft)]"
                style={{
                  background:
                    "linear-gradient(160deg, #F1F7FC 0%, #DCEAF6 100%)",
                }}
              >
                <div className="icon-pop mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[var(--ocean)] border border-[var(--ocean)]/20 shadow-sm">
                  <g.icon className="h-8 w-8" strokeWidth={1.6} />
                </div>
                <h3 className="mt-6 text-lg font-bold text-[var(--deep)]">
                  {g.title}
                </h3>
                <p className="mt-3 text-sm text-[var(--deep)]/75 leading-relaxed">
                  {g.desc}
                </p>
              </Reveal>
            ))}
          </div>

          {/* Carried over from the old /staffing page — the range of
              engagement is the part prospects actually ask about. */}
          <Reveal delay={120} className="mt-16 max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-[var(--deep)] leading-tight">
              From a single shift to a whole program
            </h3>
            <p className="mt-5 text-lg text-[var(--muted-foreground)] leading-relaxed">
              Let Orchard help your hospital make the most of a volatile market.
              Need a few temporary staff members to fill your schedule? We can help
              with that. Need providers who can stay on long-term until you can find
              the ideal permanent replacement? We can do that too. Want our providers
              to stay on as those permanent replacements? We have you covered. Want to
              start a new program from scratch but need help with the staffing and the
              managerial set-up? We have you covered.
            </p>
          </Reveal>
        </div>
      </section>

      {/* SECTION B — What makes us different (from the old /staffing page) */}
      <section
        className="relative py-24 lg:py-32 text-white overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1A82CD 0%, #1265A3 60%, #0C5289 100%)" }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.3), transparent 45%), radial-gradient(circle at 85% 80%, rgba(255,255,255,0.15), transparent 50%)",
          }}
        />
        <Reveal className="relative mx-auto max-w-4xl px-6 lg:px-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">What makes us different?</h2>
          <p className="mt-8 text-lg leading-relaxed text-white/90">
            Orchard is not a traditional locum tenens agency. We've worked with many of
            those services before, and have found that their model is to fill vacancies
            by any means necessary, without much attention paid to building relationships
            with providers and hospitals. The result is low quality of service. Orchard is
            provided <em>for providers by providers</em>. Because we are providers
            ourselves, and take the time to get to know each of the physicians and
            hospitals we work with, we match based on needs and fit, creating sustainable,
            high-quality staffing solutions.
          </p>
        </Reveal>
      </section>

      {/* SECTION C — Telemedicine */}
      <section className="py-24 lg:py-28 gradient-soft">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal className="max-w-3xl mx-auto text-center">
            <SectionLabel>Telemedicine</SectionLabel>
            <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--deep)] leading-tight">
              24-7 On-Demand Specialist Coverage for Any Hospital
            </h2>
          </Reveal>

          <div className="mt-16 grid sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-10">
            {telemed.map((g, i) => (
              <Reveal key={g.title} delay={i * 120} className="group text-center px-2">
                <div className="icon-pop mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-white text-[var(--ocean)] shadow-[var(--shadow-soft)] border border-[var(--ocean)]/10">
                  <g.icon className="h-9 w-9" strokeWidth={1.5} />
                </div>
                <h3 className="mt-6 text-lg font-bold text-[var(--deep)]">
                  {g.title}
                </h3>
                <p className="mt-3 text-sm text-[var(--muted-foreground)] leading-relaxed">
                  {g.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION D — Base CTA */}
      <section
        className="relative py-24 lg:py-32 text-white overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0C5289 0%, #0A4A7C 60%, #083d68 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.3), transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.15), transparent 50%)",
          }}
        />
        <Reveal className="relative mx-auto max-w-3xl px-6 lg:px-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold">Get In Touch</h2>
          <p className="mt-6 text-lg text-white/85 leading-relaxed">
            The best way to learn about what we do is to get in touch! We're
            available by phone or email anytime.
          </p>
          <Link
            to="/inquiry"
            className="cta mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-[var(--deep)] hover:bg-[var(--ice)] shadow-[var(--shadow-float)]"
          >
            contact us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
