import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, MapPin, Stethoscope } from "lucide-react";

import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { JobCard } from "@/components/site/JobCard";
import { getLandingPage } from "@/lib/api/jobs.functions";
import { landingPath, landingSeo, LANDING_BASE } from "@/lib/taxonomy";
import { seo, jsonLd, breadcrumbSchema, absoluteUrl } from "@/lib/seo";

export const Route = createFileRoute("/locum-tenens-jobs/$slug")({
  loader: async ({ params }) => {
    const result = await getLandingPage({ data: { slug: params.slug } });
    // A slug nobody has openings for is not a page — it must 404 rather than
    // render an empty grid, which is the thin content this whole section is
    // built to avoid.
    if (result.status === "not-found") throw notFound();
    return { result };
  },
  head: ({ loaderData, params }) => {
    const result = loaderData?.result;
    const path = landingPath(params.slug);

    if (!result || result.status !== "ok") {
      return seo({
        title: "Locum Tenens Jobs | Orchard",
        description: "Browse current locum tenens openings from Orchard.",
        path,
        robots: "noindex, follow",
      });
    }

    const target =
      result.kind === "state"
        ? ({ kind: "state", slug: params.slug, code: "", name: result.name } as const)
        : ({ kind: "specialty", slug: params.slug, name: result.name } as const);
    const copy = landingSeo(target, result.jobs.length);

    return {
      ...seo({ title: copy.title, description: copy.description, path }),
      scripts: [
        // An ItemList of the roles on the page. The postings themselves carry
        // full JobPosting markup on their own URLs, which is what Google for
        // Jobs indexes; repeating it here would duplicate the same posting.
        jsonLd({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: copy.heading,
          numberOfItems: result.jobs.length,
          itemListElement: result.jobs.slice(0, 25).map((job, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: job.title,
            url: absoluteUrl(`/jobs/${job.id}`),
          })),
        }),
        jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Locum Tenens Jobs", path: LANDING_BASE },
            { name: copy.heading, path },
          ]),
        ),
      ],
    };
  },
  notFoundComponent: () => (
    <main className="flex min-h-screen flex-col">
      <Navbar overlay tone="light" />
      <section className="flex-1 gradient-soft">
        <div className="mx-auto max-w-xl px-5 pt-34 pb-16 text-center sm:px-8 md:pt-42">
          <h1 className="text-2xl font-bold text-[var(--deep)]">Nothing open here yet</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted-foreground)]">
            We have no assignments matching that right now. The full board turns over
            constantly — it is worth a look.
          </p>
          <Link
            to={LANDING_BASE}
            className="cta mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-bold text-white gradient-teal"
          >
            Browse all locum tenens jobs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  ),
  component: LandingPage,
});

function LandingPage() {
  const { result } = Route.useLoaderData();

  if (result.status !== "ok") {
    return (
      <main className="flex min-h-screen flex-col">
        <Navbar overlay tone="light" />
        <section className="flex-1 gradient-soft">
          <div className="mx-auto max-w-xl px-5 pt-34 pb-16 text-center sm:px-8 md:pt-42">
            <h1 className="text-2xl font-bold text-[var(--deep)]">We couldn't load these roles</h1>
            <p className="mt-3 text-[15px] text-[var(--muted-foreground)]">
              That's on us, and it should be brief. The full board is one click away.
            </p>
            <Link
              to="/jobs"
              className="cta mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-bold text-white gradient-teal"
            >
              All open roles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const isState = result.kind === "state";
  const copy = landingSeo(
    isState
      ? ({ kind: "state", slug: "", code: "", name: result.name } as const)
      : ({ kind: "specialty", slug: "", name: result.name } as const),
    result.jobs.length,
  );

  return (
    <main className="min-h-screen">
      <Navbar overlay tone="light" />

      <section className="gradient-soft">
        <div className="mx-auto max-w-6xl px-5 pt-34 pb-14 sm:px-8 md:pt-42 md:pb-16">
          <Reveal>
            <Link
              to={LANDING_BASE}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--ocean)] hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All locum tenens jobs
            </Link>

            <h1 className="mt-4 text-4xl font-bold leading-[1.06] tracking-tight text-[var(--deep)] md:text-5xl">
              {copy.heading}
            </h1>

            {/* Written from the live feed rather than a template, so the page
                says something true and specific about this slice of the board. */}
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--muted-foreground)]">
              Orchard has{" "}
              <strong className="font-semibold text-[var(--deep)]">
                {result.jobs.length} open {result.jobs.length === 1 ? "role" : "roles"}
              </strong>{" "}
              {isState ? `in ${result.name}` : `in ${result.name}`}
              {isState && result.cities.length > 0 && <> — including {result.cities.slice(0, 4).join(", ")}</>}
              {!isState && result.related.length > 0 && (
                <> — across {result.related.length} {result.related.length === 1 ? "state" : "states"}</>
              )}
              . We are physician-founded, so the person you speak to has worked the shift, and you
              apply direct rather than through a middleman.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 md:py-16">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {result.jobs.map((job, i) => (
              <JobCard key={job.id} job={job} delay={(i % 3) * 80} />
            ))}
          </div>

          {result.related.length > 0 && (
            <Reveal className="mt-16 border-t border-[var(--border)] pt-10">
              <h2 className="flex items-center gap-2.5 text-xl font-bold text-[var(--deep)]">
                {isState ? (
                  <Stethoscope className="h-5 w-5 text-[var(--ocean)]" strokeWidth={1.8} />
                ) : (
                  <MapPin className="h-5 w-5 text-[var(--ocean)]" strokeWidth={1.8} />
                )}
                {isState
                  ? `Specialties open in ${result.name}`
                  : `${result.name} roles by state`}
              </h2>
              <ul className="mt-5 flex flex-wrap gap-2.5">
                {result.related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      to={landingPath(item.slug)}
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--deep)] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--teal)] hover:shadow-[var(--shadow-soft)]"
                    >
                      {item.name}
                      <span className="text-[var(--ocean)]">{item.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
