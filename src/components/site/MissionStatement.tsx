import { Reveal } from "./Reveal";

export function MissionStatement() {
  return (
    <section
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #ffffff 0%, #F4F9FD 55%, #EAF3FB 100%)",
      }}
    >
      <div className="relative mx-auto max-w-4xl px-6 lg:px-10 text-center">
        <Reveal as="span" className="block text-xs font-semibold tracking-[0.2em] uppercase text-[var(--ocean)]">
          Our Approach
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-[var(--deep)]">
            Staffing for the 21<sup className="text-3xl md:text-4xl">st</sup> century
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-8 text-lg md:text-xl leading-relaxed text-[var(--muted-foreground)]">
            With an <strong className="font-semibold text-[var(--deep)]">aging population</strong>,{" "}
            <strong className="font-semibold text-[var(--deep)]">rising costs</strong>, and{" "}
            <strong className="font-semibold text-[var(--deep)]">growing uncertainty</strong>, hospitals
            need greater <strong className="font-semibold text-[var(--deep)]">flexibility</strong> in
            staffing options. Founded by a physician,{" "}
            <strong className="font-semibold text-[var(--deep)]">Orchard</strong> is a medical staffing
            organization that helps connect hospitals with experienced and competitive
            healthcare providers. We pride ourselves on{" "}
            <strong className="font-semibold text-[var(--deep)]">integrity</strong>,{" "}
            <strong className="font-semibold text-[var(--deep)]">reliability</strong>, and the{" "}
            <strong className="font-semibold text-[var(--deep)]">highest quality of care</strong>.
          </p>
        </Reveal>
        <Reveal delay={300}>
          <div className="mt-10 inline-flex h-1 w-24 rounded-full bg-gradient-to-r from-[var(--ocean)] to-[#6FB4E6]" />
        </Reveal>
      </div>
    </section>
  );
}
