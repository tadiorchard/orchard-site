import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, MapPin, Search } from "lucide-react";
import heroTeam from "@/assets/hero-group.jpg";
import { Link, useNavigate } from "@tanstack/react-router";
import { RotatingWord } from "./RotatingWord";
import { US_STATES } from "@/lib/taxonomy";

/**
 * Proof tiles, in the company's own published words.
 *
 * Every figure here is already claimed elsewhere on the site — the fallout
 * rate and the malpractice record on /leadership and in the facility section,
 * the specialty count in the stats band, the Federal Supply Schedule in both.
 * Nothing is computed, estimated or invented for the hero; if one of these
 * changes it changes at those sources too.
 */
const PROOF = [
  { figure: "<1%", label: "Provider fallout rate" },
  { figure: "16", label: "Years, no malpractice suit" },
  { figure: "100+", label: "Specialties" },
  { figure: "VA FSS", label: "Federal Supply Schedule" },
];

type Intent = "coverage" | "provider";

export function Hero({
  specialtyOptions = [],
  stateOptions = [],
}: {
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
    Two intents, one panel.

    Both sides of the business arrive here and want opposite things, and the
    old hero sent each of them off to a page to start again. The same two
    questions answer both — which specialty, and where — so they are asked
    once and the tab decides where the answer goes: a filtered board for a
    provider, a part-filled coverage request for a facility.

    Deliberately no live count or role list. The section directly below is the
    board, and the hero repeating it was what made the two read as one thing
    said twice. This section acts; that one browses.
  */
  const navigate = useNavigate();
  const [intent, setIntent] = useState<Intent>("coverage");
  const [specialty, setSpecialty] = useState("");
  const [state, setState] = useState("");
  const hasFilters = specialtyOptions.length > 0 || stateOptions.length > 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const search: Record<string, string> = {};
    if (specialty) search.specialty = specialty;
    if (state) search.state = state;
    navigate({ to: intent === "provider" ? "/jobs" : "/client-inquiry", search });
  };

  const tabCls = (active: boolean) =>
    `flex-1 rounded-lg px-4 py-2.5 text-[13px] font-bold transition-all ${
      active
        ? "bg-white text-[var(--deep)] shadow-sm"
        : "text-[var(--deep)]/60 hover:text-[var(--deep)]"
    }`;
  const fieldCls =
    "w-full appearance-none rounded-xl border border-[var(--border)] bg-white px-3.5 py-2.5 text-[15px] text-[var(--deep)] shadow-sm transition-all focus:border-[var(--teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--teal)]/15";
  const fieldLabelCls =
    "mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--deep)]/60";

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
            // Centred, not anchored right as the previous photograph was. This
            // group is spread evenly across the frame rather than massed on one
            // side, so anchoring right cropped the clinician on the far left
            // away on desktop and left only blank wall in view on a phone.
            backgroundPosition: "center",
          }}
        />
      </div>

      {/*
        Gradient overlay: dark navy on the left, softened toward the right.

        The two right-hand stops carry the veil: 0.74 at 70% and 0.66 at 100%.

        Moving only the 100% stop, as a first attempt did, changed almost
        nothing anybody could see. A gradient stop only affects the span either
        side of it, so lifting the endpoint left everything before 70%
        byte-for-byte identical — and the faces run from roughly 30% of the
        width to 95%. Most of them sat in the untouched zone. The 70% stop at
        0.60 was the dip that actually needed raising.

        The first two stops are deliberately unchanged. They are the backdrop
        the headline reads against, already at 0.94 and 0.90, and pushing them
        further turns the left side into a flat slab.
      */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(8,28,52,0.94) 0%, rgba(10,45,80,0.90) 40%, rgba(12,64,110,0.74) 70%, rgba(12,82,137,0.66) 100%)",
        }}
      />

      <div className="relative w-full mx-auto max-w-[88rem] px-6 lg:px-10 py-24 md:py-28">
        {/* The pitch and the panel share the width rather than stacking in a
            column down the left: the words want a measure of about 40 characters
            and the panel wants room for two fields side by side, and neither
            gets it when both are squeezed into half the frame. Below lg they
            stack, panel second. */}
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 xl:gap-20">
          <div className="text-left text-white">
            <span
              className="enter-up inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur"
              style={{ animationDelay: "40ms" }}
            >
              Physician-founded · Since 2010
            </span>

            <h1
              className="enter-up mt-6 text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.08] text-white"
              style={{ animationDelay: "90ms" }}
            >
              Built by Physicians. Trusted by{" "}
              <RotatingWord
                words={["Hospitals", "Clinics", "Providers"]}
                className="text-[#6FB4E6]"
              />
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
          </div>

          {/* The panel, given its own half of the frame */}
          <form
            onSubmit={submit}
            className="enter-up rounded-2xl border border-white/15 bg-white p-5 shadow-[var(--shadow-float)] sm:p-7"
            style={{ animationDelay: "270ms" }}
          >
            <div
              role="tablist"
              aria-label="What brings you here"
              className="flex gap-1 rounded-xl bg-[var(--ice)] p-1"
            >
              <button
                type="button"
                role="tab"
                aria-selected={intent === "coverage"}
                onClick={() => setIntent("coverage")}
                className={tabCls(intent === "coverage")}
              >
                I need coverage
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={intent === "provider"}
                onClick={() => setIntent("provider")}
                className={tabCls(intent === "provider")}
              >
                I'm a provider
              </button>
            </div>

            {hasFilters && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
                    {intent === "provider" ? "State" : "Facility state"}
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
            )}

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
              <button
                type="submit"
                className="cta inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white gradient-teal shadow-[var(--shadow-soft)]"
              >
                {intent === "provider" ? (
                  <>
                    <Search className="h-4 w-4" strokeWidth={2.2} aria-hidden />
                    Find Your Next Assignment
                  </>
                ) : (
                  <>
                    Request Coverage
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {/* The other door, kept visible rather than hidden behind the
                  tab: somebody who mis-reads the tabs still has one click to
                  the page they wanted. */}
              <Link
                to={intent === "provider" ? "/provider-inquiry" : "/jobs"}
                className="text-sm font-bold text-[var(--ocean)] underline-offset-4 transition-colors hover:text-[var(--deep)] hover:underline"
              >
                {intent === "provider" ? "Join our network" : "Browse open jobs"}
              </Link>
            </div>
          </form>
        </div>

        {/* Proof, in the words the rest of the site already uses. Across the
            full width under both columns, where it reads as a footing for the
            whole hero rather than a tail on the left-hand copy. */}
        <dl
          className="enter-up mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:mt-14"
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
