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

export const OPENINGS: Opening[] = [
  {
    slug: "hr-generalist",
    title: "HR Generalist",
    location: "Remote — United States",
    employmentType: "Full-time",
    salaryText: "$70,000 per year, or negotiable depending on experience",
    salary: { value: 70000, unit: "YEAR" },
    summary:
      "Own HR operations across the United States, the Philippines, South Africa and India, working directly with Orchard's leadership.",
    posted: "2026-10-20",
    closes: "2026-12-19",
    applyEmail: "info@orchardcorp.com",
    applySubject: "HR Generalist Application",
    body: [
      {
        kind: "p",
        text: "One HR professional. Four U.S. states. Four countries. Real ownership.",
      },
      {
        kind: "p",
        text: "Orchard Corp is looking for an experienced, proactive HR Generalist to manage our human resources operations across the United States, the Philippines, South Africa, and India.",
      },
      {
        kind: "p",
        text: "Since 2010, Orchard Corp has connected healthcare organizations with physicians and advanced practice providers across more than 100 specialties nationwide. Our team of approximately 30 employees works across multiple locations, and we need an HR professional who can take ownership of day-to-day HR operations, strengthen internal processes, and support consistent, compliant practices across all four countries.",
      },
      {
        kind: "p",
        text: "This is an opportunity to work directly with company leadership and oversee the employee lifecycle, from recruitment and onboarding to payroll coordination, compliance, employee relations, and performance management.",
      },

      { kind: "h2", text: "What You'll Do" },

      { kind: "h3", text: "Recruitment and Onboarding" },
      {
        kind: "ul",
        items: [
          "Coordinate recruitment, interviews, and candidate communications across all four countries.",
          "Prepare offer letters and employment contracts using approved templates.",
          "Collect, verify, and organize new-hire documentation.",
          "Coordinate onboarding, system access, policy acknowledgments, and training plans.",
          "Maintain accurate and confidential employee records.",
        ],
      },

      { kind: "h3", text: "U.S. Payroll and Compliance" },
      {
        kind: "ul",
        items: [
          "Run U.S. multi-state payroll in Gusto, from payroll inputs through review and approval.",
          "Maintain accurate employee work locations and state tax configurations.",
          "Coordinate state payroll tax registrations, filings, and agency notices.",
          "Manage Form I-9 completion, reverification, and E-Verify processes.",
          "Monitor payroll deductions, benefits contributions, paid time off, and final-pay requirements.",
          "Reconcile payroll reports with the accounting team to support accurate and timely payments.",
        ],
      },

      { kind: "h3", text: "International Payroll Coordination" },
      {
        kind: "ul",
        items: [
          "Serve as the main contact for payroll providers and accounting partners in the Philippines, South Africa, and India.",
          "Submit accurate payroll information for new hires, terminations, salary changes, leave, and allowances.",
          "Review payroll registers and resolve discrepancies.",
          "Confirm statutory contributions and filings are on track (for example SSS, PhilHealth and Pag-IBIG in the Philippines; UIF and COIDA in South Africa).",
        ],
      },

      { kind: "h3", text: "Employee Relations and Performance" },
      {
        kind: "ul",
        items: [
          "Respond to employee questions, leave requests, and routine workplace concerns.",
          "Track probation periods and coordinate timely performance reviews.",
          "Support managers with performance documentation and improvement plans.",
          "Coordinate performance review cycles and help implement effective HR tools.",
        ],
      },

      { kind: "h3", text: "HR Policies and Administration" },
      {
        kind: "ul",
        items: [
          "Maintain employee handbooks, HR policies, contracts, and procedures.",
          "Coordinate benefits enrollment and changes with relevant providers.",
          "Manage offboarding, final-pay coordination, document return, and access removal.",
          "Maintain personnel, headcount, compliance, and HR cost records.",
          "Identify process gaps and recommend practical improvements to company leadership.",
        ],
      },

      { kind: "h2", text: "What You Bring" },

      { kind: "h3", text: "Required Qualifications" },
      {
        kind: "ul",
        items: [
          "At least 3 years of HR experience, including experience supporting employees across multiple countries.",
          "Experience as the sole or lead HR professional in a small business.",
          "Hands-on U.S. multi-state payroll experience; Gusto preferred.",
          "Working knowledge of U.S. employment requirements, Form I-9, and E-Verify.",
          "Experience coordinating payroll with international providers.",
          "Strong organizational, recordkeeping, communication, and problem-solving skills.",
          "Ability to manage competing priorities and work independently.",
          "Sound judgment in determining when a matter requires legal review or executive approval.",
        ],
      },

      { kind: "h3", text: "Preferred Qualifications" },
      {
        kind: "ul",
        items: [
          "Familiarity with employment practices in the Philippines, South Africa, or India, especially the Philippines.",
          "SHRM-CP, SHRM-SCP, PHR, or equivalent certification.",
          "Experience in healthcare staffing or another regulated industry.",
          "Familiarity with Salesforce, HRIS platforms, or performance management tools.",
        ],
      },

      { kind: "h2", text: "Your Working Style" },
      {
        kind: "p",
        text: "You take ownership, identify what needs to be done, and follow through without constant supervision. You are organized, discreet, proactive, and comfortable making decisions within established policies while recognizing when an issue requires additional guidance.",
      },
      {
        kind: "p",
        text: "Flexibility for occasional early-morning or evening meetings across U.S., Manila, and South Africa Standard Time (SAST) time zones is required.",
      },

      { kind: "h2", text: "Why Join Orchard Corp?" },
      {
        kind: "ul",
        items: [
          "Meaningful responsibility: Manage HR operations across four countries.",
          "Direct collaboration: Work closely with company leadership.",
          "Established organization: Join a healthcare staffing firm founded in 2010.",
          "Remote flexibility: Work remotely from the United States.",
          "Competitive compensation: Earn $70,000 annually or negotiable DOE.",
        ],
      },

      { kind: "h2", text: "Ready to Apply?" },
      {
        kind: "p",
        text: "If you are an experienced HR professional who enjoys solving problems independently, improving processes, and supporting an international team, we would like to hear from you.",
      },
      {
        kind: "p",
        text: "Please include a short note describing an HR problem you solved independently. Examples involving international employees, payroll, compliance, or cross-border coordination are especially welcome.",
      },
      {
        kind: "p",
        text: "Join Orchard Corp and help build a strong, compliant, and people-focused workplace across borders.",
      },
    ],
  },
];

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
