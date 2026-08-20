import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import heroTeam from "@/assets/hero-team.jpg";
import { Link } from "@tanstack/react-router";
import { RotatingWord } from "./RotatingWord";

export function Hero({ openCount = 0 }: { openCount?: number }) {
  // The hero is exactly one viewport tall on a page six times that, so nothing
  // tells an arriving visitor there is more below. The cue retires the moment
  // they start scrolling — it has done its job by then.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      className="relative overflow-hidden flex items-center min-h-svh"
      style={{ background: "#082844" }}
    >
      {/* Background image on its own layer so it can zoom without moving the text.
          Outer layer plays the entrance; inner layer handles the endless drift —
          split so the two animations don't fight over `transform`. */}
      <div aria-hidden className="hero-enter absolute inset-0">
        <div
          className="ken-burns h-full w-full"
          style={{
            backgroundImage: `url(${heroTeam})`,
            backgroundSize: "cover",
            backgroundPosition: "center right",
          }}
        />
      </div>

      {/* Gradient overlay: dark navy on the left → softened toward the right */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(8,28,52,0.94) 0%, rgba(10,45,80,0.90) 40%, rgba(12,64,110,0.60) 70%, rgba(12,82,137,0.28) 100%)",
        }}
      />

      <div className="relative w-full mx-auto max-w-7xl px-6 lg:px-10 py-20 md:py-24 lg:py-28">
        {/* Left-aligned content layered over the dark side */}
        <div className="max-w-xl lg:max-w-2xl text-left text-white">
          <span className="enter-up inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-white backdrop-blur">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#1A82CD]" />
            Deeply rooted in health.
          </span>

          <h1 className="enter-up mt-6 text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.08] text-white" style={{ animationDelay: "90ms" }}>
            Built by Physicians. Trusted by{" "}
            <RotatingWord
              words={["Hospitals", "Clinics", "Providers"]}
              className="text-[#6FB4E6]"
            />
            <span className="text-[#6FB4E6]">.</span>
          </h1>

          <p className="enter-up mt-6 text-lg md:text-xl text-white/85 max-w-xl leading-relaxed" style={{ animationDelay: "180ms" }}>
            Orchard is a physician-led locum tenens staffing partner —
            connecting hospitals with board-certified clinicians, and providers
            with assignments that fit their lives.
          </p>

          <div className="enter-up mt-10 flex flex-wrap items-center gap-4" style={{ animationDelay: "270ms" }}>
            <Link
              to="/client-inquiry"
              className="cta inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold text-[var(--deep)] bg-white hover:bg-[var(--ice)] shadow-[var(--shadow-soft)]"
            >
              Request Coverage
            </Link>
            <Link
              to="/provider-inquiry"
              className="cta inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold text-white border border-white/60 bg-white/5 hover:bg-white/10"
            >
              Find Your Next Assignment
            </Link>
          </div>
        </div>
      </div>

      <a
        href="#approach"
        aria-label="Scroll to see more"
        className={`group absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-500 md:bottom-7 ${
          scrolled ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <span className="h-6 w-px bg-gradient-to-b from-transparent to-white/45 md:h-9" />
        <span className="scroll-cue flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition-colors group-hover:bg-white/20">
          <ChevronDown className="h-4 w-4" />
        </span>
      </a>

      {/* Live count as a floating disc over the right of the image, where the
          hero's left-aligned copy leaves the frame open. Hidden below lg, where
          there is no clear space for it. */}
      {openCount > 0 && (
        <Link
          to="/jobs"
          className="group float-slow absolute right-[7%] top-1/2 z-10 hidden h-44 w-44 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-white/25 text-center text-white shadow-[var(--shadow-float)] backdrop-blur transition-transform duration-500 hover:scale-105 lg:flex xl:h-48 xl:w-48"
          style={{ background: "rgba(8,40,68,0.55)" }}
        >
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/75">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#7ED0A5]" />
            Open now
          </span>
          <span className="mt-1 text-4xl font-bold tabular-nums leading-none xl:text-5xl">
            {openCount}
          </span>
          <span className="mt-2 px-6 text-[11px] font-semibold leading-snug text-white/80">
            {openCount === 1 ? "position" : "positions"} right now
          </span>
        </Link>
      )}
    </section>
  );
}
