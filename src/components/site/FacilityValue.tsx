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
    <section
      className="relative overflow-hidden text-white"
      style={{ background: "linear-gradient(135deg, #0C5289 0%, #0A4A7C 60%, #083d68 100%)" }}
    >
      <div
        aria-hidden
        className="float-slow pointer-events-none absolute -top-28 -right-20 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "#1A82CD" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-32">
        <Reveal className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]">
            For Hospitals &amp; Facilities
          </span>
          <h2 className="mt-6 text-4xl lg:text-5xl font-bold leading-tight">
            What hospitals get from Orchard
          </h2>
          <p className="mt-5 text-lg text-white/80 leading-relaxed">
            When a shift goes uncovered, everything downstream feels it. Here's
            what we put behind every placement.
          </p>
        </Reveal>

        <div className="mt-14 grid md:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((b, i) => (
            <Reveal
              key={b.title}
              delay={i * 120}
              className="group lift-lg rounded-3xl border border-white/20 bg-white/10 backdrop-blur p-8"
            >
              <div className="icon-pop inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur border border-white/25">
                <b.icon className="h-7 w-7" strokeWidth={1.7} />
              </div>
              <h3 className="mt-6 text-xl font-bold">{b.title}</h3>
              <p className="mt-3 text-white/80 leading-relaxed text-[15px]">{b.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={160} className="mt-12">
          <Link
            to="/client-inquiry"
            className="cta inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[var(--deep)] shadow-[var(--shadow-soft)] hover:bg-[var(--ice)]"
          >
            Request Coverage
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
