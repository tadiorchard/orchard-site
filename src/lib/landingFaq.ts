/**
 * The questions each landing page answers, built from that page's own data.
 *
 * These pages were thin: a heading, a grid of cards, a row of links. Wyoming
 * came to about 300 words, most of it shared with the other fifty-five — which
 * is the shape Google treats as a doorway page rather than a destination, and
 * it caps how any of them can rank.
 *
 * Every answer here is computed from the live feed, so no two pages say the
 * same thing and nothing is padding. The same function feeds the FAQPage
 * markup and the visible copy, because the two are required to match: marked-up
 * questions a page does not visibly answer are a structured-data violation.
 */
type LandingJob = {
  specialty: string | null;
  city: string | null;
  jobClass: string | null;
};

export type Faq = { q: string; a: string };

function list(items: string[], max = 6): string {
  const shown = items.slice(0, max);
  if (shown.length === 0) return "";
  if (shown.length === 1) return shown[0];
  const rest = items.length > max ? `, and ${items.length - max} more` : "";
  return `${shown.slice(0, -1).join(", ")} and ${shown[shown.length - 1]}${rest}`;
}

function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}

export function landingFaqs(input: {
  kind: "state" | "specialty";
  name: string;
  jobs: LandingJob[];
  cities: string[];
  related: Array<{ name: string; count: number }>;
}): Faq[] {
  const { kind, name, jobs, cities, related } = input;
  const count = jobs.length;
  if (count === 0) return [];

  const specialties = [...new Set(jobs.map((j) => j.specialty).filter(Boolean) as string[])];
  const permanent = jobs.filter((j) => j.jobClass && /perm/i.test(j.jobClass)).length;
  const temporary = count - permanent;

  // "Locum, permanent, or both" is answered from the actual mix rather than
  // asserted, so a page cannot promise permanent roles it does not have.
  // A state page stays reachable below the three-job threshold that gets it
  // linked, so "All 1 are locum tenens assignments" is a sentence this can
  // actually produce. The single case is worded separately.
  const only = count === 1;
  const mix =
    permanent === 0
      ? only
        ? "The one open role is a locum tenens assignment."
        : `All ${count} are locum tenens assignments.`
      : temporary === 0
        ? only
          ? "The one open role is a permanent placement."
          : `All ${count} are permanent placements.`
        : `${plural(temporary, "is a locum tenens assignment", "are locum tenens assignments")} and ${plural(permanent, "is a permanent placement", "are permanent placements")}.`;

  const faqs: Faq[] = [];

  if (kind === "state") {
    faqs.push({
      q: `How many locum tenens jobs are open in ${name} right now?`,
      a:
        `Orchard has ${plural(count, "open assignment")} in ${name}` +
        (specialties.length ? `, across ${plural(specialties.length, "specialty", "specialties")}` : "") +
        `. The page is built from our live system, so it changes as roles open and fill.`,
    });
    if (cities.length) {
      faqs.push({
        q: `Which cities in ${name} have openings?`,
        a: `Current ${name} assignments are in ${list(cities)}. Locations change as new roles come in.`,
      });
    }
    if (specialties.length) {
      faqs.push({
        q: `Which specialties are hiring in ${name}?`,
        a: `${list(specialties)} — all currently open in ${name}.`,
      });
    }
  } else {
    faqs.push({
      q: `How many ${name} locum tenens jobs are open right now?`,
      a:
        `Orchard has ${plural(count, "open " + name + " assignment")}` +
        (related.length ? ` across ${plural(related.length, "state")}` : "") +
        `. The page is built from our live system, so it changes as roles open and fill.`,
    });
    if (related.length) {
      faqs.push({
        q: `Which states have ${name} openings?`,
        a: `${list(related.map((r) => `${r.name} (${r.count})`))} currently have ${name} roles open.`,
      });
    }
  }

  faqs.push({
    q:
      kind === "state"
        ? `Are ${name} roles locum tenens or permanent?`
        : `Are ${name} roles locum tenens or permanent?`,
    a: `${mix} Many locum assignments are open to becoming permanent, and each listing states which it is.`,
  });

  faqs.push({
    q:
      kind === "state"
        ? `Does Orchard handle ${name} licensing and credentialing?`
        : `Does Orchard handle licensing and credentialing?`,
    a:
      `Yes. Orchard handles sourcing, credentialing and logistics end to end — including state ` +
      `licensing, housing and travel — so you can focus on patient care rather than paperwork.`,
  });

  faqs.push({
    q: "Do I apply through a middleman?",
    a:
      "No. Orchard is physician-founded and clinically governed, so the people arranging your " +
      "assignment have worked the shift themselves, and you apply direct. We never present a " +
      "provider to a facility without their explicit approval first.",
  });

  return faqs;
}
