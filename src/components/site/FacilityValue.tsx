import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import facilityTeam from "@/assets/about-hero.jpg";

const benefits = [
  {
    title: "Coverage That Shows Up",
    body: "Our provider fallout rate stays under 1%. We don't confirm a placement until we're confident the physician will be there — credentialing, licensing, and travel are handled end to end, so your schedule holds.",
  },
  {
    title: "Physician-Led Vetting",
    body: "Every provider is reviewed through a clinician-led quality process, not just a resume screen — clinicians who fit your service line and are ready to work from day one.",
  },
  {
    title: "Federal-Grade Standards",
    body: "Orchard holds a VA Federal Supply Schedule contract, so our credentialing, compliance, and reporting meet federal requirements — and every client is backed by that same infrastructure.",
  },
];

export function FacilityValue() {
  return (
    <section
      id="for-facilities"
      className="relative overflow-hidden text-white scroll-mt-24"
      style={{
        background:
          "linear-gradient(140deg, #14639F 0%, #0C5289 38%, #093F6B 72%, #072C4A 100%)",
      }}
    >
      <div
        aria-hidden
        className="float-slow pointer-events-none absolute -top-28 -right-20 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "#1A82CD" }}
      />

      <div className="relative mx-auto max-w-[88rem] px-6 lg:px-10 py-24 lg:py-32">
        {/* Header row: intro + CTA */}
        <Reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]">
              For Hospitals &amp; Facilities
            </span>
            <h2 className="mt-6 text-4xl lg:text-5xl font-bold leading-tight">
              What hospitals get from Orchard
            </h2>
            <p className="mt-5 text-lg text-white/80 leading-relaxed">
              When a shift goes uncovered, everything downstream feels it. Here's
              what we put behind every placement.
            </p>
          </div>
          <Link
            to="/client-inquiry"
            className="cta inline-flex w-fit items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[var(--deep)] shadow-[var(--shadow-soft)] hover:bg-[var(--ice)]"
          >
            Request Coverage
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        {/* Numbered list beside anchoring image */}
        <div className="mt-14 grid lg:grid-cols-2 gap-10 lg:gap-14 items-stretch">
          {/* Left: numbered benefits */}
          <Reveal className="flex flex-col justify-center divide-y divide-white/12">
            {benefits.map((b, i) => (
              <div key={b.title} className="flex items-start gap-5 py-6 first:pt-0 last:pb-0">
                <span className="flex h-14 w-14 flex-none items-center justify-center rounded-full gradient-teal text-lg font-bold shadow-[var(--shadow-soft)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-xl font-bold">{b.title}</h3>
                  <p className="mt-2 text-white/75 leading-relaxed text-[15px]">{b.body}</p>
                </div>
              </div>
            ))}
          </Reveal>

          {/* Right: image with client quote overlay */}
          <Reveal delay={120} className="relative overflow-hidden rounded-[1.75rem] shadow-[var(--shadow-float)] min-h-[420px] lg:min-h-full">
            <img
              src={facilityTeam}
              alt="Clinical team walking through a hospital corridor"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(8,40,72,0.10) 0%, rgba(8,40,72,0.15) 45%, rgba(6,26,48,0.92) 100%)",
              }}
            />
            <figure className="absolute inset-x-0 bottom-0 p-7 lg:p-9">
              <blockquote className="text-lg lg:text-xl font-medium leading-snug">
                "Orchard consistently stood out for their quality outcomes,
                responsiveness, and strong relationships."
              </blockquote>
              <figcaption className="mt-3 text-sm text-white/75">
                Bob — Vice President
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
