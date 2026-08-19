import { Reveal } from "./Reveal";

/**
 * The light beat between the hero and the dark facilities section.
 *
 * Centred and single column by design. What made the old version feel adrift
 * wasn't the centring — it was a hero-sized headline, a paragraph running the
 * full width, and a rule left dangling under it all with deep padding beneath,
 * which read as a hole. The measure is narrower here, the heading steps down
 * from the hero, and the rule sits between heading and body where it divides
 * something instead of trailing off.
 */
export function MissionStatement() {
  return (
    <section
      id="approach"
      className="relative scroll-mt-24 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #F4F9FD 55%, #EAF3FB 100%)",
      }}
    >
      {/* The same soft glow the darker sections use, so a text-only band on a
          page full of cards doesn't read as bare. */}
      <div
        aria-hidden
        className="float-slower pointer-events-none absolute -top-32 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full opacity-[0.06] blur-3xl"
        style={{ background: "#1A82CD" }}
      />

      <div className="relative mx-auto max-w-3xl px-6 py-20 text-center lg:px-10 md:py-24">
        <Reveal as="span" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ocean)]">
          Our approach
        </Reveal>

        <Reveal delay={100}>
          <h2 className="mt-4 text-3xl font-bold leading-[1.12] tracking-tight text-[var(--deep)] md:text-4xl lg:text-5xl">
            Staffing for the 21<sup className="align-super text-[0.5em]">st</sup> century
          </h2>
        </Reveal>

        <Reveal delay={180}>
          <div className="mx-auto mt-7 h-1 w-16 rounded-full bg-gradient-to-r from-[var(--ocean)] to-[#6FB4E6]" />
        </Reveal>

        <Reveal delay={260}>
          <p className="mt-7 text-[17px] leading-relaxed text-[var(--muted-foreground)] md:text-lg">
            With an <strong className="font-semibold text-[var(--deep)]">aging population</strong>,{" "}
            <strong className="font-semibold text-[var(--deep)]">rising costs</strong>, and{" "}
            <strong className="font-semibold text-[var(--deep)]">growing uncertainty</strong>,
            hospitals need greater{" "}
            <strong className="font-semibold text-[var(--deep)]">flexibility</strong> in staffing
            options. Founded by a physician,{" "}
            <strong className="font-semibold text-[var(--deep)]">Orchard</strong> is a medical
            staffing organization that helps connect hospitals with experienced and competitive
            healthcare providers. We pride ourselves on{" "}
            <strong className="font-semibold text-[var(--deep)]">integrity</strong>,{" "}
            <strong className="font-semibold text-[var(--deep)]">reliability</strong>, and the{" "}
            <strong className="font-semibold text-[var(--deep)]">highest quality of care</strong>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
