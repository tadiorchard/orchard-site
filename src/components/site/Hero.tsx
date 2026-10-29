import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, MapPin, Search } from "lucide-react";
import heroTeam from "@/assets/hero-team.jpg";
import { Link, useNavigate } from "@tanstack/react-router";
import { RotatingWord } from "./RotatingWord";
import { US_STATES } from "@/lib/taxonomy";
import type { Job } from "@/lib/salesforce.server";

/**
 * Proof tiles, in the company's own published words.
 *
 * Every figure here is already claimed elsewhere on the site — the fallout
 * rate and the malpractice record on /leadership and in the facility section,
 * the specialty count in the stats band, the Federal Supply Schedule on
 * /leadership and in the facility section. Nothing is computed, estimated or
 * invented for the hero; if one of these ever changes it changes at those
 * sources too.
 */
const PROOF = [
  { figure: "<1%", label: "Provider fallout rate" },
  { figure: "16", label: "Years, no malpractice suit" },
  { figure: "100+", label: "Specialties" },
  { figure: "VA FSS", label: "Federal Supply Schedule" },
];

export function Hero({
  openCount = 0,
  recent = [],
  specialtyOptions = [],
  stateOptions = [],
}: {
  openCount?: number;
  recent?: Job[];
  specialtyOptions?: string[];
  stateOptions?: string[];
}) {
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

  /*
    The panel is a real query against the board, not a decorative search box.
    Both selects are built from the live feed, so every option has a role
    behind it, and an untouched field is simply left out of the URL rather
    than sent as an empty filter the jobs page would have to ignore.
  */
  const navigate = useNavigate();
  const [specialty, setSpecialty] = useState("");
  const [state, setState] = useState("");
  const hasBoard = openCount > 0 && recent.length > 0;
  // With no feed there is nothing to choose between, so the panel keeps its
  // buttons and drops the two empty selects rather than offering "Any
  // specialty" over an empty list.
  const hasFilters = specialtyOptions.length > 0 || stateOptions.length > 0;
  const search = (e: React.FormEvent) => {
    e.preventDefault();
    const search: Record<string, string> = {};
    if (specialty) search.specialty = specialty;
    if (state) search.state = state;
    navigate({ to: "/jobs", search });
  };

  const fieldCls =
    "w-full appearance-none rounded-xl border border-[var(--border)] bg-white px-3.5 py-2.5 text-[15px] text-[var(--deep)] shadow-sm transition-all focus:border-[var(--teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--teal)]/15";
  const fieldLabelCls =
    "mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--deep)]/60";

  return (
    <section className="relative overflow-hidden flex items-center min-h-svh" style={{ background: "#082844" }}>
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

      {/*
        Gradient overlay: dark navy on the left, softened toward the right.

        The right-hand stops used to lift to 0.66 so the faces stayed visible
        in open frame. That frame is now where the panels sit, and a white card
        over a half-lit photograph looked pasted on, so the right side carries
        the veil further — 0.88 at 70%, 0.86 at 100%. The photograph still
        reads through it, and the cards sit on something solid enough to belong
        there.

        The first two stops are deliberately unchanged. They are the backdrop
        the headline reads against, already at 0.94 and 0.90, and pushing them
        further turns the left side into a flat slab.
      */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(8,28,52,0.94) 0%, rgba(10,45,80,0.90) 40%, rgba(10,50,88,0.88) 70%, rgba(11,58,98,0.86) 100%)",
        }}
      />

      <div className="relative w-full mx-auto max-w-[88rem] px-6 lg:px-10 py-24 md:py-28 lg:py-24">
        {/* Two columns only when there is a board to put in the second one. If
            Salesforce is unreachable the hero falls back to the single column
            it was before, rather than holding open half a screen of empty
            space for a card that is not coming. */}
        <div
          className={`grid items-center gap-12 lg:gap-16 ${
            hasBoard ? "lg:grid-cols-[1.05fr_1fr]" : ""
          }`}
        >
          {/* Left: the pitch, then the panel that acts on it */}
          <div className={`text-left text-white ${hasBoard ? "" : "max-w-2xl"}`}>
            <span
              className="enter-up inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur"
              style={{ animationDelay: "40ms" }}
            >
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#7ED0A5]" />
              Physician-founded · Since 2010
            </span>

            <h1
              className="enter-up mt-6 text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.08] text-white"
              style={{ animationDelay: "90ms" }}
            >
              Built by Physicians. Trusted by{" "}
              <RotatingWord words={["Hospitals", "Clinics", "Providers"]} className="text-[#6FB4E6]" />
              <span className="text-[#6FB4E6]">.</span>
            </h1>

            {/*
              The non-breaking spaces around the em dash are load-bearing. Left to
              wrap freely it stranded at the right edge — "…staffing partner —"
              ending a line, which reads as a hyphenated break rather than an
              aside. Binding "partner — connecting" into one unbreakable unit
              means the whole phrase moves down together instead, so the dash
              always sits mid-line. It is 20 characters, so it still fits a
              375px viewport without forcing an overflow.

              text-pretty then handles the rest of the paragraph's breaks, and is
              simply ignored by browsers that do not support it.
            */}
            <p
              className="enter-up mt-5 text-lg md:text-xl text-white/85 max-w-xl leading-relaxed text-pretty"
              style={{ animationDelay: "180ms" }}
            >
              Orchard is a physician-led locum tenens staffing partner&nbsp;&mdash;&nbsp;connecting
              hospitals with board-certified clinicians, and providers with assignments that fit
              their lives.
            </p>

            {/* The search panel, white on the navy so it reads as a surface you
                act on rather than more hero copy. */}
            <form
              onSubmit={search}
              className="enter-up mt-8 rounded-2xl border border-white/15 bg-white p-4 shadow-[var(--shadow-float)] sm:p-5"
              style={{ animationDelay: "270ms" }}
            >
              <div className={`grid gap-3 sm:grid-cols-2 ${hasFilters ? "" : "hidden"}`}>
                <div>
                  <label htmlFor="hero-specialty" className={fieldLabelCls}>
                    Specialty
                  </label>
                  <div className="relative">
                    <select
                      id="hero-specialty"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      className={fieldCls}
                    >
                      <option value="">Any specialty</option>
                      {specialtyOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      aria-hidden
                      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="hero-state" className={fieldLabelCls}>
                    State
                  </label>
                  <div className="relative">
                    <select
                      id="hero-state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className={fieldCls}
                    >
                      <option value="">Any state</option>
                      {stateOptions.map((code) => (
                        <option key={code} value={code}>
                          {US_STATES[code] ?? code}
                        </option>
                      ))}
                    </select>
                    <MapPin
                      aria-hidden
                      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  className="cta inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white gradient-teal shadow-[var(--shadow-soft)]"
                >
                  <Search className="h-4 w-4" strokeWidth={2.2} aria-hidden />
                  Find Your Next Assignment
                </button>
                <Link
                  to="/client-inquiry"
                  className="cta inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-white px-6 py-3 text-sm font-bold text-[var(--deep)] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
                >
                  Request Coverage
                </Link>
              </div>
            </form>

            {/* Proof, in the words the rest of the site already uses. */}
            <dl
              className="enter-up mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4"
              style={{ animationDelay: "340ms" }}
            >
              {PROOF.map((p) => (
                <div
                  key={p.label}
                  className="rounded-xl border border-white/15 bg-white/[0.07] px-3.5 py-3 backdrop-blur"
                >
                  <dt className="sr-only">{p.label}</dt>
                  <dd>
                    <span className="block text-lg font-bold leading-none tabular-nums text-white">
                      {p.figure}
                    </span>
                    <span className="mt-1.5 block text-[11px] leading-snug text-white/70">
                      {p.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right: the board itself, live. Replaces the floating count disc —
              the number is more use attached to the roles behind it. */}
          {openCount > 0 && (
            <div
              className="enter-up overflow-hidden rounded-2xl border border-white/15 shadow-[var(--shadow-float)] backdrop-blur"
              style={{ background: "rgba(6,26,46,0.72)", animationDelay: "420ms" }}
            >
              <div className="flex items-baseline justify-between gap-4 border-b border-white/10 px-6 py-5">
                <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/75">
                  <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#7ED0A5]" />
                  Open now
                </span>
                <span className="text-3xl font-bold leading-none tabular-nums text-white xl:text-4xl">
                  {openCount}
                </span>
              </div>

              <ul className="divide-y divide-white/10">
                {recent.slice(0, 4).map((job) => (
                  <li key={job.id}>
                    <Link
                      to="/jobs/$jobId"
                      params={{ jobId: job.id }}
                      className="group flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-white/[0.06]"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-[15px] font-semibold text-white">
                          {job.specialty ?? job.title}
                        </span>
                        {(job.city || job.state) && (
                          <span className="mt-0.5 block truncate text-[13px] text-white/60">
                            {[job.city, job.state && (US_STATES[job.state.toUpperCase()] ?? job.state)]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        )}
                      </span>
                      <ArrowRight
                        aria-hidden
                        className="h-4 w-4 flex-none text-white/45 transition-all group-hover:translate-x-1 group-hover:text-white"
                      />
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="border-t border-white/10 px-6 py-4">
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#6FB4E6] transition-colors hover:text-white"
                >
                  View all jobs
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
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
    </section>
  );
}
