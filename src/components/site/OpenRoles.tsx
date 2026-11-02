import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Stethoscope } from "lucide-react";
import { Reveal } from "./Reveal";

/**
 * The way into the board, under the hero that shows it.
 *
 * This section used to repeat the hero: the same live count in its heading and
 * the same roles in its cards, both visible in one screen once the hero gained
 * its live panel. A reader learned nothing from the second telling.
 *
 * So it does the job the hero cannot instead. The hero shows what is open now
 * — a snapshot, four roles deep. This shows the shape of the whole board and
 * hands over the two filters people actually arrive with: a specialty, or a
 * place. Every chip is a real filtered page with roles behind it, and the
 * counts come from the same feed as the hero, so the two can never disagree.
 */
export function OpenRoles({
  specialties,
  states,
}: {
  specialties: Array<{ name: string; count: number }>;
  states: Array<{ code: string; name: string; count: number }>;
}) {
  if (specialties.length === 0 && states.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-[88rem] px-6 py-16 lg:px-10 md:py-20">
        <Reveal className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--deep)] md:text-4xl">
            Browse jobs by state &amp; specialty
          </h2>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--ocean)] transition-colors hover:text-[var(--deep)]"
          >
            View the full board
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        {/* Two panels rather than one run of chips: a specialty and a place are
            different questions, and the hero's search asks them in exactly
            these two fields. The counts are the point — they tell you which
            chip is worth a click before you spend one. */}
        <div className="mt-9 grid gap-5 lg:grid-cols-2">
          {specialties.length > 0 && (
            <Reveal className="rounded-2xl border border-[var(--border)] bg-[var(--ice)]/50 p-6 sm:p-7">
              <h3 className="flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.14em] text-[var(--deep)]/70">
                <Stethoscope className="h-4 w-4 text-[var(--teal)]" strokeWidth={2} aria-hidden />
                By specialty
              </h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {specialties.map((s) => (
                  <li key={s.name}>
                    <Link
                      to="/jobs"
                      search={{ specialty: s.name }}
                      className="group inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--deep)] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--teal)] hover:text-[var(--ocean)]"
                    >
                      {s.name}
                      <span className="text-[12px] font-bold tabular-nums text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--ocean)]">
                        {s.count}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {states.length > 0 && (
            <Reveal
              delay={90}
              className="rounded-2xl border border-[var(--border)] bg-[var(--ice)]/50 p-6 sm:p-7"
            >
              <h3 className="flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.14em] text-[var(--deep)]/70">
                <MapPin className="h-4 w-4 text-[var(--teal)]" strokeWidth={2} aria-hidden />
                By state
              </h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {states.map((s) => (
                  <li key={s.code}>
                    <Link
                      to="/jobs"
                      search={{ state: s.code }}
                      className="group inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--deep)] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--teal)] hover:text-[var(--ocean)]"
                    >
                      {s.name}
                      <span className="text-[12px] font-bold tabular-nums text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--ocean)]">
                        {s.count}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>

        {/* Keyword anchor text into the hub. It had one inbound link on the
            whole site — the footer — which is thin for the page most targeted
            at the term people actually search. */}
        <Reveal delay={160} className="mt-7">
          <Link
            to="/locum-tenens-jobs"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--ocean)]/25 bg-[var(--ice)] px-5 py-2.5 text-sm font-bold text-[var(--ocean)] transition-all hover:-translate-y-0.5 hover:border-[var(--teal)]"
          >
            Locum tenens jobs by state &amp; specialty
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
