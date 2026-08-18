import { Reveal } from "./Reveal";

/**
 * The light beat between the hero and the dark facilities section.
 *
 * Laid out in two columns like the sections either side of it — a centred
 * block of text read as an island, and the generous padding around it left a
 * visible hole in the page.
 */
export function MissionStatement() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #F4F9FD 55%, #EAF3FB 100%)",
      }}
    >
      {/* Same soft glow the darker sections use, so this one doesn't read as bare. */}
      <div
        aria-hidden
        className="float-slower pointer-events-none absolute -top-24 -right-24 h-[26rem] w-[26rem] rounded-full opacity-[0.07] blur-3xl"
        style={{ background: "#1A82CD" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-10 md:py-24">
        <div className="grid items-start gap-9 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ocean)]">
              Our approach
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight text-[var(--deep)] md:text-4xl lg:text-[2.75rem]">
              Staffing for the 21<sup className="align-super text-[0.5em]">st</sup> century
            </h2>
            <div className="mt-7 h-1 w-20 rounded-full bg-gradient-to-r from-[var(--ocean)] to-[#6FB4E6]" />
          </Reveal>

          <Reveal delay={120}>
            <p className="text-lg leading-relaxed text-[var(--muted-foreground)] md:text-xl">
              With an <strong className="font-semibold text-[var(--deep)]">aging population</strong>,{" "}
              <strong className="font-semibold text-[var(--deep)]">rising costs</strong>,
              and <strong className="font-semibold text-[var(--deep)]">growing uncertainty</strong>,
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
      </div>
    </section>
  );
}
