import { DollarSign, Plane, Award, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";


const features = [
  {
    icon: DollarSign,
    title: "Top-Tier Compensation",
    desc: "Premium hourly rates with reliable weekly direct deposit, transparent contracts, and referral bonus opportunity on every assignment.",
  },
  {
    icon: Plane,
    title: "Full Logistics Support",
    desc: "We handle your housing, travel, and state licensing end-to-end — so you can focus entirely on patient care.",
  },
  {
    icon: Award,
    title: "Trusted Quality & Reliability",
    desc: "A dedicated team backs every assignment with rigorous vetting, responsive support, and a long-standing reputation for consistent, high-quality service.",
  },
];

export function Features() {
  return (
    <section
      id="how"
      className="relative overflow-hidden text-white"
      style={{ background: "linear-gradient(135deg, #0C5289 0%, #0A4A7C 60%, #083d68 100%)" }}
    >
      <div
        aria-hidden
        className="float-slow pointer-events-none absolute -top-28 -left-24 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "#1A82CD" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-32">
        <Reveal className="max-w-2xl lg:ml-auto lg:text-right">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]">
            For Providers
          </span>
          <h2 className="mt-6 text-4xl lg:text-5xl font-bold leading-tight">
            Everything you need to thrive on the road.
          </h2>
          <p className="mt-5 text-lg text-white/80 leading-relaxed">
            What you get when you take an assignment with Orchard.
          </p>
        </Reveal>

        <div className="mt-14 grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((f, i) => (
            <Reveal
              key={f.title}
              delay={i * 180}
              className="group lift-lg rounded-3xl border border-white/20 bg-white/10 backdrop-blur p-8"
            >
              <div className="flex items-center justify-between">
                <div className="icon-pop inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur border border-white/25">
                  <f.icon className="h-7 w-7" />
                </div>
                <span
                  aria-hidden
                  className="text-4xl font-extrabold leading-none tracking-tight select-none"
                  style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.35)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-6 text-xl font-bold">{f.title}</h3>
              <p className="mt-3 text-white/80 leading-relaxed">{f.desc}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={160} className="mt-12 lg:text-right">
          <Link
            to="/provider-inquiry"
            className="cta inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[var(--deep)] shadow-[var(--shadow-soft)] hover:bg-[var(--ice)]"
          >
            Find Your Next Assignment
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
