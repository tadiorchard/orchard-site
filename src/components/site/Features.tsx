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
    <section id="how" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--ocean)]/25 bg-[var(--ice)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ocean)]">
            For Providers
          </span>
          <h2 className="mt-6 text-4xl lg:text-5xl font-bold text-[var(--deep)] leading-tight">
            Everything you need to thrive on the road.
          </h2>
          <p className="mt-5 text-lg text-[var(--muted-foreground)] leading-relaxed">
            What you get when you take an assignment with Orchard.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 180} className="group glass rounded-3xl p-8 lift-lg">
              <div className="icon-pop inline-flex h-14 w-14 items-center justify-center rounded-2xl gradient-teal text-white shadow-[var(--shadow-soft)]">
                <f.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-[var(--deep)]">
                {f.title}
              </h3>
              <p className="mt-3 text-[var(--muted-foreground)] leading-relaxed">
                {f.desc}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={160} className="mt-12">
          <Link
            to="/provider-inquiry"
            className="cta inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white gradient-teal shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-float)]"
          >
            Find Your Next Assignment
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
