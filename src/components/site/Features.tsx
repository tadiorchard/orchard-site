import { useEffect, useRef, useState } from "react";
import { DollarSign, Plane, Award, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
import providerImg from "@/assets/hero-provider.jpg";
import founderImg from "@/assets/ram-saladi.png";

const benefits = [
  {
    icon: DollarSign,
    title: "Top-Tier Compensation",
    desc: "Premium hourly rates, weekly direct deposit, and referral bonuses on every assignment.",
  },
  {
    icon: Plane,
    title: "Full Logistics Support",
    desc: "Housing, travel, and state licensing handled end-to-end — so you focus on patient care.",
  },
];

// Real, defensible figures — each oriented so a full bar reads as good.
const stats = [
  { label: "Assignment reliability", value: "99%+", pct: 99 },
  { label: "Nationwide coverage", value: "All 50 states", pct: 100 },
  { label: "Logistics handled for you", value: "End to end", pct: 100 },
];

function StatBar({ label, value, pct, delay = 0 }: { label: string; value: string; pct: number; delay?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [w, setW] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setW(pct);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          window.setTimeout(() => setW(pct), delay);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [pct, delay]);

  return (
    <div ref={ref}>
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-semibold text-white">{label}</span>
        <span className="text-white/70">{value}</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full rounded-full transition-[width] duration-[1400ms] ease-out"
          style={{ width: `${w}%`, background: "linear-gradient(90deg, #3D9AB8 0%, #5097D5 100%)" }}
        />
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section id="for-providers" className="relative py-24 lg:py-32 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-[1fr_1.55fr] gap-8 lg:gap-12 items-stretch">
          {/* Left: founder card */}
          <Reveal className="flex flex-col overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-white shadow-[var(--shadow-float)]">
            <div className="relative flex-1 min-h-[20rem]">
              <img
                src={providerImg}
                alt="Healthcare provider in scrubs"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
              {/* Subtle brand overlay so the bright image sits calmly in the card */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(8,40,72,0.14) 0%, rgba(8,40,72,0.06) 45%, rgba(8,40,72,0.34) 100%)",
                }}
              />
              <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ocean)]">
                Physician-founded
              </span>
            </div>

            <div className="flex flex-col p-7">
              <p className="text-sm font-semibold text-[var(--ocean)]">
                Built by a physician who's been where you are.
              </p>
              <blockquote className="mt-3 text-lg font-medium leading-snug text-[var(--deep)]">
                "I've worked these floors. You deserve premium pay, real logistics
                support, and a recruiter who actually picks up — not a transaction."
              </blockquote>

              <div className="mt-6 flex flex-col gap-4 border-t border-[var(--border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={founderImg}
                    alt="Dr. N. Ram Saladi"
                    loading="lazy"
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-[var(--shadow-soft)]"
                  />
                  <div>
                    <div className="font-bold text-[var(--deep)] leading-tight">Dr. N. Ram Saladi</div>
                    <div className="text-sm text-[var(--muted-foreground)]">Co-Founder</div>
                  </div>
                </div>
                <Link
                  to="/provider-inquiry"
                  className="cta inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white gradient-teal shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-float)]"
                >
                  Learn More
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Right: heading, then bars card + feature list side by side */}
          <div className="flex flex-col">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--ocean)]/25 bg-[var(--ice)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ocean)]">
                For Providers
              </span>
              <h2 className="mt-5 text-3xl lg:text-4xl xl:text-5xl font-bold text-[var(--deep)] leading-tight">
                Everything you need to thrive on the road.
              </h2>
              <p className="mt-4 text-lg text-[var(--muted-foreground)] leading-relaxed">
                Orchard is a physician-led locum tenens recruitment agency — built by clinicians who know what it's like to work in a hospital. We connect you with the right assignments and handle the logistics, so you're always taken care of.
              </p>
            </Reveal>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 items-start">
              {/* Stat bars card */}
              <Reveal
                delay={120}
                className="relative overflow-hidden rounded-[1.5rem] p-7 text-white shadow-[var(--shadow-float)]"
                style={{ background: "linear-gradient(135deg, #0C5289 0%, #0A4A7C 60%, #083d68 100%)" }}
              >
                <div
                  aria-hidden
                  className="float-slow pointer-events-none absolute -top-16 -right-10 h-48 w-48 rounded-full opacity-25 blur-3xl"
                  style={{ background: "#1A82CD" }}
                />
                <div className="relative">
                  <h3 className="text-lg font-bold">Where we go all in</h3>
                  <div className="mt-6 space-y-5">
                    {stats.map((s, i) => (
                      <StatBar key={s.label} {...s} delay={i * 180} />
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Feature list — borderless with dividers */}
              <Reveal delay={200} className="divide-y divide-[var(--border)]">
                {benefits.map((b) => (
                  <div key={b.title} className="py-5 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <b.icon className="h-6 w-6 flex-none text-[var(--ocean)]" strokeWidth={1.8} />
                      <h4 className="text-lg font-bold text-[var(--deep)]">{b.title}</h4>
                    </div>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)] leading-relaxed">{b.desc}</p>
                  </div>
                ))}
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
