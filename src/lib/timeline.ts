/**
 * Company timeline — the single source of truth.
 *
 * About, Investors and Leadership all render from this, so a date corrected
 * here is corrected everywhere rather than drifting between pages.
 */
export type Milestone = {
  year: string;
  title: string;
  body: string;
  /** Shown on the condensed views (investors, leadership). */
  headline?: boolean;
};

export type Era = {
  name: string;
  range: string;
  tagline: string;
  entries: Milestone[];
};

export const eras: Era[] = [
  {
    name: "Foundation",
    range: "2010–2018",
    tagline: "Building the model, one health system at a time.",
    entries: [
      {
        year: "2010",
        title: "Founded in Illinois",
        body: "Orchard is founded by Dr. N. Ram Saladi, a practicing hospitalist, and incorporated by Indira Saladi as President. Headquartered in Glencoe, Illinois, the company is built on a clinically governed approach to locum tenens staffing.",
        headline: true,
      },
      {
        year: "2012",
        title: "First major health system partnership",
        body: "Orchard secures its first multi-site locum tenens contract with a major Midwest health system, initiating a long-standing partnership that continues today across Illinois and Wisconsin.",
      },
      {
        year: "2013",
        title: "Second major health system partnership",
        body: "Orchard adds a second major regional health system to its client portfolio, expanding hospital medicine coverage across Illinois.",
      },
      {
        year: "2015",
        title: "Doubled hospital medicine coverage footprint",
        body: "Orchard doubles the number of sites receiving hospital medicine coverage, cementing its position as a trusted hospitalist staffing partner across the Midwest.",
      },
      {
        year: "2017",
        title: "Expansion beyond hospital medicine",
        body: "Orchard broadens its clinical scope beyond hospital medicine, extending locum tenens coverage into additional physician specialties.",
      },
      {
        year: "2018",
        title: "Third major health system partnership",
        body: "Orchard secures a multi-year locum tenens contract with a significant regional health system spanning multiple Midwestern states, extending the firm's reach into new geographies and clinical service lines.",
      },
    ],
  },
  {
    name: "Scale",
    range: "2020–2023",
    tagline: "Expanding capacity, geography, and service model.",
    entries: [
      {
        year: "2020",
        title: "International operations established",
        body: "Orchard opens its first international operational hubs in Asia, expanding the firm's global talent, credentialing, and support capacity.",
        headline: true,
      },
      {
        year: "2021",
        title: "Neuro tele-health coverage launched",
        body: "Orchard expands its service offering to include neuro tele-health coverage, allowing hospitals to fill critical neurology gaps remotely and giving providers new flexible practice models.",
      },
      {
        year: "2022",
        title: "Additional health system partnership",
        body: "Orchard establishes a new partnership with a Midwest regional medical center, further strengthening its hospital network.",
      },
      {
        year: "2023",
        title: "Catholic health system partnership",
        body: "Orchard begins providing locum tenens staffing services to a large Catholic health system, expanding its reach across the Midwest.",
      },
      {
        year: "2023",
        title: "VMS/MSP platform integration",
        body: "Orchard begins participating in vendor management system partnerships, enabling nationwide assignment coverage and expanded reach across new states and specialties.",
        headline: true,
      },
    ],
  },
  {
    name: "National Platform",
    range: "2024–Present",
    tagline: "From regional specialist to national partner.",
    entries: [
      {
        year: "2024",
        title: "Continued international expansion",
        body: "Orchard adds a third international operational hub, extending its global footprint to a fourth country and further scaling its talent and support infrastructure.",
      },
      {
        year: "2024",
        title: "Channel diversification and national scale",
        body: "Orchard signs additional national vendor and health system agreements, bringing its provider network to over 1,000 credentialed clinicians across 18+ specialties.",
        headline: true,
      },
      {
        year: "2025",
        title: "Fifteen-year anniversary",
        body: "Orchard marks fifteen years of continuous operations, sixteen years without a single malpractice lawsuit, and a sustained provider fallout rate under 1%.",
      },
      {
        year: "2025",
        title: "First Chief Executive Officer appointed",
        body: "James Cantrell joins Orchard as its first Chief Executive Officer to lead the company's next phase of national growth, working alongside Indira Saladi (President and Board Director) and Dr. N. Ram Saladi (Chief Medical Officer and Co-Founder).",
        headline: true,
      },
      {
        year: "2026",
        title: "VA Federal Supply Schedule contract awarded",
        body: "Orchard is awarded a VA Federal Supply Schedule contract (Schedule 621I), joining a select group of firms authorized to provide locum tenens services to Veterans Affairs facilities nationwide.",
        headline: true,
      },
      {
        year: "2026",
        title: "Enterprise safety-net health system engagement",
        body: "Orchard submits a comprehensive proposal to serve as a locum tenens staffing partner for a major public safety-net health system, marking its largest enterprise engagement to date.",
      },
    ],
  },
];

/** The condensed set used where a full timeline would overwhelm the page. */
export const headlineMilestones: Milestone[] = eras.flatMap((e) =>
  e.entries.filter((m) => m.headline),
);
