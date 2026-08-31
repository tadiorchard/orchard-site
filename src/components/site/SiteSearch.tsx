import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, X, Briefcase, MapPin, Stethoscope, FileText, CornerDownLeft } from "lucide-react";

import { getSearchIndex, type SearchIndex } from "@/lib/api/search.functions";
import { SEARCH_PAGES } from "@/lib/searchPages";
import { landingPath } from "@/lib/taxonomy";

type Group = "Jobs" | "Browse" | "Pages";

type Result = {
  key: string;
  group: Group;
  title: string;
  sub: string;
  to: string;
  score: number;
};

/** Caps per group. Enough to be useful, few enough to stay scannable. */
const LIMITS: Record<Group, number> = { Jobs: 7, Browse: 5, Pages: 5 };

/**
 * Every token has to appear, and where it appears decides the rank — a hit in
 * the title outweighs one in the keyword bag.
 *
 * Matching is word-prefix, not free substring. A plain `includes` looked fine
 * until live data went through it: searching "NC" returned emergency medicine
 * in Missouri, because "emerge(nc)y" contains the letters. Two-letter state
 * codes are exactly what people type at a job board, so the common case was
 * the broken one. Anchoring to a word boundary keeps "NC" on North Carolina
 * and still lets "cardio" find Cardiovascular.
 *
 * Not fuzzy, either: fuzzy over 320 clinical titles produces confident
 * nonsense, and a search that quietly returns the wrong role is worse than one
 * that returns nothing.
 */
type Token = { text: string; re: RegExp };

