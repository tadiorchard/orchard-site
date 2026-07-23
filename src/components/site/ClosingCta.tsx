import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

export function ClosingCta() {
  return (
    <section className="relative overflow-hidden gradient-soft">
      <div
        aria-hidden
        className="float-slow pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: "#1A82CD" }}
      />

      <div className="relative mx-auto max-w-4xl px-6 lg:px-10 py-20 md:py-24 text-center">
        <Reveal>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--deep)] leading-tight">
            Ready when you are.
          </h2>
          <p className="mt-5 text-lg text-[var(--muted-foreground)] leading-relaxed">
            Tell us what you need and our team will take it from there.
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/client-inquiry"
            className="cta inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white gradient-teal shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-float)]"
          >
            Request Coverage
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/provider-inquiry"
            className="cta inline-flex items-center gap-2 rounded-full border border-[var(--ocean)]/30 bg-white px-7 py-3.5 text-sm font-bold text-[var(--deep)] shadow-[var(--shadow-soft)] hover:bg-[var(--ice)]"
          >
            Find Your Next Assignment
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
