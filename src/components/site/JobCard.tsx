import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { Stethoscope, MapPin, ArrowRight } from "lucide-react";
import type { Job } from "@/lib/salesforce.server";

/** Shared by the jobs board and the provider-inquiry teaser. */
export function JobCard({ job, delay = 0 }: { job: Job; delay?: number }) {
  const place = [job.city, job.state].filter(Boolean).join(", ");
  // Many roles are titled by their specialty, which would repeat it as a chip.
  const same = (a: string | null) =>
    !!a && a.trim().toLowerCase() === job.title.trim().toLowerCase();
  // Schedules range from "ASAP - Ongoing" to three paragraphs of shift dates;
  // only the short ones work as a pill.
  const schedule = job.duration && job.duration.length <= 40 ? job.duration : null;
  const chips = [same(job.specialty) ? null : job.specialty, job.providerType, schedule].filter(
    Boolean,
  );

  return (
    <Reveal
      delay={delay}
      className="group lift-lg flex flex-col rounded-2xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)]"
    >
      <div className="flex items-start gap-4">
        <span className="mt-0.5 flex h-11 w-11 flex-none items-center justify-center rounded-xl gradient-teal text-white shadow-sm">
          <Stethoscope className="icon-pop h-5 w-5" strokeWidth={1.7} />
        </span>
        <div className="min-w-0">
          <h3 className="text-lg font-bold leading-snug text-[var(--deep)]">{job.title}</h3>
          {place && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
              <MapPin className="h-3.5 w-3.5 flex-none text-[var(--ocean)]" />
              {place}
            </p>
          )}
        </div>
      </div>

      {chips.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <span
              key={chip as string}
              className="rounded-full border border-[var(--ocean)]/20 bg-[var(--ice)] px-2.5 py-1 text-[11px] font-semibold text-[var(--ocean)]"
            >
              {chip}
            </span>
          ))}
        </div>
      )}

      {job.description && (
        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
          {job.description}
        </p>
      )}

      <div className="mt-auto pt-5">
        <Link
          to="/jobs/$jobId"
          params={{ jobId: job.id }}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--ocean)] transition-colors hover:text-[var(--deep)]"
        >
          View this role
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </Reveal>
  );
}
