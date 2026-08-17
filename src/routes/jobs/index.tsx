import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { getJobs, type JobsFeed } from "@/lib/api/jobs.functions";
import heroDoctors from "@/assets/hero-doctors.jpg";
import {
  Search,
  MapPin,
  Stethoscope,
  UserRound,
  ArrowRight,
  SlidersHorizontal,
  Inbox,
  AlertCircle,
  PhoneCall,
} from "lucide-react";

export const Route = createFileRoute("/jobs/")({
  head: () => ({
    meta: [
      { title: "Open Locum Tenens Jobs — Orchard" },
      {
        name: "description",
        content:
          "Browse current locum tenens assignments from Orchard — physician-founded staffing with roles across specialties and all 50 states.",
      },
      { property: "og:title", content: "Open Locum Tenens Jobs — Orchard" },
      { property: "og:description", content: "Current locum tenens assignments from Orchard." },
      { property: "og:url", content: "/jobs" },
    ],
    links: [{ rel: "canonical", href: "/jobs" }],
  }),
  // Fetched on the server so listings are in the HTML for crawlers.
  loader: async () => ({ feed: await getJobs() }),
  component: JobsPage,
});

const ANY = "__any__";

function Select({
  label,
  value,
  options,
  onChange,
  icon: Icon,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  icon: typeof MapPin;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--deep)]/75">
        {label}
      </span>
      <span className="relative block">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ocean)]" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-[var(--border)] bg-white py-3 pl-10 pr-9 text-[15px] text-[var(--deep)] shadow-sm transition-all focus:border-[var(--teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--teal)]/15"
        >
          <option value={ANY}>All {label.toLowerCase()}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </span>
    </label>
  );
}

function JobCard({ job, delay }: { job: JobRow; delay: number }) {
  const place = [job.city, job.state].filter(Boolean).join(", ");
  // Many roles are titled by their specialty, which would repeat it as a chip.
  const same = (a: string | null) => !!a && a.trim().toLowerCase() === job.title.trim().toLowerCase();
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

type JobRow = Extract<JobsFeed, { status: "ok" }>["jobs"][number];

/** Shared shell for the three non-listing states, so they all sit right. */
function Notice({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Inbox;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal className="mx-auto max-w-xl rounded-3xl border border-[var(--border)] bg-white p-10 text-center shadow-[var(--shadow-soft)]">
      <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--ocean)]/15 bg-[var(--ice)] text-[var(--ocean)]">
        <Icon className="h-7 w-7" strokeWidth={1.6} />
      </span>
      <h2 className="mt-5 text-xl font-bold text-[var(--deep)]">{title}</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted-foreground)]">{children}</p>
      <Link
        to="/provider-inquiry"
        className="cta mt-7 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white shadow-[var(--shadow-soft)]"
        style={{ background: "linear-gradient(135deg, #3D9AB8 0%, #5097D5 50%, #467A9F 100%)" }}
      >
        Tell us what you're looking for
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Reveal>
  );
}

