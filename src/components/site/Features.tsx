import { useEffect, useRef, useState } from "react";
import { DollarSign, Plane, Award, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
import providerImg from "@/assets/providers_4.jpg";
import founderImg from "@/assets/ram-saladi.jpg";

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

function StatBar({
  label,
  value,
  pct,
  delay = 0,
}: {
  label: string;
  value: string;
  pct: number;
  delay?: number;
}) {
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
  // The jobs section directly above is plain white; without a tint here the two
  // run together and the seam between them disappears.
  return (
    <section
      id="for-providers"
      className="relative scroll-mt-24 py-24 lg:py-32"
      style={{ background: "linear-gradient(180deg, #F7FBFE 0%, #EAF3FB 100%)" }}
    >
      <div className="mx-auto max-w-[88rem] px-6 lg:px-10">
        <div className="grid lg:grid-cols-[1.1fr_1.5fr] gap-8 lg:gap-12 items-stretch">
          {/* Left: founder card */}
          <Reveal className="flex flex-col overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-white shadow-[var(--shadow-float)]">
            <div className="relative flex-1 min-h-[20rem]">
              <img
                src={providerImg}
                alt="Team of healthcare providers"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-center saturate-[0.85]"
              />
              {/* Muted, even brand overlay — matches the reference's toned-down look */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(8,34,60,0.55) 0%, rgba(8,34,60,0.42) 45%, rgba(6,24,44,0.62) 100%)",
                }}
              />
              <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ocean)]">
                Physician-founded
              </span>
            </div>

            <div className="flex flex-col p-7">
              <p className="text-sm font-semibold text-[var(--ocean)]">
                Built by a physician who's been where you are.
              </p>
              <p className="mt-3 text-base font-normal leading-relaxed text-neutral-700">
                Every provider deserves fair pay, real support, and a partner who treats them like a
                colleague — not a placement.
              </p>

              <div className="mt-6 flex flex-col gap-4 border-t border-[var(--border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={founderImg}
                    alt="Dr. N. Ram Saladi"
                    loading="lazy"
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-[var(--shadow-soft)]"
                  />
                  <div>
                    <div className="font-bold text-[var(--deep)] leading-tight">
                      Dr. N. Ram Saladi
                    </div>
                    <div className="text-sm text-[var(--muted-foreground)]">Chief Medical Officer &amp; Co-Founder</div>
                  </div>
                </div>
                <Link
                  to="/provider-inquiry"
                  className="cta inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-[13px] font-bold text-white gradient-teal shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-float)]"
                >
                  Find Your Next Assignment
                  <ArrowRight className="h-4 w-4 flex-none" />
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Right: heading, then bars card + feature list side by side */}
          <div className="flex flex-col">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--ocean)]/25 bg-[var(--ice)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ocean)]">
                For Providers
              </span>
              <h2 className="mt-5 text-4xl lg:text-5xl font-bold text-[var(--deep)] leading-tight">
                Everything you need to thrive on the road.
              </h2>
              <p className="mt-4 text-lg text-[var(--muted-foreground)] leading-relaxed">
                Orchard is a physician-led locum tenens recruitment agency — built by a physician
                who knows what it's like to work in a hospital. We connect you with the right
                assignments and handle the logistics, so you're always taken care of.
              </p>
            </Reveal>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 items-stretch flex-1">
              {/* Stat bars card — floats up & down forever */}
              <div className="float-slow flex">
                <Reveal
                  delay={120}
                  className="relative flex w-full flex-col overflow-hidden rounded-[1.5rem] p-7 text-white shadow-[var(--shadow-float)]"
                  style={{
                    background: "linear-gradient(135deg, #0C5289 0%, #0A4A7C 60%, #083d68 100%)",
                  }}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-16 -right-10 h-48 w-48 rounded-full opacity-25 blur-3xl"
                    style={{ background: "#1A82CD" }}
                  />
                  <div className="relative flex flex-1 flex-col justify-center">
                    <h3 className="text-lg font-bold">Where we go all in</h3>
                    <div className="mt-6 space-y-6">
                      {stats.map((s, i) => (
                        <StatBar key={s.label} {...s} delay={i * 180} />
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* Feature list — borderless with dividers */}
              <Reveal
                delay={200}
                className="flex flex-col justify-center divide-y divide-[var(--border)]"
              >
                {benefits.map((b) => (
                  <div key={b.title} className="py-6 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <b.icon className="h-6 w-6 flex-none text-[var(--ocean)]" strokeWidth={1.8} />
                      <h4 className="text-lg font-bold text-[var(--deep)]">{b.title}</h4>
                    </div>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)] leading-relaxed">
                      {b.desc}
                    </p>
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
