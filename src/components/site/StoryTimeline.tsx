import { Reveal } from "./Reveal";
import { eras } from "@/lib/timeline";

/**
 * Eighteen entries is a lot to read, so the rail groups them into eras and
 * leans on year markers: skim the eras, stop at the year you care about.
 */
export function StoryTimeline() {
  return (
    <div className="space-y-14 md:space-y-16">
      {eras.map((era, ei) => (
        <div key={era.name}>
          {/* Era header */}
          <Reveal className="border-t-2 border-[var(--ocean)]/25 pt-6">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--teal)]">
                Era {["One", "Two", "Three"][ei] ?? ei + 1}
              </span>
              <span className="text-sm font-bold tabular-nums text-[var(--muted-foreground)]">
                {era.range}
              </span>
            </div>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-[var(--deep)] md:text-3xl">
              {era.name}
            </h3>
            <p className="mt-2 text-[15px] text-[var(--muted-foreground)]">{era.tagline}</p>
          </Reveal>

          {/* Entries on a rail */}
          <ol className="mt-8 space-y-0">
            {era.entries.map((m, i) => (
              <Reveal
                as="li"
                key={`${m.year}-${m.title}`}
                delay={Math.min(i, 4) * 60}
                className="relative grid gap-x-6 gap-y-2 pb-8 pl-8 last:pb-0 sm:grid-cols-[5.5rem_1fr] sm:pl-0"
              >
                {/* Rail + node, mobile only on the left gutter */}
                <span
                  aria-hidden
                  className="absolute left-[7px] top-2 h-full w-px bg-[var(--border)] sm:hidden"
                />
                <span
                  aria-hidden
                  className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[var(--ocean)] bg-white sm:hidden"
                />

                <span className="text-sm font-bold tabular-nums text-[var(--ocean)] sm:pt-0.5">
                  {m.year}
                </span>
                <span className="min-w-0">
                  <span className="block text-[17px] font-bold leading-snug text-[var(--deep)]">
                    {m.title}
                  </span>
                  <span className="mt-2 block max-w-3xl text-[15px] leading-relaxed text-[var(--muted-foreground)]">
                    {m.body}
                  </span>
                </span>
              </Reveal>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}