function JobsPage() {
  const { feed } = Route.useLoaderData();
  const jobs = feed.status === "ok" ? feed.jobs : [];

  const [query, setQuery] = useState("");
  const [state, setState] = useState(ANY);
  const [specialty, setSpecialty] = useState(ANY);
  const [providerType, setProviderType] = useState(ANY);
  /** Cards render in pages — a few hundred at once is a lot of DOM on a phone. */
  const PAGE = 24;
  const [shown, setShown] = useState(PAGE);

  const uniq = (get: (j: JobRow) => string | null) =>
    [...new Set(jobs.map(get).filter((v): v is string => !!v))].sort();

  const states = useMemo(() => uniq((j) => j.state), [jobs]);
  const specialties = useMemo(() => uniq((j) => j.specialty), [jobs]);
  const providerTypes = useMemo(() => uniq((j) => j.providerType), [jobs]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((j) => {
      if (state !== ANY && j.state !== state) return false;
      if (specialty !== ANY && j.specialty !== specialty) return false;
      if (providerType !== ANY && j.providerType !== providerType) return false;
      if (!q) return true;
      return [j.title, j.city, j.state, j.specialty, j.providerType, j.description]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(q));
    });
  }, [jobs, query, state, specialty, providerType]);

  useEffect(() => setShown(PAGE), [query, state, specialty, providerType]);

  const filtered = state !== ANY || specialty !== ANY || providerType !== ANY || query.trim() !== "";

  const clearAll = () => {
    setQuery("");
    setState(ANY);
    setSpecialty(ANY);
    setProviderType(ANY);
  };

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
              "linear-gradient(140deg, rgba(20,99,159,0.90) 0%, rgba(12,82,137,0.90) 38%, rgba(9,63,107,0.91) 72%, rgba(7,44,74,0.93) 100%)",
          }}
        />
        <div
          aria-hidden
          className="float-slow pointer-events-none absolute -top-28 -right-20 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "#1A82CD" }}
        />
        <div className="relative mx-auto max-w-3xl px-6 pt-38 pb-20 text-center lg:px-10 md:pt-46 md:pb-28">
          <span className="enter-up inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur">
            Open positions
          </span>
          <h1
            className="enter-up mt-6 text-4xl font-bold leading-[1.06] md:text-5xl lg:text-6xl"
            style={{ animationDelay: "90ms" }}
          >
            Find your next assignment
          </h1>
          <p
            className="enter-up mt-6 text-lg leading-relaxed text-white/85 md:text-xl"
            style={{ animationDelay: "180ms" }}
          >
            Current locum tenens openings, updated straight from our system. Every
            role is placed by a physician-led team — and nothing goes to a facility
            without your approval.
          </p>
          {feed.status === "ok" && jobs.length > 0 && (
            <p
              className="enter-up mt-6 text-sm font-semibold text-white/70"
              style={{ animationDelay: "270ms" }}
            >
              {jobs.length} {jobs.length === 1 ? "open position" : "open positions"} right now
            </p>
          )}
        </div>
      </section>

      {/* LISTINGS */}
      <section className="flex-1 gradient-soft">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-24">
          {feed.status === "unconfigured" && (
            <Notice icon={Inbox} title="Our live job feed is switching on">
              We're finishing the connection to our scheduling system. In the
              meantime, tell us your specialty and where you'd like to work, and a
              physician-led recruiter will bring roles to you directly.
            </Notice>
          )}

          {feed.status === "error" && (
            <Notice icon={AlertCircle} title="We couldn't load openings just now">
              This one's on us — the listings will be back shortly. If you'd rather
              not wait, send us your details and we'll match you by hand.
            </Notice>
          )}

          {feed.status === "ok" && jobs.length === 0 && (
            <Notice icon={Inbox} title="No openings posted at the moment">
              New assignments come in constantly and the best ones move fast. Tell us
              what you're looking for and we'll reach out the moment something fits.
            </Notice>
          )}

          {feed.status === "ok" && jobs.length > 0 && (
            <>
              {/* Filters */}
              <Reveal className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-7">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--teal)]">
                  <SlidersHorizontal className="h-4 w-4" />
                  Narrow it down
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--deep)]/75">
                      Search
                    </span>
                    <span className="relative block">
                      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ocean)]" />
                      <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Title, city, specialty…"
                        className="w-full rounded-xl border border-[var(--border)] bg-white py-3 pl-10 pr-4 text-[15px] text-[var(--deep)] shadow-sm transition-all placeholder:text-[var(--muted-foreground)] focus:border-[var(--teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--teal)]/15"
                      />
                    </span>
                  </label>

                  <Select label="States" value={state} options={states} onChange={setState} icon={MapPin} />
                  <Select
                    label="Specialties"
                    value={specialty}
                    options={specialties}
                    onChange={setSpecialty}
                    icon={Stethoscope}
                  />
                  <Select
                    label="Provider types"
                    value={providerType}
                    options={providerTypes}
                    onChange={setProviderType}
                    icon={UserRound}
                  />
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Showing{" "}
                    <span className="font-bold text-[var(--deep)]">{visible.length}</span> of{" "}
                    {jobs.length}
                  </p>
                  {filtered && (
                    <button
                      type="button"
                      onClick={clearAll}
                      className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--deep)] transition-colors hover:bg-[var(--ice)]"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </Reveal>

              {/* Results */}
              {visible.length > 0 ? (
                <>
                  <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {visible.slice(0, shown).map((job, i) => (
                      <JobCard key={job.id} job={job} delay={(i % 3) * 90} />
                    ))}
                  </div>

                  {visible.length > shown && (
                    <div className="mt-10 text-center">
                      <button
                        type="button"
                        onClick={() => setShown((n) => n + PAGE)}
                        className="cta inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-7 py-3.5 text-sm font-bold text-[var(--deep)] shadow-[var(--shadow-soft)] transition-colors hover:bg-[var(--ice)]"
                      >
                        Show more roles
                        <span className="text-[var(--muted-foreground)]">
                          ({visible.length - shown} left)
                        </span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Reveal className="mt-8 rounded-3xl border border-[var(--border)] bg-white p-10 text-center shadow-[var(--shadow-soft)]">
                  <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--ocean)]/15 bg-[var(--ice)] text-[var(--ocean)]">
                    <Search className="h-7 w-7" strokeWidth={1.6} />
                  </span>
                  <h2 className="mt-5 text-xl font-bold text-[var(--deep)]">
                    Nothing matches those filters
                  </h2>
                  <p className="mt-3 text-[15px] text-[var(--muted-foreground)]">
                    Try widening your search — or tell us what you want and we'll go find it.
                  </p>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="mt-6 rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--deep)] transition-colors hover:bg-[var(--ice)]"
                  >
                    Clear filters
                  </button>
                </Reveal>
              )}
            </>
          )}
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="relative overflow-hidden text-white" style={{ background: "#083d68" }}>
        <div
          aria-hidden
          className="float-slower pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full opacity-20 blur-3xl"
          style={{ background: "#1A82CD" }}
        />
        <div className="relative mx-auto max-w-3xl px-6 py-20 text-center lg:px-10 md:py-24">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Don't see the right fit?
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-white/80">
              Assignments open every week and many never make it to a job board. Tell
              us your specialty, licensure, and the dates you're free — we'll bring
              the roles to you.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-5">
              <Link
                to="/provider-inquiry"
                className="cta inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[var(--deep)] shadow-[var(--shadow-soft)] hover:bg-[var(--ice)]"
              >
                Join the network
                <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-white/75">
                <PhoneCall className="h-4 w-4" />
                Or call 847 861 5300
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
