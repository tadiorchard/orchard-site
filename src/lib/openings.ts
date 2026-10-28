/**
 * Orchard's own openings — the jobs we are hiring for, not the ones we staff.
 *
 * Deliberately separate from the Salesforce job board. That board is clinical:
 * every record carries a specialty, a provider type and a licence, it feeds the
 * state and specialty landing pages, and it syndicates to an external
 * healthcare job feed. An HR hire has none of those properties and belongs in
 * none of those places, so it lives here instead, next to the careers page that
 * already speaks to people who want to work at Orchard rather than through it.
 *
 * To post another role, add an entry. The careers page, its own page, the
 * sitemap and the JobPosting markup all follow from it.
 */
export type OpeningBlock =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "ul"; items: string[] };

export type Opening = {
  slug: string;
  title: string;
  /** Shown under the title, e.g. "Remote — United States". */
  location: string;
  /** Plain-language terms, e.g. "Full-time". */
  employmentType: string;
  /** What a reader sees, e.g. "$70,000 per year, or negotiable DOE". */
  salaryText: string;
  /** The same figure for search engines. Omit when a role has no public number. */
  salary?: { value: number; unit: "YEAR" | "HOUR" };
  /** Shown on the card and used as the meta description. Keep under 155. */
  summary: string;
  /** ISO date. Drives the visible date and datePosted. */
  posted: string;
  /**
   * ISO date the posting comes down. A filled role left up is the thing Google
   * penalises and the thing candidates resent, so closing is automatic rather
   * than something somebody has to remember.
   */
  closes: string;
  applyEmail: string;
  /** Subject line the posting asks for, so applications arrive sorted. */
  applySubject: string;
  body: OpeningBlock[];
};

export const OPENINGS: Opening[] = [];

export function openingPath(slug: string): string {
  return `/careers/${slug}`;
}

/**
 * Postings still open today, newest first.
 *
 * Compared as date strings in UTC: the close date is a day, not a moment, and
 * parsing it into local time would take a posting down an evening early for
 * anyone west of us.
 */
export function openOpenings(today: string = new Date().toISOString().slice(0, 10)): Opening[] {
  return OPENINGS.filter((o) => o.closes >= today).sort((a, b) => b.posted.localeCompare(a.posted));
}

/** An opening by slug, only while it is still open. */
export function findOpening(slug: string): Opening | undefined {
  return openOpenings().find((o) => o.slug === slug);
}

export function formatOpeningDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** The posting as plain text, for the JobPosting description Google reads. */
export function openingDescription(opening: Opening): string {
  return opening.body
    .map((block) =>
      block.kind === "ul" ? block.items.map((i) => `• ${i}`).join("\n") : block.text,
    )
    .join("\n\n");
}
