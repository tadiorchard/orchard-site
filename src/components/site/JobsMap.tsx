import { Link } from "@tanstack/react-router";

import { US_STATE_PATHS, MAP_VIEWBOX } from "@/lib/usStatePaths";
import { US_STATES, landingPath, MIN_JOBS_FOR_PAGE } from "@/lib/taxonomy";

type StateRow = { code: string; name: string; slug: string; count: number };

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

export function JobsMap({ states }: { states: StateRow[] }) {
  const byCode = new Map(states.map((s) => [s.code, s]));
  const covered = states.filter((s) => s.count > 0).length;
  const codes = Object.keys(US_STATE_PATHS).sort();

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
        <svg
          viewBox={MAP_VIEWBOX}
          className="h-auto w-full"
          aria-hidden="true"
          focusable="false"
        >
          {codes.map((code) => {
            const row = byCode.get(code);
            const count = row?.count ?? 0;
            const tier = tierOf(count);
            const d = US_STATE_PATHS[code];

            const shape = (
              <path
                d={d}
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
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <p className="text-sm text-[var(--slate)]">
          <strong className="font-semibold text-[var(--deep)]">{covered} states</strong> with
          openings right now.
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
