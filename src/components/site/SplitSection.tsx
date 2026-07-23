import providerImg from "@/assets/provider-split.jpg";
import facilityImg from "@/assets/facility-split.jpeg";
import { ArrowUpRight, Building2, Stethoscope } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";

export function SplitSection() {
  return (
    <section className="relative py-24 lg:py-32 gradient-soft overflow-hidden">
      {/* ambient accents */}
      <div
        aria-hidden
        className="float-slow pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: "#1A82CD" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        {/* Section header */}
        <Reveal className="max-w-2xl mx-auto text-center">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--ocean)]">
            Two ways to work with Orchard
          </span>
          <h2 className="mt-3 text-4xl lg:text-5xl font-bold text-[var(--deep)] leading-tight">
            Whichever side you're on, we've got you.
          </h2>
        </Reveal>

        {/* Cards */}
        <div className="mt-14 grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* For Facilities */}
          <Reveal className="group lift-lg img-zoom relative overflow-hidden rounded-[1.75rem] shadow-[var(--shadow-float)] min-h-[380px] flex">
            <img
              src={facilityImg}
              alt="Modern hospital facility"
              loading="lazy"
              width={1280}
              height={1280}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(155deg, rgba(5,30,54,0.96) 0%, rgba(8,52,90,0.94) 55%, rgba(12,74,124,0.90) 100%)",
              }}
            />
            <div className="relative p-10 lg:p-12 flex flex-col text-white w-full">
              <div className="icon-pop inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur border border-white/25">
                <Building2 className="h-7 w-7" />
              </div>
              <span className="mt-6 block text-xs font-semibold tracking-[0.2em] uppercase text-white/75">
                For Facilities
              </span>
              <h3 className="mt-3 text-3xl lg:text-[2.5rem] font-bold leading-[1.1]">
                Request professional medical staff, seamlessly.
              </h3>
              <p className="mt-5 text-white/85 leading-relaxed max-w-md">
                Tell us what your facility needs and Orchard handles the rest —
                sourcing qualified clinicians that fit your culture and schedule.
              </p>

              <Link
                to="/client-inquiry"
                className="cta mt-auto pt-9 inline-flex items-center gap-2 text-sm font-bold w-fit"
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[var(--deep)] shadow-[var(--shadow-soft)] hover:bg-[var(--ice)] transition-colors">
                  Request Coverage
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </Reveal>

          {/* For Providers */}
          <Reveal delay={120} className="group lift-lg img-zoom relative overflow-hidden rounded-[1.75rem] shadow-[var(--shadow-float)] min-h-[380px] flex">
            <img
              src={providerImg}
              alt="Physician walking through hospital corridor"
              loading="lazy"
              width={1280}
              height={1280}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(155deg, rgba(12,82,137,0.92) 0%, rgba(18,101,163,0.82) 55%, rgba(26,130,205,0.7) 100%)",
              }}
            />
            <div className="relative p-10 lg:p-12 flex flex-col text-white w-full">
              <div className="icon-pop inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur border border-white/25">
                <Stethoscope className="h-7 w-7" />
              </div>
              <span className="mt-6 block text-xs font-semibold tracking-[0.2em] uppercase text-white/75">
                For Providers
              </span>
              <h3 className="mt-3 text-3xl lg:text-[2.5rem] font-bold leading-[1.1]">
                Are you a Provider?
              </h3>
              <p className="mt-5 text-white/85 leading-relaxed max-w-md">
                Build a career that fits your life. Great assignments, real
                support, and pay that respects your expertise.
              </p>

              <Link
                to="/provider-inquiry"
                className="cta mt-auto pt-9 inline-flex items-center gap-2 text-sm font-bold w-fit"
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[var(--deep)] shadow-[var(--shadow-soft)] hover:bg-[var(--ice)] transition-colors">
                  Find Your Next Assignment
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
