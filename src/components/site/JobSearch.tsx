import { useState } from "react";
import { MapPin, Stethoscope, ArrowRight } from "lucide-react";

const specialties = [
  "Emergency Medicine",
  "Pediatrics",
  "Surgery",
  "Family Medicine",
  "Anesthesiology",
  "Hospitalist",
];

const states = [
  "California",
  "Texas",
  "New York",
  "Florida",
  "Washington",
  "Colorado",
];

const sample = [
  { title: "ER Physician", loc: "Denver, CO", rate: "$310/hr", len: "13 weeks" },
  { title: "Pediatric Hospitalist", loc: "Austin, TX", rate: "$265/hr", len: "8 weeks" },
  { title: "General Surgeon", loc: "Sacramento, CA", rate: "$385/hr", len: "12 weeks" },
];

export function JobSearch() {
  const [specialty, setSpecialty] = useState(specialties[0]);
  const [state, setState] = useState(states[0]);

  return (
    <section id="jobs" className="relative py-24 lg:py-32 gradient-soft">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[var(--teal)]">
            Job Search Snapshot
          </span>
          <h2 className="mt-3 text-4xl lg:text-5xl font-bold text-[var(--deep)] leading-tight">
            Find your next assignment in seconds.
          </h2>
          <p className="mt-4 text-[var(--muted-foreground)] text-lg">
            Filter live openings across the country by specialty and location.
          </p>
        </div>

        <div className="mt-12 glass rounded-3xl p-6 lg:p-10 shadow-[var(--shadow-float)]">
          <div className="grid md:grid-cols-[1fr_1fr_auto] gap-4">
            <label className="flex items-center gap-3 rounded-2xl bg-white/80 border border-white px-4 py-3 shadow-[var(--shadow-soft)]">
              <Stethoscope className="h-5 w-5 text-[var(--teal)] shrink-0" />
              <div className="flex-1">
                <div className="text-[11px] uppercase tracking-wider text-[var(--muted-foreground)]">
                  Specialty
                </div>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full bg-transparent border-0 outline-none text-sm font-semibold text-[var(--deep)]"
                >
                  {specialties.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </label>

            <label className="flex items-center gap-3 rounded-2xl bg-white/80 border border-white px-4 py-3 shadow-[var(--shadow-soft)]">
              <MapPin className="h-5 w-5 text-[var(--cornflower)] shrink-0" />
              <div className="flex-1">
                <div className="text-[11px] uppercase tracking-wider text-[var(--muted-foreground)]">
                  Location
                </div>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-transparent border-0 outline-none text-sm font-semibold text-[var(--deep)]"
                >
                  {states.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </label>

            <button className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white gradient-teal lift">
              Search
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Results preview */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {sample.map((job) => (
              <a
                key={job.title}
                href="#"
                className="group block rounded-2xl bg-white/85 border border-white p-5 lift"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-[var(--deep)] group-hover:text-[var(--teal)] transition-colors">
                    {job.title}
                  </h3>
                  <span className="text-xs font-semibold text-[var(--teal)]">
                    {job.rate}
                  </span>
                </div>
                <div className="mt-2 text-sm text-[var(--muted-foreground)] flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> {job.loc}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="rounded-full bg-[var(--ice)] px-2.5 py-1 text-[var(--slate)] font-medium">
                    {job.len}
                  </span>
                  <span className="text-[var(--cornflower)] font-semibold inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    View <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
