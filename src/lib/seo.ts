/**
 * One place that knows the site's public origin, and the helpers that build
 * head tags from it.
 *
 * Absolute URLs are the point. A relative canonical (`href="/about"`) resolves
 * against whichever host served the page, so it deduplicates nothing when the
 * same content answers on more than one hostname — and this site answers on
 * three: the apex, www, and the Vercel deploy URL. Naming one absolute origin
 * here is what points all of them at a single indexable copy, including the
 * pages Vercel still serves on the deploy URL.
 *
 * www, not the apex: orchardcorp.com issues a 308 to www.orchardcorp.com, so
 * www is where a visitor actually lands and what a canonical must name.
 *
 * VITE_SITE_URL overrides it if the origin ever changes again.
 */
export const SITE_URL = (
  import.meta.env?.VITE_SITE_URL ?? "https://www.orchardcorp.com"
).replace(/\/+$/, "");

/** Site-relative path to absolute URL. Passes through anything already absolute. */
export function absoluteUrl(path: string = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  const clean = "/" + path.replace(/^\/+/, "").replace(/\/+$/, "");
  return clean === "/" ? `${SITE_URL}/` : `${SITE_URL}${clean}`;
}

/** The shared social card, used wherever a page has no image of its own. */
export const DEFAULT_OG_IMAGE = "/og-image.jpg";

type SeoInput = {
  title: string;
  description: string;
  /** Site-relative path — drives both canonical and og:url. */
  path: string;
  /** Site-relative or absolute. Falls back to the shared card. */
  image?: string;
  /** e.g. "noindex, follow" for thin or utility pages. Omit to allow indexing. */
  robots?: string;
  type?: "website" | "article";
};

/**
 * Builds the full head block for a page: title, description, canonical, and
 * the Open Graph and Twitter tags that mirror them. Going through one helper
 * is what keeps a page from shipping og:title without og:url, or a canonical
 * that disagrees with the URL it is on.
 */
