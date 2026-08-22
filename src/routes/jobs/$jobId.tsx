import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { ApplyForm } from "@/components/site/ApplyForm";
import { getJob } from "@/lib/api/jobs.functions";
import type { JobDetail } from "@/lib/salesforce.server";
import heroDoctors from "@/assets/hero-doctors.jpg";
import { breadcrumbSchema, jobPostingSchema, jsonLd, seo } from "@/lib/seo";
import {
  MapPin,
  Stethoscope,
  UserRound,
  CalendarClock,
  BadgeCheck,
  ShieldCheck,
  ClipboardList,
  Clock,
  ArrowLeft,
  ArrowRight,
  PhoneCall,
  Inbox,
  Hash,
} from "lucide-react";

export const Route = createFileRoute("/jobs/$jobId")({
  loader: async ({ params }) => {
    const result = await getJob({ data: { id: params.jobId } });
    // A closed or unknown assignment has to answer 404, not 200. Google for
    // Jobs reads a 200 as "still open" and keeps the posting listed, so a soft
    // 404 leaves filled roles advertised in search results.
    //
    // Only genuine misses throw. An outage or misconfiguration is our fault,
    // not a missing resource, and a 404 would tell Google to drop a job that
    // still exists.
    if (result.status === "not-found") throw notFound();
    return { result };
  },
  notFoundComponent: () => (
    <Missing
      title="This role is no longer open"
      body="It's been filled or withdrawn since you last looked. Assignments turn over quickly — the current openings are one click away."
    />
  ),
  head: ({ loaderData, params }) => {
    const job = loaderData?.result.status === "ok" ? loaderData.result.job : null;
    const path = `/jobs/${params.jobId}`;

    // A job that has closed or never existed must not be indexed as a real
    // posting — it would be a soft 404 with structured data attached.
    if (!job) {
      return seo({
        title: "Job Not Found — Orchard",
        description: "This assignment is no longer listed. Browse Orchard's current locum tenens openings.",
        path,
        robots: "noindex, follow",
      });
    }

    const where = [job.city, job.state].filter(Boolean).join(", ");
    const title = `${job.title}${where ? ` — ${where}` : ""} | Orchard`;
    const description =
      job.description?.replace(/\s+/g, " ").trim().slice(0, 155) ||
      `Locum tenens ${job.specialty ?? "assignment"}${where ? ` in ${where}` : ""} with Orchard.`;

    return {
      ...seo({ title, description, path, type: "article" }),
      scripts: [
        jsonLd(jobPostingSchema(job)),
        jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Open Jobs", path: "/jobs" },
            { name: job.title, path },
          ]),
        ),
      ],
    };
  },
  component: JobDetailPage,
});

/** A labelled value in the at-a-glance grid. Renders nothing when empty. */
function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-[var(--ocean)]/15 bg-[var(--ice)] text-[var(--ocean)]">
        <Icon className="h-5 w-5" strokeWidth={1.7} />
      </span>
      <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
          {label}
        </div>
        <div className="mt-0.5 text-[15px] font-semibold text-[var(--deep)]">{value}</div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal className="border-t border-[var(--border)] pt-8">
      <h2 className="text-lg font-bold text-[var(--deep)]">{title}</h2>
      <div className="mt-4">{children}</div>
    </Reveal>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-2.5 text-[15px] leading-relaxed text-[var(--muted-foreground)]"
        >
          <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[var(--ocean)]" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function formatDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function yesNo(value: boolean | null, whenTrue: string, whenFalse?: string) {
  if (value === null) return null;
  return value ? whenTrue : (whenFalse ?? null);
}

