import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { JobCard } from "@/components/site/JobCard";
import { getJobs, type JobsFeed } from "@/lib/api/jobs.functions";
import heroDoctors from "@/assets/hero-doctors.jpg";
import {
  Search,
  MapPin,
  Stethoscope,
  UserRound,
  ArrowRight,
  SlidersHorizontal,
  Briefcase,
  ChevronDown,
  Inbox,
  AlertCircle,
  PhoneCall,
} from "lucide-react";
import { seo } from "@/lib/seo";

type JobSearch = {
  q?: string;
  state?: string;
  specialty?: string;
  providerType?: string;
  jobClass?: string;
};

export const Route = createFileRoute("/jobs/")({
  // Filters are readable from the URL so a link can open the board already
  // narrowed — the homepage specialty chips rely on this, and it makes a
  // filtered view something you can send to someone.
  //
  // Keys are omitted rather than set to undefined: returning every key makes
  // the router treat `search` as a required prop on every <Link to="/jobs">,
  // which breaks each one that just wants the unfiltered board.
  validateSearch: (search: Record<string, unknown>): JobSearch => {
    const text = (v: unknown) => (typeof v === "string" && v.trim() !== "" ? v : undefined);
    const out: JobSearch = {};
    for (const key of ["q", "state", "specialty", "providerType", "jobClass"] as const) {
      const value = text(search[key]);
      if (value) out[key] = value;
    }
    return out;
  },
  /*
    The live count goes in the title. A number is the strongest thing a jobs
    result can put in front of somebody scanning a page of them, and because it
    comes from the feed it also tells Google the page changes — a static title
    on a board that turns over daily looks stale whether or not it is.

    "Physician jobs" sits alongside "locum tenens" because they are two
    different searches: the insider term and the term everyone else uses.
  */
  head: ({ loaderData }) => {
    const open = loaderData?.feed.status === "ok" ? loaderData.feed.jobs.length : 0;
    return seo({
      title: open
        ? `Locum Tenens & Physician Jobs — ${open} Open Assignments | Orchard`
        : "Locum Tenens & Physician Jobs — Current Assignments | Orchard",
      description: open
        ? `Browse ${open} open locum tenens and permanent physician jobs from Orchard — ` +
          "physician-founded staffing across every specialty and all 50 states. Apply direct."
        : "Browse current locum tenens and permanent physician jobs from Orchard — physician-founded staffing across every specialty and all 50 states.",
      path: "/jobs",
    });
  },
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
  const params = Route.useSearch();
  const jobs = feed.status === "ok" ? feed.jobs : [];

  const [query, setQuery] = useState(params.q ?? "");
  const [state, setState] = useState(params.state ?? ANY);
  const [specialty, setSpecialty] = useState(params.specialty ?? ANY);
  const [providerType, setProviderType] = useState(params.providerType ?? ANY);
  const [jobClass, setJobClass] = useState(params.jobClass ?? ANY);
  /** Collapsed on phones, where an open panel buries the listings; always open
   *  from lg up, where it is the sidebar. */
  const [filtersOpen, setFiltersOpen] = useState(false);
  /** Cards render in pages — a few hundred at once is a lot of DOM on a phone. */
  const PAGE = 24;
  const [shown, setShown] = useState(PAGE);

  const uniq = (get: (j: JobRow) => string | null) =>
    [...new Set(jobs.map(get).filter((v): v is string => !!v))].sort();

  const states = useMemo(() => uniq((j) => j.state), [jobs]);
  const specialties = useMemo(() => uniq((j) => j.specialty), [jobs]);
  const providerTypes = useMemo(() => uniq((j) => j.providerType), [jobs]);
  const jobClasses = useMemo(() => uniq((j) => j.jobClass), [jobs]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((j) => {
      if (state !== ANY && j.state !== state) return false;
      if (specialty !== ANY && j.specialty !== specialty) return false;
      if (providerType !== ANY && j.providerType !== providerType) return false;
      if (jobClass !== ANY && j.jobClass !== jobClass) return false;
      if (!q) return true;
      return [j.title, j.city, j.state, j.specialty, j.providerType, j.jobClass, j.description]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(q));
    });
  }, [jobs, query, state, specialty, providerType, jobClass]);

  useEffect(() => setShown(PAGE), [query, state, specialty, providerType, jobClass]);

  const filtered =
    state !== ANY ||
    specialty !== ANY ||
    providerType !== ANY ||
    jobClass !== ANY ||
    query.trim() !== "";

  const clearAll = () => {
    setQuery("");
    setState(ANY);
    setSpecialty(ANY);
    setProviderType(ANY);
    setJobClass(ANY);
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
        {/* Deliberately shallow: the listings are the point of this page, and a
            full-height hero pushed them below the fold. */}
        <div className="relative mx-auto max-w-7xl px-5 pt-30 pb-10 sm:px-8 md:pt-34 md:pb-12 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
            <div className="min-w-0">
              <span className="enter-up inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur">
                Open positions
              </span>
              <h1
                className="enter-up mt-3.5 text-3xl font-bold leading-[1.08] tracking-tight md:text-4xl lg:text-[2.75rem]"
                style={{ animationDelay: "90ms" }}
              >
                Find your next assignment
              </h1>
              <p
                className="enter-up mt-2.5 max-w-xl text-[15px] leading-relaxed text-white/80 md:text-base"
                style={{ animationDelay: "180ms" }}
              >
                Real opportunities, straight from our system. Vetted by a clinically governed
                team, and never shared with a facility without your approval.
              </p>
            </div>

            {feed.status === "ok" && jobs.length > 0 && (
              <div
                className="enter-up flex flex-none items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur"
                style={{ animationDelay: "270ms" }}
              >
                <span className="pulse-dot h-2 w-2 flex-none rounded-full bg-[#7ED0A5]" />
                <span className="text-2xl font-bold tabular-nums leading-none">{jobs.length}</span>
                <span className="text-[11px] font-semibold uppercase leading-tight tracking-[0.14em] text-white/75">
                  open
                  <br className="hidden sm:inline" /> positions
                </span>
              </div>
            )}
          </div>

          {/*
            Search is the first thing a provider reaches for, so it sits in the
            hero rather than fourth down a filter rail. It drives the same state
            the facets do — results update as you type, and the button is here
            for people who expect one, jumping to the grid on submit.
          */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              document.getElementById("job-results")?.scrollIntoView({ block: "start" });
            }}
            className="enter-up mt-8 flex flex-col gap-2.5 rounded-2xl bg-white p-2.5 shadow-[var(--shadow-float)] sm:flex-row sm:items-center"
            style={{ animationDelay: "340ms" }}
          >
            <span className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--ocean)]" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search jobs by title, city or specialty"
                placeholder="Search by title, city, or specialty…"
                className="w-full rounded-xl border-0 bg-transparent py-3.5 pl-12 pr-4 text-[16px] text-[var(--deep)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-0"
              />
            </span>
            <button
              type="submit"
              className="cta inline-flex flex-none items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-[15px] font-bold text-white gradient-teal shadow-[var(--shadow-soft)]"
            >
              Search
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>

      {/* LISTINGS */}
      <section className="flex-1 gradient-soft">
        <div id="job-results" className="mx-auto max-w-7xl px-5 pt-8 pb-16 sm:px-8 md:pt-10 md:pb-24">
          {feed.status === "unconfigured" && (
            <Notice icon={Inbox} title="Our live job feed is switching on">
              We're finishing the connection to our scheduling system. In the meantime, tell us your
              specialty and where you'd like to work, and a physician-led recruiter will bring roles
              to you directly.
            </Notice>
          )}

          {feed.status === "error" && (
            <Notice icon={AlertCircle} title="We couldn't load openings just now">
              This one's on us — the listings will be back shortly. If you'd rather not wait, send
              us your details and we'll match you by hand.
            </Notice>
          )}

          {feed.status === "ok" && jobs.length === 0 && (
            <Notice icon={Inbox} title="No openings posted at the moment">
              New assignments come in constantly and the best ones move fast. Tell us what you're
              looking for and we'll reach out the moment something fits.
            </Notice>
          )}

          {feed.status === "ok" && jobs.length > 0 && (
            <div className="grid gap-8 lg:grid-cols-[286px_1fr] lg:gap-10">
              {/* Filters — a sidebar on desktop, stacked above results on phones */}
              <Reveal
                as="div"
                className="lg:sticky lg:top-28 lg:self-start rounded-3xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setFiltersOpen((open) => !open)}
                    aria-expanded={filtersOpen}
                    aria-controls="job-filters"
                    className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--teal)] lg:pointer-events-none"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Refine
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 lg:hidden ${
                        filtersOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {filtered && (
                    <button
                      type="button"
                      onClick={clearAll}
                      className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--ocean)] transition-colors hover:text-[var(--deep)]"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div
                  id="job-filters"
                  className={`${filtersOpen ? "block" : "hidden"} mt-5 space-y-4 lg:block`}
                >
                  <Select
                    label="States"
                    value={state}
                    options={states}
                    onChange={setState}
                    icon={MapPin}
                  />
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
                  {jobClasses.length > 0 && (
                    <Select
                      label="Job types"
                      value={jobClass}
                      options={jobClasses}
                      onChange={setJobClass}
                      icon={Briefcase}
                    />
                  )}
                </div>

                <p className="mt-4 border-t border-[var(--border)] pt-4 text-sm text-[var(--muted-foreground)] lg:mt-5">
                  Showing <span className="font-bold text-[var(--deep)]">{visible.length}</span> of{" "}
                  {jobs.length}
                </p>
              </Reveal>

              {/* Results */}
              <div className="min-w-0">
                {visible.length > 0 ? (
                  <>
                    <div className="grid gap-5 sm:grid-cols-2">
                      {visible.slice(0, shown).map((job, i) => (
                        <JobCard key={job.id} job={job} delay={(i % 2) * 90} />
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
                  <Reveal className="rounded-3xl border border-[var(--border)] bg-white p-10 text-center shadow-[var(--shadow-soft)]">
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
              </div>
            </div>
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
              Assignments open every week and many never make it to a job board. Tell us your
              specialty, licensure, and the dates you're free — we'll bring the roles to you.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-5">
              <Link
                to="/provider-inquiry"
                className="cta inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[var(--deep)] shadow-[var(--shadow-soft)] hover:bg-[var(--ice)]"
              >
                Join the network
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/locum-tenens-jobs"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                Browse locum tenens jobs by state
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
