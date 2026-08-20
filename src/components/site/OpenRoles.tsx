import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { JobCard } from "./JobCard";
import type { Job } from "@/lib/salesforce.server";

/**
 * The board, surfaced early.
 *
 * Live roles are the most concrete thing on the homepage — proof rather than
 * pitch — so they sit directly under the approach statement instead of near
 * the foot of the page. The specialty chips deep-link into a filtered board,
 * which turns three static cards into an obvious way in.
 */
export function OpenRoles({
  openCount,
  recent,
  specialties,
}: {
  openCount: number;
  recent: Job[];
  specialties: string[];
}) {
  if (recent.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 md:py-20">
        <Reveal className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--teal)]" />
              Open right now
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--deep)] md:text-4xl">
              {openCount > 0 ? `${openCount} assignments open today` : "Assignments open today"}
            </h2>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--ocean)] transition-colors hover:text-[var(--deep)]"
          >
            View the full board
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        {specialties.length > 0 && (
          <Reveal delay={80} className="mt-7 flex flex-wrap gap-2">
            {specialties.map((name) => (
              <Link
                key={name}
                to="/jobs"
                search={{ specialty: name }}
                className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--deep)] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--teal)] hover:text-[var(--ocean)]"
              >
                {name}
              </Link>
            ))}
            <Link
              to="/jobs"
              className="rounded-full border border-[var(--ocean)]/25 bg-[var(--ice)] px-4 py-2 text-sm font-bold text-[var(--ocean)] transition-all hover:-translate-y-0.5 hover:border-[var(--teal)]"
            >
              All specialties →
            </Link>
          </Reveal>
        )}

        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((job, i) => (
            <JobCard key={job.id} job={job} delay={(i % 3) * 90} />
          ))}
        </div>
      </div>
    </section>
  );
}
