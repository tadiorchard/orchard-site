import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import aboutHero from "@/assets/about-hero.jpg";

const stats = [
  { value: 16, suffix: "", label: "Years in Business" },
  { value: 50, suffix: "", label: "States" },
  { value: 100, suffix: "+", label: "Specialties" },
  { value: 1, suffix: "%", label: "Fallout" },
];

function useCountUp(target: number, start: boolean, duration = 1500) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);
  return n;
}

function Stat({ s, start, index }: { s: (typeof stats)[number]; start: boolean; index: number }) {
  const n = useCountUp(s.value, start);
  return (
    <div
      className={`text-center reveal ${start ? "is-visible" : ""}`}
      style={{ transitionDelay: `${index * 180}ms` }}
    >
      <div className="text-5xl md:text-6xl font-bold text-white tabular-nums tracking-tight">
        {n}
        {s.suffix}
      </div>
      <div className="mt-3 text-[11px] md:text-xs font-semibold tracking-[0.2em] uppercase text-white/75">
        {s.label}
      </div>
    </div>
  );
}


export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background: "#08243f" }}
    >
      {/* Background image */}
      <img
        loading="lazy"
        src={aboutHero}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Very dark overlay */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(4,14,26,0.94) 0%, rgba(6,32,58,0.92) 50%, rgba(8,42,74,0.90) 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.25), transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.15), transparent 50%)",
        }}
      />
      <div className="relative mx-auto max-w-[88rem] px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-white/75">
              Your trusted staffing partner
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Connecting hospitals with exceptional providers.
            </h2>
            <p className="mt-6 text-base md:text-lg text-white/85 leading-relaxed">
              Orchard is a medical staffing organization that helps to connect
              hospitals with experienced and competitive healthcare providers.
              We pride ourselves on integrity, reliability, and the highest
              quality of care.
            </p>
            {/*
              The page used to close twice — this band made its case and offered
              "About Us", then a pale strip repeated the ask with the real
              buttons, then the footer offered the same two destinations again.
              The ask lives here now, on the highest-contrast surface the page
              has, and the page ends once.
            */}
            <div className="mt-9 border-t border-white/15 pt-8">
              <p className="text-xl md:text-2xl font-bold text-white leading-snug">
                Ready when you are.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <Link
                  to="/client-inquiry"
                  className="cta inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white gradient-teal shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-float)]"
                >
                  Request Coverage
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/provider-inquiry"
                  className="cta inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[var(--deep)] hover:bg-[var(--ice)] shadow-[var(--shadow-float)]"
                >
                  Find Your Next Assignment
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

          </div>
          <div className="grid grid-cols-2 gap-10 md:gap-8">
            {stats.map((s, i) => (
              <Stat key={s.label} s={s} start={visible} index={i} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
