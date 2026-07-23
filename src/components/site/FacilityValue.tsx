import { Link } from "@tanstack/react-router";
import { CalendarCheck, Stethoscope, Landmark, ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

const benefits = [
  {
    icon: CalendarCheck,
    title: "Coverage That Shows Up",
    body: "Our provider fallout rate stays under 1%. We don't confirm a placement until we're confident the physician will be there — and credentialing, licensing, and travel are handled end to end, so your schedule holds.",
  },
  {
    icon: Stethoscope,
    title: "Physician-Led Vetting",
    body: "Every provider is reviewed through a clinician-led quality process, not just a resume screen. The result is clinicians who fit your service line and are ready to work from day one.",
  },
  {
    icon: Landmark,
    title: "Federal-Grade Standards",
    body: "Orchard holds a VA Federal Supply Schedule contract, so our credentialing, compliance, and reporting meet federal requirements — and every client is supported by that same infrastructure.",
  },
];

export function FacilityValue() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--ocean)]/25 bg-[var(--ice)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ocean)]">
            For Hospitals &amp; Facilities
          </span>
          <h2 className="mt-6 text-4xl lg:text-5xl font-bold text-[var(--deep)] leading-tight">
            What hospitals get from Orchard
          </h2>
          <p className="mt-5 text-lg text-[var(--muted-foreground)] leading-relaxed">
            When a shift goes uncovered, everything downstream feels it. Here's
            what we put behind every placement.
          </p>
        </Reveal>

        <div className="mt-14 grid md:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((b, i) => (
            <Reveal
              key={b.title}
              delay={i * 120}
              className="group glass rounded-3xl p-8 lift-lg"
            >
              <div className="icon-pop inline-flex h-14 w-14 items-center justify-center rounded-2xl gradient-teal text-white shadow-[var(--shadow-soft)]">
                <b.icon className="h-7 w-7" strokeWidth={1.7} />
              </div>
              <h3 className="mt-6 text-xl font-bold text-[var(--deep)]">{b.title}</h3>
              <p className="mt-3 text-[var(--muted-foreground)] leading-relaxed text-[15px]">
                {b.body}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={160} className="mt-12">
          <Link
            to="/client-inquiry"
            className="cta inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white gradient-teal shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-float)]"
          >
            Request Coverage
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
