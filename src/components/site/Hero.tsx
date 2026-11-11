import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, Mail, MapPin, Search } from "lucide-react";
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
  specialtyCounts = {},
  stateCounts = {},
  pairCounts = {},
  totalOpen = 0,
}: {
  specialtyOptions?: string[];
  stateOptions?: string[];
  specialtyCounts?: Record<string, number>;
  stateCounts?: Record<string, number>;
  pairCounts?: Record<string, number>;
  totalOpen?: number;
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

    Still no role list — the section directly below is the board, and the hero
    repeating it was what made the two read as one thing said twice. What the
    panel does show is a count of what the visitor has just chosen, which is
    not the board repeated but an answer to their own input: pick Cardiology
    in Arizona and it says how many before they commit to a page. Only on the
    provider side, where an open-assignment count is the thing being asked
    about; a facility is not shopping our vacancies.
  */
  const navigate = useNavigate();
  const [intent, setIntent] = useState<Intent>("coverage");
  const [specialty, setSpecialty] = useState("");
  const [state, setState] = useState("");
  const [email, setEmail] = useState("");
  const hasFilters = specialtyOptions.length > 0 || stateOptions.length > 0;

  // Exact, from the three maps the loader built: the pair map holds only the
  // combinations that exist, so an unlisted pair is genuinely zero rather than
  // unknown.
  const matchCount =
    specialty && state
      ? (pairCounts[`${specialty}|${state}`] ?? 0)
      : specialty
        ? (specialtyCounts[specialty] ?? 0)
        : state
          ? (stateCounts[state] ?? 0)
          : totalOpen;

  /*
    The same number, read for whoever is in front of it.

    To a physician an open role is an opportunity, and "314 open now" is the
    right sentence. To a hospital the identical figure reads as vacancies we
    have not filled — a count of our own shortfall, which is the opposite of
    a reason to call us. Framed as what it actually is, a live requisition
    being recruited for at a client facility, it says scale instead.

    Nothing new is claimed. It is one query, said two ways.
  */
  const liveStates = Object.keys(stateCounts).length;
  const stateName = state ? (US_STATES[state] ?? state) : null;
  const coverageLine = !specialty && !state
    ? `Actively staffing ${totalOpen} roles across ${liveStates} states`
    : matchCount > 0
      ? `Actively staffing ${matchCount} ${specialty ?? ""} ${matchCount === 1 ? "role" : "roles"}`.replace(/\s+/g, " ") +
        (stateName ? ` in ${stateName}` : "")
      : "None open there right now — coverage is sourced to request";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const search: Record<string, string> = {};
    if (specialty) search.specialty = specialty;
    if (state) search.state = state;
    // Carried so the request form opens part-filled. The lead itself still
    // goes through the Web-to-Lead form on that page — see the note by the
    // email field for why the hero cannot submit one on its own.
    if (intent === "coverage" && email.trim()) search.email = email.trim();
    navigate({ to: intent === "provider" ? "/jobs" : "/client-inquiry", search });
  };

  const tabCls = (active: boolean) =>
    `flex-1 rounded-lg px-4 py-2.5 text-[13px] font-bold transition-all ${
      active
        ? "bg-white text-[var(--deep)] shadow-sm"
        : "text-[var(--deep)]/60 hover:text-[var(--deep)]"
    }`;
  // Near-solid on purpose. A control on a glass sheet should read as sitting
  // on top of it, not cut out of it — the moment the fields go translucent too
  // the whole panel flattens into one wash.
  const fieldCls =
    "w-full appearance-none rounded-xl border border-white/70 bg-white/90 px-3.5 py-2.5 text-[15px] text-[var(--deep)] shadow-sm transition-all focus:border-[var(--teal)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[color:var(--teal)]/15";
  const fieldLabelCls =
    "mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--deep)]/60";

  return (
    <section
      /*
        Capped rather than a full viewport from tablet width up.

        A hero that fills the screen exactly spends the most valuable space on
        the page proving nothing: on a large monitor the visitor sees a
        photograph and a form, and no evidence that the live board sits one
        scroll below. Ending short leaves the top of that white section
        showing, which says what is down there rather than merely that
        something is.

        70% rather than something gentler because of what each reveals. At 82%
        the gap is blank white — the next section's own top padding keeps its
        heading below the fold, so the visitor gets an edge and no reason to
        follow it. At 70% the board's live line clears the fold: "321
        assignments open today". That is the difference between "there is more
        below" and "there are 321 live roles below", and it is the strongest
        sentence on the page for a facility judging whether Orchard has depth.

        The floor matters more than the cap. On a 13" laptop a percentage this
        low would squeeze the panel, so the clamp only really bites on the
        large screens where the empty space actually is. Phones keep the full
        height, where the stacked content uses it.
      */
      className="relative overflow-hidden flex items-center min-h-svh md:min-h-[clamp(620px,70svh,820px)]"
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

      {/*
        Grain.

        The photograph is smooth and the gradient laid over it is perfectly
        flat, and the two together are what make the hero read as a rendering
        rather than a surface — every large field of colour is mathematically
        even in a way nothing photographed ever is. A little noise over the
        top gives the eye something to catch on. Tiny: at 4% over a 200px
        tile it is felt rather than seen, and it costs no request because the
        texture is generated by the browser from the filter below.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
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
            /*
              Glass, and the three things that stop it looking like a
              translucent rectangle.

              One: the fill is a gradient, not a flat tint — brighter at the
              top-left corner and again along the bottom edge, which is how
              light actually falls across a pane. A single even alpha reads as
              a filter laid over the photo; this reads as a sheet above it.

              Two: saturate as well as blur. Blur alone turns the photograph
              behind into grey mud. Pushing saturation back up keeps the blue
              of the scene alive through the panel, which is what makes it
              look like glass rather than frosting.

              Three: depth in layers. A tight contact shadow, a wide ambient
              one, a hairline edge, a lit top rim and a faint dark lip at the
              bottom to give the sheet thickness.

              Deliberately not more transparent than this. Everything inside
              is dark text on the fill, and the photograph behind it is busy;
              each step down in opacity is paid for in legibility.
            */
            className="enter-up rounded-2xl p-5 sm:p-7"
            style={{
              animationDelay: "270ms",
              background:
                "linear-gradient(152deg, rgba(255,255,255,0.86) 0%, rgba(255,255,255,0.70) 46%, rgba(255,255,255,0.74) 100%)",
              backdropFilter: "blur(26px) saturate(180%)",
              WebkitBackdropFilter: "blur(26px) saturate(180%)",
              boxShadow: [
                "inset 0 1px 0 0 rgba(255,255,255,0.90)",
                "inset 0 -1px 0 0 rgba(8,28,52,0.06)",
                "0 0 0 1px rgba(255,255,255,0.35)",
                "0 2px 4px -1px rgba(8,28,52,0.14)",
                "0 18px 34px -12px rgba(8,28,52,0.38)",
                "0 48px 90px -36px rgba(8,28,52,0.50)",
              ].join(", "),
            }}
          >
            <div
              role="tablist"
              aria-label="What brings you here"
              className="flex gap-1 rounded-xl bg-[color:var(--deep)]/[0.055] p-1"
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
                          {specialtyCounts[s] ? `${s} (${specialtyCounts[s]})` : s}
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
                          {stateCounts[code]
                            ? `${US_STATES[code] ?? code} (${stateCounts[code]})`
                            : (US_STATES[code] ?? code)}
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

            {/*
              Asked here so the request form opens part-filled rather than
              blank, and because a visitor who has typed their address has
              already decided — the page they land on is then a formality
              rather than a fresh demand.

              Optional on purpose. The lead is still created by the
              Web-to-Lead form on /client-inquiry, which Salesforce requires a
              name and a reCAPTCHA for; putting that challenge in the hero
              would cost more than the step it saved. So this shortens the
              path rather than replacing it.
            */}
            {intent === "coverage" && (
              <div className="mt-3">
                <label htmlFor="hero-email" className={fieldLabelCls}>
                  Work email <span className="font-semibold normal-case tracking-normal opacity-70">(optional)</span>
                </label>
                <div className="relative">
                  <input
                    id="hero-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@hospital.org"
                    className={fieldCls}
                  />
                  <Mail
                    aria-hidden
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]"
                  />
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

              {/*
                Provider side only. "Join our network" is the same person's
                other option — search now, or be found later. The coverage side
                used to carry "Browse open jobs" here, which sent a facility
                that had just said it needs coverage off to the provider half
                of the business. The nav still has that door for anyone who
                picked the wrong tab.
              */}
              {intent === "provider" && (
                <Link
                  to="/provider-inquiry"
                  className="text-sm font-bold text-[var(--ocean)] underline-offset-4 transition-colors hover:text-[var(--deep)] hover:underline"
                >
                  Join our network
                </Link>
              )}

              {/*
                Live, and visibly so: the dot is the only thing on the page
                that moves on its own once the entrance has finished.

                A combination with nothing behind it says so rather than
                disappearing. The two menus each only list values with a live
                role, but Cardiology and Texas are both real and the pair is
                not — and a count that vanishes at exactly the moment it turns
                to zero is how somebody ends up submitting into an empty board.
              */}
              {intent === "coverage" && (
                <span className="ml-auto inline-flex items-center gap-2 rounded-full bg-[var(--ice)] px-3 py-1.5 text-[12px] font-bold text-[var(--deep)]">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="live-ping absolute inline-flex h-full w-full rounded-full bg-[var(--teal)]" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--teal)]" />
                  </span>
                  {coverageLine}
                </span>
              )}

              {intent === "provider" &&
                (matchCount > 0 ? (
                  <span className="ml-auto inline-flex items-center gap-2 rounded-full bg-[var(--ice)] px-3 py-1.5 text-[12px] font-bold text-[var(--deep)]">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="live-ping absolute inline-flex h-full w-full rounded-full bg-[var(--teal)]" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--teal)]" />
                    </span>
                    {matchCount} open now
                  </span>
                ) : (
                  <span className="ml-auto inline-flex items-center gap-2 rounded-full bg-[var(--ice)] px-3 py-1.5 text-[12px] font-semibold text-[var(--muted-foreground)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--muted-foreground)]/50" />
                    None right now — try another state
                  </span>
                ))}
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
