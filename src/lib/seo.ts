/**
 * One place that knows the site's public origin, and the helpers that build
 * head tags from it.
 *
 * Absolute URLs are the point. A relative canonical (`href="/about"`) resolves
 * against whichever host served the page, so it deduplicates nothing when the
 * same content answers on more than one hostname — which is exactly this
 * site's situation while it lives on a deploy URL and orchardcorp.com serves
 * the previous site. Canonical, og:url and the sitemap all have to name the
 * same absolute origin, so they all read it from here.
 *
 * Set VITE_SITE_URL at build time to move the whole site to its real domain.
 */
export const SITE_URL = (
  import.meta.env?.VITE_SITE_URL ?? "https://orchard-site-xi.vercel.app"
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

/** A JSON-LD block for a route's `head.scripts`. */
export function jsonLd(data: Record<string, unknown>) {
  return {
    attrs: { type: "application/ld+json" },
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
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Orchard Corp",
    alternateName: "Orchard",
    url: `${SITE_URL}/`,
    logo: absoluteUrl("/favicon-192.png"),
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    description:
      "Orchard is a physician-led locum tenens staffing agency connecting hospitals with board-certified providers nationwide.",
    telephone: PHONE,
    email: EMAIL,
    foundingDate: "2010",
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
 * `validThrough` is deliberately not guessed. Google drops a posting once that
 * date passes, so inventing one would silently expire live roles; the sitemap
 * and the feed's own status filter are what retire a closed job here.
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

  const years = Number(job.minimumYearsExperience);
  if (Number.isFinite(years) && years > 0) {
    schema.experienceRequirements = {
      "@type": "OccupationalExperienceRequirements",
      monthsOfExperience: Math.round(years * 12),
    };
  }

  return schema;
}
