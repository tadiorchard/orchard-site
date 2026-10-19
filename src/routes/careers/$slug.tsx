import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Banknote, Briefcase, CalendarDays, MapPin } from "lucide-react";

import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { findOpening, openingPath, openingDescription, formatOpeningDate } from "@/lib/openings";
import { seo, jsonLd, breadcrumbSchema, careerPostingSchema } from "@/lib/seo";
import heroTeam from "@/assets/hero-team.jpg";

export const Route = createFileRoute("/careers/$slug")({
  // Resolved in the loader so a closed or unknown role 404s rather than
  // rendering an empty shell — the same rule the job and article pages follow.
  loader: ({ params }) => {
    const opening = findOpening(params.slug);
    if (!opening) throw notFound();
    return { opening };
  },
  head: ({ loaderData, params }) => {
    const opening = loaderData?.opening;
    const path = openingPath(params.slug);
    if (!opening) {
      return seo({
        title: "Role not found | Orchard",
        description: "This role is no longer open.",
        path,
        robots: "noindex, follow",
      });
    }
    return {
      ...seo({
        title: `${opening.title} — Careers at Orchard`,
        description: opening.summary,
        path,
      }),
      scripts: [
        jsonLd(
          careerPostingSchema({
            slug: opening.slug,
            title: opening.title,
            description: openingDescription(opening),
            employmentType: opening.employmentType,
            posted: opening.posted,
            closes: opening.closes,
            salary: opening.salary,
          }),
        ),
        jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Careers", path: "/careers" },
            { name: opening.title, path },
          ]),
        ),
      ],
    };
  },
  notFoundComponent: () => (
    <main className="min-h-screen">
      <Navbar overlay tone="light" />
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-bold text-[var(--deep)]">Role not found</h1>
        <p className="mt-3 text-[var(--slate)]">
          This role has closed or never existed. Everything we are hiring for is on the careers
          page.
        </p>
        <Link
          to="/careers"
          className="cta mt-7 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-bold text-white gradient-teal shadow-[var(--shadow-soft)]"
        >
          Careers at Orchard
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <Footer />
    </main>
  ),
  component: OpeningPage,
});

function OpeningPage() {
  const { opening } = Route.useLoaderData();
  const mailto = `mailto:${opening.applyEmail}?subject=${encodeURIComponent(opening.applySubject)}`;

  return (
    <main className="min-h-screen">
      <Navbar overlay />

      {/* The careers hero's photograph and wash, so a role reads as part of
          that page rather than a page of its own that happens to be dark. */}
      <section className="relative overflow-hidden text-white" style={{ background: "#083d68" }}>
        <img
          src={heroTeam}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(8,40,72,0.90) 0%, rgba(10,58,100,0.86) 55%, rgba(12,82,137,0.82) 100%)",
          }}
        />

        <div className="relative mx-auto max-w-3xl px-5 pt-34 pb-14 sm:px-8 md:pt-42 md:pb-16">
          <Reveal>
            <Link
              to="/careers"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/85 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Careers at Orchard
            </Link>

            <h1 className="mt-6 text-3xl font-bold leading-[1.12] tracking-tight text-white text-balance md:text-[42px]">
              {opening.title}
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-white/75 text-pretty">
              {opening.summary}
            </p>

            <dl className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-[14px] text-white/80">
              <div className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-none" strokeWidth={1.8} aria-hidden />
                <dt className="sr-only">Location</dt>
                <dd>{opening.location}</dd>
              </div>
              <div className="inline-flex items-center gap-2">
                <Briefcase className="h-4 w-4 flex-none" strokeWidth={1.8} aria-hidden />
                <dt className="sr-only">Employment type</dt>
                <dd>{opening.employmentType}</dd>
              </div>
              <div className="inline-flex items-center gap-2">
                <Banknote className="h-4 w-4 flex-none" strokeWidth={1.8} aria-hidden />
                <dt className="sr-only">Compensation</dt>
                <dd>{opening.salaryText}</dd>
              </div>
            </dl>

            <a
              href={mailto}
              className="cta mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-bold text-[var(--deep)] shadow-[var(--shadow-soft)]"
            >
              Apply by email
              <ArrowRight className="h-4 w-4" />
            </a>
          </Reveal>
        </div>
      </section>

      <article className="bg-white">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 md:py-16">
          {/* Blocks rather than dangerouslySetInnerHTML: the posting is data, so
              it cannot carry markup we did not intend to render. */}
          <div className="space-y-6">
            {opening.body.map((block, i) => {
              if (block.kind === "h2") {
                return (
                  <h2
                    key={i}
                    className="pt-6 text-[26px] font-bold leading-snug text-[var(--deep)] md:text-[30px]"
                  >
                    {block.text}
                  </h2>
                );
              }
              if (block.kind === "h3") {
                return (
                  <h3 key={i} className="pt-2 text-[19px] font-bold text-[var(--deep)]">
                    {block.text}
                  </h3>
                );
              }
              if (block.kind === "ul") {
                return (
                  <ul
                    key={i}
                    className="ml-5 list-disc space-y-2.5 text-[17px] leading-relaxed text-[var(--slate)]"
                  >
                    {block.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                );
              }
              const lead = i === 0;
              return (
                <p
                  key={i}
                  className={
                    lead
                      ? "text-[19px] leading-[1.7] text-[var(--deep)] md:text-[21px]"
                      : "text-[17px] leading-[1.75] text-[var(--slate)]"
                  }
                >
                  {block.text}
                </p>
              );
            })}
          </div>

          {/* How to apply, kept as its own block rather than a line of body
              copy — it is the one thing a reader has to act on. */}
          <Reveal className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--ice)]/60 p-8 sm:p-10">
            <h2 className="text-xl font-bold text-[var(--deep)] md:text-2xl">
              Apply for this role
            </h2>
            <p className="mt-4 leading-relaxed text-[var(--slate)]">
              Email your CV or resume to{" "}
              <a
                href={mailto}
                className="font-semibold text-[var(--ocean)] underline underline-offset-2"
              >
                {opening.applyEmail}
              </a>{" "}
              with the subject line <strong>{opening.applySubject}</strong>.
            </p>
            <a
              href={mailto}
              className="cta mt-7 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-bold text-white gradient-teal shadow-[var(--shadow-soft)]"
            >
              Email your application
              <ArrowRight className="h-4 w-4" />
            </a>
            <p className="mt-6 inline-flex items-center gap-2 text-[13px] text-[var(--muted-foreground)]">
              <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
              Posted {formatOpeningDate(opening.posted)} · open until{" "}
              {formatOpeningDate(opening.closes)}
            </p>
          </Reveal>
        </div>
      </article>

      <Footer />
    </main>
  );
}
