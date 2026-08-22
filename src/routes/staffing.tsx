import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { UserRound, Users, CalendarClock, ShieldCheck, ArrowRight } from "lucide-react";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/staffing")({
  head: () => seo({
      title: "Locum Tenens Staffing for Hospitals | Orchard",
      description:
        "Orchard is a trusted staffing partner for hospitals — a personalized, quality-conscious, white-glove alternative to traditional locum tenens.",
      path: "/staffing",
    }),
  component: StaffingPage,
});

const grid = [
  { icon: UserRound, title: "Place Local Providers", desc: "We place local, specialized providers with years of experience in hospitals." },
  { icon: Users, title: "Place Advanced Staff", desc: "We place advanced staff to help manage and lead new hospital programs." },
  { icon: CalendarClock, title: "Fill Complex Scheduling Gaps", desc: "We place blocks of providers to help you fill complex scheduling gaps." },
  { icon: ShieldCheck, title: "Provide Quality & Consistency", desc: "We provide consistent contracts so you can keep the same set of providers until positions are permanently filled." },
];

function StaffingPage() {
  return (
    <main className="min-h-screen">
      <Navbar overlay tone="light" />

      {/* Hero */}
      <section className="gradient-hero pt-42 pb-24 lg:pt-50 lg:pb-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-10 text-center">
          <span className="text-xs font-semibold tracking-[0.22em] uppercase text-[var(--ocean)]">
            Staffing
          </span>
          <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--deep)] leading-[1.08]">
            Temporary &amp; Long-Term<br />Supplemental Staffing
          </h1>
          <p className="mt-7 text-lg md:text-xl text-[var(--muted-foreground)] leading-relaxed">
            Orchard is a trusted staffing partner for hospitals. If you're looking
            to move beyond traditional low-touch locum tenens programs, and seeking
            a more personalized, quality-conscious, white-glove alternative,
            you're in the right place.
          </p>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-24 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {grid.map((g) => (
              <div key={g.title} className="glass rounded-3xl p-8 lift text-center">
                <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--ice)] text-[var(--ocean)] border border-[var(--ocean)]/15">
                  <g.icon className="h-8 w-8" strokeWidth={1.6} />
                </div>
                <h3 className="mt-6 text-lg font-bold text-[var(--deep)]">{g.title}</h3>
                <p className="mt-3 text-sm text-[var(--muted-foreground)] leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition Banner */}
      <section
        className="relative py-24 lg:py-32 text-white overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1A82CD 0%, #1265A3 60%, #0C5289 100%)" }}
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          background: "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.3), transparent 45%), radial-gradient(circle at 85% 80%, rgba(255,255,255,0.15), transparent 50%)"
        }} />
        <div className="relative mx-auto max-w-4xl px-6 lg:px-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">What makes us different?</h2>
          <p className="mt-8 text-lg leading-relaxed text-white/90">
            Orchard is not a traditional locum tenens agency. We've worked with
            many of those services before, and have found that their model is to
            fill vacancies by any means necessary, without much attention paid to
            building relationships with providers and hospitals. The result is
            low quality of service. Orchard is provided <em>for providers by
            providers</em>. Because we are providers ourselves, and take the time
            to get to know each of the physicians and hospitals we work with, we
            match based on needs and fit, creating sustainable, high-quality
            staffing solutions.
          </p>
        </div>
      </section>

      {/* Informational sub-text */}
      <section className="py-24 lg:py-28 bg-white">
        <div className="mx-auto max-w-4xl px-6 lg:px-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--deep)]">Contact us to learn more</h2>
          <p className="mt-6 text-lg text-[var(--muted-foreground)] leading-relaxed">
            Let Orchard help your hospital make the most of a volatile market.
            Need a few temporary staff members to fill your schedule? We can help
            with that. Need providers who can stay on long-term until you can
            find the ideal permanent replacement? We can do that to. Want our
            providers to stay on as those permanent replacements? We have you
            covered. Want to start a new program from scratch but need help with
            the staffing and the managerial set up? We have you covered.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-24 lg:py-32 text-white"
        style={{ background: "linear-gradient(160deg, #0C5289 0%, #0A4A7C 100%)" }}
      >
        <div className="mx-auto max-w-3xl px-6 lg:px-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold">Get In Touch</h2>
          <p className="mt-6 text-lg text-white/85 leading-relaxed">
            The best way to learn about what we do is to get in touch! We're
            available by phone or email anytime.
          </p>
          <Link
            to="/inquiry"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-[var(--deep)] hover:bg-[var(--ice)] shadow-[var(--shadow-float)] transition-all lift"
          >
            contact us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
