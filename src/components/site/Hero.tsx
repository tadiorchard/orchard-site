import heroTeam from "@/assets/hero-team.jpg";
import { Link } from "@tanstack/react-router";
import { RotatingWord } from "./RotatingWord";

export function Hero() {
  return (
    <section className="relative overflow-hidden flex items-center min-h-[calc(100svh-94px)]">
      {/* Background image on its own layer so it can zoom without moving the text */}
      <div
        aria-hidden
        className="ken-burns absolute inset-0"
        style={{
          backgroundImage: `url(${heroTeam})`,
          backgroundSize: "cover",
          backgroundPosition: "center right",
        }}
      />

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
          <span className="enter-up inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur px-4 py-1.5 text-xs font-semibold tracking-wide text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1A82CD]" />
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
    </section>
  );
}
