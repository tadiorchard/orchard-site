/**
 * The vocabulary behind the locum tenens landing pages.
 *
 * People do not search "locum tenens jobs" nearly as often as they search
 * "locum tenens jobs in Texas" or "CRNA locum tenens jobs", and the long tail
 * is both higher intent and actually winnable against incumbents who have had
 * fifteen years to accumulate links. Every page these slugs produce is backed
 * by real openings in the feed — none of it is spun copy over an empty list.
 *
 * Pure and dependency-free so the router, the sitemap and the pages themselves
 * all agree on what a slug means.
 */

export const US_STATES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", DC: "Washington DC",
  FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois",
  IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana",
  ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan",
  MN: "Minnesota", MS: "Mississippi", MO: "Missouri", MT: "Montana",
  NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota",
  OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania",
  RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota",
  TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia",
  WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type LandingKind = "state" | "specialty";

export type LandingTarget =
  | { kind: "state"; slug: string; code: string; name: string }
  | { kind: "specialty"; slug: string; name: string };

/** Slug for a state's landing page, e.g. "CA" -> "california". */
export function stateSlug(code: string): string | null {
  const name = US_STATES[code.toUpperCase()];
  return name ? slugify(name) : null;
}

/** Slug for a specialty's landing page, e.g. "Emergency Medicine". */
export function specialtySlug(name: string): string {
  return slugify(name);
}

/**
 * Resolves a URL slug against the specialties actually present in the feed.
 *
 * States are matched first and from a fixed list, so a state page keeps its
 * URL even in a week when nothing is open there — a landing page whose address
 * changes with inventory would lose its ranking every time the board turned
 * over.
 */
export function resolveSlug(slug: string, specialties: string[]): LandingTarget | null {
  const clean = slug.toLowerCase();

  for (const [code, name] of Object.entries(US_STATES)) {
    if (slugify(name) === clean) return { kind: "state", slug: clean, code, name };
  }

  const specialty = specialties.find((s) => specialtySlug(s) === clean);
  if (specialty) return { kind: "specialty", slug: clean, name: specialty };

  return null;
}

export const LANDING_BASE = "/locum-tenens-jobs";

export function landingPath(slug: string): string {
  return `${LANDING_BASE}/${slug}`;
}

/**
 * A page needs enough openings to be worth its own URL. Below this the entry
 * still appears on the hub, but gets no page and no sitemap row — a grid with
 * one card on it is the thin content Google discounts, and a hundred of them
 * drags the whole section down.
 */
export const MIN_JOBS_FOR_PAGE = 3;

/** Title and meta description for a landing page, phrased as people search. */
/*
  Titles carry "physician jobs" as well as "locum tenens".
  
  Those are two different searches. Somebody who already works locums types
  "locum tenens jobs texas"; somebody deciding whether to types "physician jobs
  texas". Leading only with the insider term forfeited the second, larger
  group, and both phrases fit a title without padding it — the roles genuinely
  are locum tenens physician jobs.

  Provider-type pages are the exception: a CRNA is not a physician, and
  claiming otherwise would be wrong rather than merely broad.
*/
const NON_PHYSICIAN = /\b(crna|nurse|np\b|physician assistant|pa-c|app|midwife|therapist|technologist|psychologist)\b/i;

export function landingSeo(target: LandingTarget, count: number) {
  if (target.kind === "state") {
    return {
      title: `Locum Tenens Physician Jobs in ${target.name} — ${count} Open | Orchard`,
      description:
        `${count} locum tenens and permanent physician jobs in ${target.name}, ` +
        `from a physician-founded staffing agency. Browse current assignments and apply direct.`,
      heading: `Locum Tenens Physician Jobs in ${target.name}`,
    };
  }
  const clinician = NON_PHYSICIAN.test(target.name) ? "" : " Physician";
  return {
    title: `${target.name} Locum Tenens${clinician} Jobs — ${count} Open | Orchard`,
    description:
      `${count} open ${target.name} locum tenens and permanent jobs nationwide, ` +
      `from a physician-founded staffing agency. Browse current roles and apply direct.`,
    heading: `${target.name} Locum Tenens${clinician} Jobs`,
  };
}