export function seo({ title, description, path, image, robots, type = "website" }: SeoInput) {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image ?? DEFAULT_OG_IMAGE);

  return {
    meta: [
      { title },
      { name: "description", content: description },
      ...(robots ? [{ name: "robots", content: robots }] : []),
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:type", content: type },
      { property: "og:image", content: imageUrl },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: imageUrl },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

/**
 * A JSON-LD block for a route's `head.scripts`.
 *
 * Attributes go flat on the object — the nested `{ attrs: {...} }` form is the
 * router's internal tag shape and renders here as a literal attrs="[object
 * Object]" with no content.
 */
export function jsonLd(data: Record<string, unknown>) {
  return {
    type: "application/ld+json",
    // Escaping "<" keeps a stray "</script>" inside CRM copy from closing the tag.
    children: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}

export const ORG_ID = `${SITE_URL}/#organization`;
export const PHONE = "+1-847-861-5300";
export const EMAIL = "info@orchardcorp.com";

/**
 * The company itself. Referenced by @id from other blocks (JobPosting's
 * hiringOrganization, for one) so search engines resolve one entity rather
 * than a fresh copy per page.
 *
 * Typed EmploymentAgency rather than Organization. It is a LocalBusiness
 * subtype, which is what "healthcare staffing agencies in Illinois" is a query
 * for — a generic Organization tells a search engine that a company exists,
 * not what kind of company or where it operates. The @id is unchanged, so
 * every JobPosting that points hiringOrganization at it still resolves.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EmploymentAgency",
    "@id": ORG_ID,
    name: "Orchard Corp",
    alternateName: "Orchard",
    url: `${SITE_URL}/`,
    logo: absoluteUrl("/favicon-192.png"),
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    description:
      "Orchard is a physician-founded healthcare staffing agency placing locum tenens and permanent clinicians with hospitals and health systems nationwide.",
    telephone: PHONE,
    email: EMAIL,
    foundingDate: "2010",
    // A staffing agency's service area is the thing a local query turns on,
    // and ours is national rather than the county around the office.
    areaServed: { "@type": "Country", name: "United States" },
    knowsAbout: [
      "Locum tenens staffing",
      "Permanent physician placement",
      "Healthcare staffing",
      "Physician recruitment",
      "Provider credentialing",
      "Medical licensing",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Glencoe",
      addressRegion: "IL",
      addressCountry: "US",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: PHONE,
        email: EMAIL,
        contactType: "customer service",
        areaServed: "US",
        availableLanguage: "English",
      },
    ],
    sameAs: [
      "https://linkedin.com/company/orchard-inc-",
      "https://www.facebook.com/OrchardHealthcareStaffing",
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: "Orchard Corp",
    publisher: { "@id": ORG_ID },
  };
}

/**
 * FAQPage markup. Google can expand a result into the questions themselves,
 * which is the only way a single listing takes more than one row of a SERP.
 *
 * Every answer here has to be true and answerable from the page itself —
 * marked-up questions that the visible page does not answer are a
 * structured-data violation, not a shortcut.
 */
export function faqSchema(items: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

/** Breadcrumbs for a nested page, e.g. Home › Open Jobs › <role>. */
export function breadcrumbSchema(trail: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/**
 * Google for Jobs eligibility for a single assignment.
 *
 * `title`, `description`, `datePosted` and `hiringOrganization` are the fields
 * Google requires; the rest sharpen the listing. Anything the CRM left blank is
 * dropped rather than emitted empty — a JobPosting with a null field is worse
 * than one without it, since Google validates what is present.
 *
 * `validThrough` is never guessed, but it is used when the CRM actually knows
 * one. Google drops a posting the moment that date passes, so a made-up value
 * would silently expire live roles — while a real end date makes the listing
 * more complete, and Google favours complete listings. A date already in the
 * past is ignored rather than emitted, so a stale record cannot pull a live
 * assignment out of the index.
 *
 * `baseSalary` is absent because the feed carries no rate field. Google ranks
 * listings with pay higher, so this is worth fixing — but at source, not by
 * inventing numbers here.
 */
export function jobPostingSchema(job: {
  id: string;
  title: string;
  description: string | null;
  city: string | null;
  state: string | null;
  specialty: string | null;
  providerType: string | null;
  jobClass: string | null;
  postedAt: string | null;
  startDate: string | null;
  endDate?: string | null;
  reference?: string | null;
  minimumYearsExperience?: string | null;
}) {
  const employmentType =
    job.jobClass && /perm/i.test(job.jobClass) ? "FULL_TIME" : "CONTRACTOR";

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description?.trim() || `Locum tenens ${job.specialty ?? "assignment"} with Orchard.`,
    datePosted: job.postedAt ?? undefined,
    employmentType,
    hiringOrganization: { "@id": ORG_ID },
    directApply: true,
    url: absoluteUrl(`/jobs/${job.id}`),
  };

  if (job.reference) schema.identifier = {
    "@type": "PropertyValue",
    name: "Orchard Corp",
    value: job.reference,
  };

  // Remote-friendly wording aside, these roles are on site at a facility, so a
  // place is always the honest answer when we know one.
  if (job.city || job.state) {
    schema.jobLocation = {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        ...(job.city ? { addressLocality: job.city } : {}),
        ...(job.state ? { addressRegion: job.state } : {}),
        addressCountry: "US",
      },
    };
  }

  if (job.specialty) schema.occupationalCategory = job.specialty;
  if (job.providerType) schema.qualifications = job.providerType;
  if (job.startDate) schema.jobStartDate = job.startDate;

  // Only a date still ahead of us. An assignment that already ended is not an
  // expiry Google should act on — it is a record nobody closed.
  if (job.endDate) {
    const ends = new Date(job.endDate);
    if (!Number.isNaN(ends.getTime()) && ends.getTime() > Date.now()) {
      schema.validThrough = job.endDate;
    }
  }

  const years = Number(job.minimumYearsExperience);
  if (Number.isFinite(years) && years > 0) {
    schema.experienceRequirements = {
      "@type": "OccupationalExperienceRequirements",
      monthsOfExperience: Math.round(years * 12),
    };
  }

  return schema;
}
