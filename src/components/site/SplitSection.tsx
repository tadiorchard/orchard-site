import { Reveal } from "./Reveal";

/**
 * Slim intro band that announces the two audience sections that follow.
 * Deliberately lightweight — it's a signpost, not a destination.
 */
export function SplitSection() {
  return (
    <section className="relative overflow-hidden gradient-soft">
      <div
        aria-hidden
        className="float-slow pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: "#1A82CD" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 py-16 lg:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--ocean)]">
            Two ways to work with Orchard
          </span>
          <h2 className="mt-3 text-4xl lg:text-5xl font-bold text-[var(--deep)] leading-tight">
            Whichever side you're on, we've got you.
          </h2>

          {/* Leads the eye into the two sections below */}
          <div className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-[var(--ocean)]/45 to-transparent" />
        </Reveal>
      </div>
    </section>
  );
}
