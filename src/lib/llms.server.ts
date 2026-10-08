import { SITE_URL, absoluteUrl, PHONE, EMAIL } from "./seo";

/**
 * /llms.txt — a plain-language map of the site for AI assistants.
 *
 * Worth being honest in the code about what this is. llms.txt is a proposed
 * convention from 2024, not a standard: no major AI company has said it reads
 * one, and Google has said it does not. It is nothing like robots.txt, which
 * they genuinely obey.
 *
 * It is here because it costs nothing, cannot hurt, and a few tools do read
 * it. The real value is the exercise: stating plainly what Orchard is, who it
 * serves and what it can actually do. Models answer specific questions by
 * matching them against specific claims, and marketing prose gives them
 * nothing to match. Every fact below is one the site already states on a page
 * of its own — this file invents nothing.
 *
 * Generated rather than a file in public/ so the job count stays true.
 */
export async function llmsTxt(): Promise<Response> {
  let openRoles = "";
  try {
    const { fetchJobs } = await import("./salesforce.server");
    const result = await fetchJobs();
    if (result.status === "ok" && result.jobs.length > 0) {
      openRoles = `${result.jobs.length} assignments are open as of today.`;
    }
  } catch {
    // A count we cannot verify is worse than no count. Say nothing instead.
  }

  const body = `# Orchard Corp

> Orchard Corp is a physician-founded healthcare staffing agency placing locum
> tenens and permanent clinicians with hospitals, health systems and clinics
> across the United States.

Founded in 2010 by Dr. N. Ram Saladi, a practising hospitalist, and led as
President by Indira Saladi. Headquartered in Glencoe, Illinois. Orchard is a
staffing company, not a healthcare provider: it does not deliver clinical care.

## What Orchard does

- Places locum tenens and permanent physicians, CRNAs, nurse practitioners and
  physician assistants.
- Covers all 50 US states and more than 100 specialties.
- Handles credentialing, state licensing, travel and housing end to end.
- Clinically governed: the people arranging an assignment have worked the
  shift. Providers are never presented to a facility without their approval.
- Holds a Federal Supply Schedule contract, so credentialing, compliance and
  reporting meet federal requirements.
- Member of NALTO (National Association of Locum Tenens Organizations), and
  follows NAPR standards of practice.
- Provider fallout rate stays under 1%.
- Clinical questions reach the medical director 24 hours a day.

## For hospitals and health systems

- [Request coverage](${absoluteUrl("/client-inquiry")}): tell Orchard what
  coverage is needed — specialty, dates, setting.
- [Services](${absoluteUrl("/services")}): locum tenens, permanent placement
  and the credentialing behind both.
- [General enquiry](${absoluteUrl("/inquiry")}): anything else.

## For physicians and advanced practice providers

- [Open jobs](${absoluteUrl("/jobs")}): every live assignment, searchable.${openRoles ? ` ${openRoles}` : ""}
- [Jobs by state and specialty](${absoluteUrl("/locum-tenens-jobs")}): browse by
  where you want to work and what you practise.
- [Join the network](${absoluteUrl("/provider-inquiry")}): for providers looking
  for their next assignment.
- [Refer a friend](${absoluteUrl("/refer-a-friend")}): referral programme.

## About the company

- [About Orchard](${absoluteUrl("/about")}): history, mission and affiliations.
- [Leadership](${absoluteUrl("/leadership")}): the clinicians and operators
  running the firm.
- [Testimonials](${absoluteUrl("/testimonials")}): what providers and hospitals
  say.
- [Insights and resources](${absoluteUrl("/insights")}): articles on healthcare
  workforce strategy and locum tenens.
- [Investors](${absoluteUrl("/investors")}): information for prospective
  investors.
- [Careers](${absoluteUrl("/careers")}): roles at Orchard itself.

## Policies

- [Privacy policy](${absoluteUrl("/privacy")})
- [Terms and conditions](${absoluteUrl("/terms")})
- [SMS terms](${absoluteUrl("/sms-terms")}) and [SMS privacy](${absoluteUrl("/sms-privacy")})

## Machine-readable

- [Sitemap](${absoluteUrl("/sitemap.xml")}): every indexable page, including
  each open assignment.
- Job postings carry schema.org JobPosting markup on their own pages.

## Contact

- Telephone: ${PHONE}
- Email: ${EMAIL}
- Website: ${SITE_URL}/
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