function Missing({ title, body }: { title: string; body: string }) {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar overlay tone="light" />
      <section className="flex-1 gradient-soft">
        <div className="mx-auto max-w-xl px-5 pt-34 pb-16 sm:px-8 md:pt-42 md:pb-24">
          <Reveal className="rounded-3xl border border-[var(--border)] bg-white p-10 text-center shadow-[var(--shadow-soft)]">
            <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--ocean)]/15 bg-[var(--ice)] text-[var(--ocean)]">
              <Inbox className="h-7 w-7" strokeWidth={1.6} />
            </span>
            <h1 className="mt-5 text-xl font-bold text-[var(--deep)]">{title}</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted-foreground)]">
              {body}
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                to="/jobs"
                className="cta inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white shadow-[var(--shadow-soft)]"
                style={{
                  background: "linear-gradient(135deg, #3D9AB8 0%, #5097D5 50%, #467A9F 100%)",
                }}
              >
                Browse open roles
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/provider-inquiry"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-7 py-3.5 text-sm font-bold text-[var(--deep)] transition-colors hover:bg-[var(--ice)]"
              >
                Tell us what you want
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function JobDetailPage() {
  const { result } = Route.useLoaderData();

  // "not-found" never reaches here — the loader throws notFound() for it, so
  // the response is a real 404 and notFoundComponent renders that copy.
  if (result.status !== "ok") {
    return (
      <Missing
        title="We couldn't load this role"
        body="That's on us, and it should be brief. Try the full list, or send us your details and a recruiter will follow up by hand."
      />
    );
  }

  const job: JobDetail = result.job;
  const applyEnabled = result.applyEnabled;
  const specialties = result.specialties;
  const place = [job.city, job.state].filter(Boolean).join(", ");

  /**
   * Most external descriptions are already a complete posting that restates the
   * structured fields, so rendering both leaves the page saying everything
   * twice. Rather than assume a fixed template, drop any supplementary block
   * whose text the description already contains — sparse records keep their
   * structured detail, verbose ones don't repeat themselves.
   */
  const norm = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  const described = norm(job.description ?? "");
  const covered = (value: string | null) => {
    if (!value) return false;
    const needle = norm(value);
    return needle.length > 12 && described.includes(needle);
  };
  /** Show a block only when it has content the description hasn't already given. */
  const additional = (value: string | null) => (value && !covered(value) ? value : null);

  type Bullet = { text: string; probe: string };
  const bullets = (items: Array<Bullet | null>) =>
    items.filter((b): b is Bullet => !!b && !covered(b.probe)).map((b) => b.text);

  const bullet = (text: string | null, probe?: string): Bullet | null =>
    text ? { text, probe: probe ?? text } : null;

  const licensing = bullets([
    bullet(
      yesNo(
        job.requiresActiveLicense,
        "Active state license required",
        "State license not required upfront",
      ),
    ),
    bullet(yesNo(job.acceptsCompactLicense, "Compact license accepted")),
    bullet(yesNo(job.willingToLicense, "We'll sponsor licensure if you're not yet licensed here")),
    bullet(
      job.privilegingTimeline ? `Estimated privileging: ${job.privilegingTimeline}` : null,
      job.privilegingTimeline ?? undefined,
    ),
    bullet(
      job.minimumYearsExperience ? `Minimum ${job.minimumYearsExperience} years' experience` : null,
    ),
    ...job.compliance.map((c) => bullet(`${c} certification`)),
  ]);

  const practice = bullets([
    bullet(yesNo(job.soloCoverage, "Solo coverage", "Not solo coverage")),
    bullet(yesNo(job.appBackup, "APP backup available")),
    bullet(yesNo(job.proceduresRequired, "Procedures required")),
    bullet(
      job.shiftSchedule ? `Shift pattern: ${job.shiftSchedule}` : null,
      job.shiftSchedule ?? undefined,
    ),
    bullet(
      job.scheduleDetails ? `Setting: ${job.scheduleDetails}` : null,
      job.scheduleDetails ?? undefined,
    ),
  ]);

  const dayToDay = additional(job.dayToDay);
  const callDetails = additional(job.callDetails);
  const coverageDates = additional(job.coverageDates);
  const otherDetails = additional(job.otherDetails);
  const caseMix = job.caseMix.filter((c) => !covered(c));

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar overlay />

      {/* HERO */}
      <section className="relative overflow-hidden text-white" style={{ background: "#072C4A" }}>
        <img
          src={heroDoctors}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(140deg, rgba(20,99,159,0.92) 0%, rgba(12,82,137,0.92) 38%, rgba(9,63,107,0.93) 72%, rgba(7,44,74,0.94) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-6 pt-34 pb-16 lg:px-10 md:pt-42 md:pb-20">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/75 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            All open roles
          </Link>

          <h1 className="enter-up mt-6 text-3xl font-bold leading-[1.1] md:text-4xl lg:text-5xl">
            {job.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-white/85">
            {place && (
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {place}
              </span>
            )}
            {job.specialty && (
              <span className="inline-flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                {job.specialty}
              </span>
            )}
            {job.providerType && (
              <span className="inline-flex items-center gap-2">
                <UserRound className="h-4 w-4" />
                {job.providerType}
              </span>
            )}
            {job.reference && (
              <span className="inline-flex items-center gap-2 text-white/60">
                <Hash className="h-4 w-4" />
                {job.reference}
              </span>
            )}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-5">
            <a
              href="#apply"
              className="cta inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[var(--deep)] shadow-[var(--shadow-soft)] hover:bg-[var(--ice)]"
            >
              Apply for this role
              <ArrowRight className="h-4 w-4" />
            </a>
            <span className="inline-flex items-center gap-2 text-sm text-white/75">
              <PhoneCall className="h-4 w-4" />
              Or call 847 861 5300
            </span>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="flex-1 gradient-soft">
        <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8 md:py-20">
          <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)] sm:p-9 md:p-11">
            {/* At a glance */}
            <Reveal>
              <h2 className="text-lg font-bold text-[var(--deep)]">At a glance</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Fact icon={MapPin} label="Location" value={place || null} />
                <Fact icon={Stethoscope} label="Specialty" value={job.specialty} />
                <Fact icon={UserRound} label="Provider type" value={job.providerType} />
                <Fact icon={BadgeCheck} label="Credential" value={job.credential} />
                <Fact icon={BadgeCheck} label="Board status" value={job.boardStatus} />
                <Fact icon={ClipboardList} label="Assignment type" value={job.jobClass} />
                <Fact
                  icon={CalendarClock}
                  label="Estimated start"
                  value={formatDate(job.startDate)}
                />
                <Fact icon={CalendarClock} label="Estimated end" value={formatDate(job.endDate)} />
                <Fact icon={Clock} label="Coverage needed" value={job.coverageDates} />
                <Fact
                  icon={ClipboardList}
                  label="Openings"
                  value={job.positions && job.positions !== "1" ? job.positions : null}
                />
              </div>
            </Reveal>

            <div className="mt-10 space-y-8">
              {job.descriptionHtml && (
                <Section title="About this assignment">
                  <div
                    className="job-prose"
                    // Sanitised server-side against a tag allowlist, with every
                    // attribute stripped — see sanitizeHtml in salesforce.server.ts.
                    dangerouslySetInnerHTML={{ __html: job.descriptionHtml }}
                  />
                </Section>
              )}

              {dayToDay && (
                <Section title="Day to day">
                  <p className="whitespace-pre-line text-[15px] leading-relaxed text-[var(--muted-foreground)]">
                    {dayToDay}
                  </p>
                </Section>
              )}

              {practice.length > 0 && (
                <Section title="Practice details">
                  <Bullets items={practice} />
                </Section>
              )}

              {caseMix.length > 0 && (
                <Section title="Case mix">
                  <Bullets items={caseMix} />
                </Section>
              )}

              {callDetails && (
                <Section title="Call">
                  <p className="whitespace-pre-line text-[15px] leading-relaxed text-[var(--muted-foreground)]">
                    {callDetails}
                  </p>
                </Section>
              )}

              {coverageDates && (
                <Section title="Dates &amp; schedule">
                  <p className="whitespace-pre-line text-[15px] leading-relaxed text-[var(--muted-foreground)]">
                    {coverageDates}
                  </p>
                </Section>
              )}

              {licensing.length > 0 && (
                <Section title="Licensing &amp; requirements">
                  <Bullets items={licensing} />
                </Section>
              )}

              {job.subspecialties.length > 0 && (
                <Section title="Subspecialties">
                  <div className="flex flex-wrap gap-1.5">
                    {job.subspecialties.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-[var(--ocean)]/20 bg-[var(--ice)] px-3 py-1 text-xs font-semibold text-[var(--ocean)]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </Section>
              )}

              {otherDetails && (
                <Section title="Other details">
                  <p className="whitespace-pre-line text-[15px] leading-relaxed text-[var(--muted-foreground)]">
                    {otherDetails}
                  </p>
                </Section>
              )}
            </div>

            {/* Apply */}
            <Reveal
              id="apply"
              className="mt-12 scroll-mt-28 rounded-2xl border border-[var(--teal)]/25 bg-[var(--ice)] p-6 sm:p-8"
            >
              <div className="text-center">
                <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl gradient-teal text-white shadow-sm">
                  <ShieldCheck className="h-6 w-6" strokeWidth={1.7} />
                </div>
                <h2 className="mt-4 text-xl font-bold text-[var(--deep)]">Apply for this role</h2>
                <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[var(--muted-foreground)]">
                  Your details go straight to a physician-led recruiter
                  {job.reference ? (
                    <>
                      {" "}
                      against reference{" "}
                      <span className="font-semibold text-[var(--deep)]">{job.reference}</span>
                    </>
                  ) : null}
                  .
                </p>
              </div>

              <div className="mt-7 rounded-2xl bg-white p-5 shadow-[var(--shadow-soft)] sm:p-7">
                {applyEnabled ? (
                  <ApplyForm jobId={job.id} reference={job.reference} specialties={specialties} />
                ) : (
                  /* No reCAPTCHA secret means every submission would be refused,
                     so send people somewhere that works instead. */
                  <div className="text-center">
                    <p className="text-[15px] leading-relaxed text-[var(--muted-foreground)]">
                      Send us your details and a physician-led recruiter will walk you through this
                      role. We won't present you to any facility without your explicit approval.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                      <Link
                        to="/provider-inquiry"
                        className="cta inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white shadow-[var(--shadow-soft)]"
                        style={{
                          background:
                            "linear-gradient(135deg, #3D9AB8 0%, #5097D5 50%, #467A9F 100%)",
                        }}
                      >
                        Apply for this role
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <span className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                        <PhoneCall className="h-4 w-4 text-[var(--ocean)]" />
                        Or call 847 861 5300
                      </span>
                    </div>
                    {job.reference && (
                      <p className="mt-4 text-xs text-[var(--muted-foreground)]">
                        Quote reference{" "}
                        <span className="font-semibold text-[var(--deep)]">{job.reference}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </Reveal>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 text-sm font-bold text-[var(--ocean)] transition-colors hover:text-[var(--deep)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all open roles
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