function tokenize(query: string): Token[] {
  return query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((text) => ({
      text,
      re: new RegExp(`\\b${text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i"),
    }));
}

function score(title: string, haystack: string, tokens: Token[]): number {
  const t = title.toLowerCase();
  let total = 0;
  for (const { text, re } of tokens) {
    if (!re.test(haystack)) return 0;
    if (t === text) total += 100;
    else if (t.startsWith(text)) total += 40;
    else if (re.test(t)) total += 20;
    else total += 5;
  }
  return total;
}

function iconFor(group: Group, index: number) {
  if (group === "Jobs") return <Briefcase className="h-4 w-4" strokeWidth={1.8} />;
  if (group === "Pages") return <FileText className="h-4 w-4" strokeWidth={1.8} />;
  return index % 2 === 0 ? (
    <MapPin className="h-4 w-4" strokeWidth={1.8} />
  ) : (
    <Stethoscope className="h-4 w-4" strokeWidth={1.8} />
  );
}

export function SiteSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchIndex | null>(null);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  // Fetched once, on first open. The jobs feed changes daily, not by the
  // minute, so re-fetching on every open would spend a round trip to tell the
  // visitor the same thing.
  useEffect(() => {
    if (!open || index || loading) return;
    setLoading(true);
    getSearchIndex()
      .then(setIndex)
      // Pages still search fine without the live half.
      .catch(() => setIndex({ jobs: [], landing: [] }))
      .finally(() => setLoading(false));
  }, [open, index, loading]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Clearing on close means reopening starts fresh rather than showing the
  // last search's results for a frame.
  useEffect(() => {
    if (!open) {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  const results = useMemo<Result[]>(() => {
    const tokens = tokenize(query);
    if (tokens.length === 0) return [];

    const out: Result[] = [];

    for (const page of SEARCH_PAGES) {
      const s = score(page.title, `${page.title} ${page.blurb} ${page.keywords}`, tokens);
      if (s > 0) {
        out.push({
          key: `page:${page.path}`,
          group: "Pages",
          title: page.title,
          sub: page.blurb,
          to: page.path,
          score: s,
        });
      }
    }

    for (const place of index?.landing ?? []) {
      const label = place.kind === "state" ? `${place.name} jobs` : `${place.name} jobs`;
      const s = score(place.name, `${place.name} ${place.kind} jobs locum tenens`, tokens);
      if (s > 0) {
        out.push({
          key: `landing:${place.slug}`,
          group: "Browse",
          title: label,
          sub: `${place.count} open ${place.count === 1 ? "role" : "roles"}`,
          to: landingPath(place.slug),
          score: s + 2,
        });
      }
    }

    for (const job of index?.jobs ?? []) {
      const s = score(
        job.title,
        `${job.title} ${job.place} ${job.stateCode} ${job.specialty ?? ""}`,
        tokens,
      );
      if (s > 0) {
        // The specialty is usually the title verbatim, so echoing it would
        // give every row the same two lines. Location is what distinguishes
        // one CRNA post from the next.
        const detail =
          job.specialty && job.specialty.toLowerCase() !== job.title.toLowerCase()
            ? [job.place, job.specialty].filter(Boolean).join(" · ")
            : job.place;
        out.push({
          key: `job:${job.id}`,
          group: "Jobs",
          title: job.title,
          sub: detail || "Open assignment",
          to: `/jobs/${job.id}`,
          score: s,
        });
      }
    }

    const taken: Record<Group, number> = { Jobs: 0, Browse: 0, Pages: 0 };
    const order: Group[] = ["Jobs", "Browse", "Pages"];
    return out
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
      .filter((r) => (taken[r.group] < LIMITS[r.group] ? (taken[r.group]++, true) : false))
      .sort((a, b) => order.indexOf(a.group) - order.indexOf(b.group) || b.score - a.score);
  }, [query, index]);

  useEffect(() => setActive(0), [query]);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      itemRefs.current[active]?.click();
    }
  };

  let lastGroup: Group | null = null;

  return (
    <div className="fixed inset-0 z-[70] flex justify-center px-4 pt-[12vh] sm:pt-[15vh]">
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        style={{ background: "rgba(4, 20, 38, 0.55)", backdropFilter: "blur(6px)" }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search Orchard"
        onKeyDown={onKeyDown}
        className="relative z-10 flex max-h-[70vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-[var(--shadow-float)]"
      >
        <div className="flex flex-none items-center gap-3 border-b border-[var(--border)] px-5 py-4">
          <Search className="h-5 w-5 flex-none text-[var(--ocean)]" strokeWidth={2} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            autoComplete="off"
            spellCheck={false}
            aria-label="Search jobs, locations and pages"
            placeholder="Search jobs, states, specialties or pages…"
            className="min-w-0 flex-1 border-0 bg-transparent text-[16px] text-[var(--deep)] outline-none placeholder:text-[var(--muted-foreground)]"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-[var(--muted-foreground)] transition-colors hover:bg-[var(--ice)] hover:text-[var(--deep)]"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {query.trim() === "" ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-[var(--muted-foreground)]">
                Search {index ? `${index.jobs.length} open roles` : "open roles"}, states,
                specialties and pages.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {["Emergency Medicine", "Texas", "CRNA", "Refer a friend"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQuery(s)}
                    className="rounded-full border border-[var(--border)] px-3.5 py-1.5 text-[13px] font-semibold text-[var(--ocean)] transition-colors hover:bg-[var(--ice)]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="font-semibold text-[var(--deep)]">
                {loading ? "Searching…" : `No matches for “${query.trim()}”`}
              </p>
              {!loading && (
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[var(--muted-foreground)]">
                  Try a specialty, a state, or{" "}
                  <Link to="/jobs" onClick={onClose} className="font-semibold text-[var(--ocean)] hover:underline">
                    browse every open role
                  </Link>
                  .
                </p>
              )}
            </div>
          ) : (
            <ul className="py-2">
              {results.map((r, i) => {
                const header = r.group !== lastGroup ? r.group : null;
                lastGroup = r.group;
                return (
                  <li key={r.key}>
                    {header && (
                      <div className="px-5 pb-1.5 pt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                        {header}
                      </div>
                    )}
                    <Link
                      to={r.to}
                      ref={(el) => {
                        itemRefs.current[i] = el;
                      }}
                      onClick={onClose}
                      onMouseEnter={() => setActive(i)}
                      className={`flex items-center gap-3 px-5 py-2.5 transition-colors ${
                        i === active ? "bg-[var(--ice)]" : ""
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 flex-none items-center justify-center rounded-lg ${
                          i === active
                            ? "gradient-teal text-white"
                            : "bg-[var(--ice)] text-[var(--ocean)]"
                        }`}
                      >
                        {iconFor(r.group, i)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] font-semibold text-[var(--deep)]">
                          {r.title}
                        </span>
                        <span className="block truncate text-[13px] text-[var(--muted-foreground)]">
                          {r.sub}
                        </span>
                      </span>
                      {i === active && (
                        <CornerDownLeft
                          className="h-4 w-4 flex-none text-[var(--muted-foreground)]"
                          aria-hidden
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
