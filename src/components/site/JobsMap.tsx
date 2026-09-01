import { Link } from "@tanstack/react-router";

import { US_STATE_PATHS, US_STATE_CENTROIDS } from "@/lib/usStatePaths";
import { US_STATES, landingPath, MIN_JOBS_FOR_PAGE } from "@/lib/taxonomy";

type StateRow = { code: string; name: string; slug: string; count: number };

/**
 * The geometry is drawn in a 960x600 space (see usStatePaths.ts). The viewBox
 * is wider and taller than that on purpose: Maine runs right up to x=960, so
 * the northeastern labels have nowhere to live inside the map itself, and the
 * extra column to the right is where they go.
 */
const VIEWBOX = "0 0 1060 620";

/**
 * Shading. One hue at four strengths rather than four colours: the question a
 * visitor asks here is "is there work near me", so the map has to answer
 * yes/no at a glance and only then how much. Separate hues would make it a
 * puzzle to decode.
 *
 * Nothing at all for states with no openings, which is the honest rendering —
 * a pale wash would still read as "some".
 */
const FILL_OPACITY = [0, 0.3, 0.58, 0.88];

/**
 * States too small to hold their own label, with the position of the label
 * that stands in for them. Measured, not guessed: at this scale DC is 4x3
 * units and Rhode Island 13 wide, so a two-letter label is bigger than the
 * state it would sit on.
 *
 * Ordered top to bottom in roughly the order the states themselves run, which
 * is what keeps the leader lines from crossing each other.
 */
const EXTERNAL_LABELS: Record<string, [number, number]> = {
  VT: [1000, 165],
  NH: [1000, 190],
  MA: [1000, 215],
  RI: [1000, 240],
  CT: [1000, 265],
  NJ: [1000, 290],
  DE: [1000, 315],
  MD: [1000, 340],
  DC: [1000, 365],
};

/**
 * Hawaii is the one state whose centroid lands outside itself — it falls in
 * the water between the islands — so its label is placed under the chain
 * instead. Every other state was checked and contains its own centroid.
 */
const LABEL_OVERRIDE: Record<string, [number, number]> = {
  HI: [314, 596],
};

function tierOf(count: number): number {
  if (count <= 0) return 0;
  if (count < MIN_JOBS_FOR_PAGE) return 1;
  if (count < 6) return 2;
  return 3;
}

function label(code: string, count: number): string {
  const name = US_STATES[code] ?? code;
  if (count <= 0) return `${name} — no openings right now`;
  return `${name} — ${count} open ${count === 1 ? "role" : "roles"}`;
}

export function JobsMap({
  states,
  /**
   * When the page is being filtered, the codes still in play. States outside
   * it drop to the empty treatment rather than vanishing — the map has to stay
   * a map, and a US outline with holes punched in it reads as broken.
   */
  highlight,
}: {
  states: StateRow[];
  highlight?: Set<string> | null;
}) {
  const byCode = new Map(states.map((s) => [s.code, s]));
  const covered = states.filter(
    (s) => s.count > 0 && (!highlight || highlight.has(s.code)),
  ).length;
  const codes = Object.keys(US_STATE_PATHS).sort();

  const tierFor = (code: string) => {
    const dimmed = highlight ? !highlight.has(code) : false;
    return tierOf(dimmed ? 0 : (byCode.get(code)?.count ?? 0));
  };

  return (
    <div>
      <div className="rounded-3xl border border-[var(--border)] bg-white p-4 shadow-sm sm:p-6">
        {/*
          aria-hidden with unfocusable links is deliberate. Every state on this
          map is already a labelled row in the list below, so exposing 51 more
          links would make a screen reader read the same thing twice and add 51
          tab stops between the heading and the content. The map is the visual
          telling of a list that stays the accessible one.
        */}
        <svg viewBox={VIEWBOX} className="h-auto w-full" aria-hidden="true" focusable="false">
          {codes.map((code) => {
            const row = byCode.get(code);
            const dimmed = highlight ? !highlight.has(code) : false;
            const count = dimmed ? 0 : (row?.count ?? 0);
            const tier = tierOf(count);

            const shape = (
              <path
                d={US_STATE_PATHS[code]}
                fill={tier === 0 ? "var(--ice)" : "var(--teal)"}
                fillOpacity={tier === 0 ? 1 : FILL_OPACITY[tier]}
                stroke="white"
                strokeWidth={1}
                className={
                  tier === 0
                    ? ""
                    : "cursor-pointer transition-opacity duration-150 hover:opacity-70"
                }
              >
                <title>{label(code, count)}</title>
              </path>
            );

            if (tier === 0) return <g key={code}>{shape}</g>;

            // Below the threshold a state has no page of its own, so it goes
            // to the filtered board instead — same rule the list below follows.
            const to = row && count >= MIN_JOBS_FOR_PAGE ? landingPath(row.slug) : "/jobs";
            return (
              <Link key={code} to={to} tabIndex={-1}>
                {shape}
              </Link>
            );
          })}

          {/*
            Labels last, so they sit above every shape, and non-interactive so
            they never swallow a click meant for the state underneath.

            Hidden on the smallest screens: the viewBox is 1060 units wide, so
            on a 375px phone a 15-unit label renders at about five pixels.
            Better to show none than to show something nobody can read — the
            list underneath is the answer at that width.
          */}
          <g className="pointer-events-none hidden sm:inline">
            {codes.map((code) => {
              const external = EXTERNAL_LABELS[code];
              const tier = tierFor(code);
              const anchor = LABEL_OVERRIDE[code] ?? US_STATE_CENTROIDS[code];
              if (!anchor) return null;

              if (external) {
                return (
                  <g key={`l-${code}`}>
                    <line
                      x1={anchor[0]}
                      y1={anchor[1]}
                      x2={external[0] - 6}
                      y2={external[1] - 4}
                      stroke="var(--border)"
                      strokeWidth={1}
                    />
                    <text
                      x={external[0]}
                      y={external[1]}
                      textAnchor="start"
                      fontSize={15}
                      fontWeight={700}
                      fill="var(--deep)"
                    >
                      {code}
                    </text>
                  </g>
                );
              }

              return (
                <text
                  key={`l-${code}`}
                  x={anchor[0]}
                  y={anchor[1]}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={15}
                  fontWeight={700}
                  // White once the fill is dark enough to swallow deep navy.
                  fill={tier >= 2 ? "white" : "var(--deep)"}
                  fillOpacity={tier === 0 ? 0.45 : 1}
                >
                  {code}
                </text>
              );
            })}
          </g>
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <p className="text-sm text-[var(--slate)]">
          <strong className="font-semibold text-[var(--deep)]">
            {covered} {covered === 1 ? "state" : "states"}
          </strong>{" "}
          {highlight
            ? covered === 1
              ? "matches your search."
              : "match your search."
            : "with openings right now."}
        </p>
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--slate)]">
            Fewer
          </span>
          <div className="flex items-center gap-1">
            {FILL_OPACITY.map((opacity, i) => (
              <span
                key={i}
                className="h-3.5 w-6 rounded-[3px] border border-[var(--border)]"
                style={{
                  background: i === 0 ? "var(--ice)" : "var(--teal)",
                  opacity: i === 0 ? 1 : opacity,
                }}
              />
            ))}
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--slate)]">
            More
          </span>
        </div>
      </div>
    </div>
  );
}
