import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Clock } from "lucide-react";

import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { articlesByDate, articlePath, readingMinutes, formatDate } from "@/lib/insights";
import { seo, jsonLd, breadcrumbSchema, absoluteUrl } from "@/lib/seo";

export const Route = createFileRoute("/insights/")({
  head: () => {
    const articles = articlesByDate();
    return {
      ...seo({
        title: "Insights & Resources — Healthcare Staffing | Orchard",
        description:
          "Perspectives on healthcare workforce strategy, locum tenens, and physician recruitment from a physician-founded staffing agency.",
        path: "/insights",
      }),
      scripts: [
        jsonLd({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Insights & Resources",
          url: absoluteUrl("/insights"),
          description:
            "Articles on healthcare workforce strategy, locum tenens, and physician recruitment.",
          // The list tells a crawler what lives here without repeating each
          // article's own Article markup, which belongs on its own URL.
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: articles.length,
            itemListElement: articles.map((a, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: a.title,
              url: absoluteUrl(articlePath(a.slug)),
            })),
          },
        }),
        jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Insights & Resources", path: "/insights" },
          ]),
        ),
      ],
    };
  },
  component: InsightsIndex,
});

function InsightsIndex() {
  const articles = articlesByDate();

  return (
    <main className="min-h-screen">
      <Navbar overlay tone="light" />

      <section className="gradient-soft">
        <div className="mx-auto max-w-6xl px-5 pt-34 pb-14 sm:px-8 md:pt-42 md:pb-16">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ocean)]">
              <BookOpen className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden />
              Insights &amp; Resources
            </span>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.06] tracking-tight text-[var(--deep)] md:text-5xl">
              Perspectives on the healthcare workforce
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--slate)]">
              What we see working — and not working — in physician staffing, written by the people
              arranging the coverage rather than by a marketing desk.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-20">
          <div className="grid gap-8 md:grid-cols-2 lg:gap-10">
            {articles.map((article, i) => (
              <Reveal key={article.slug} delay={(i % 2) * 90}>
                <Link
                  to={articlePath(article.slug)}
                  className="group flex h-full flex-col rounded-2xl border border-[var(--border)] bg-white p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--teal)] hover:shadow-[var(--shadow-soft)] sm:p-8"
                >
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="rounded-full bg-[var(--ice)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--ocean)]">
                      {article.topic}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[13px] text-[var(--slate)]">
                      <Clock className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
                      {readingMinutes(article)} min read
                    </span>
                  </div>

                  <h2 className="mt-4 text-[22px] font-bold leading-snug text-[var(--deep)] transition-colors group-hover:text-[var(--ocean)] md:text-2xl">
                    {article.title}
                  </h2>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[var(--slate)]">
                    {article.summary}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-5">
                    <time
                      dateTime={article.published}
                      className="text-[13px] text-[var(--muted-foreground)]"
                    >
                      {formatDate(article.published)}
                    </time>
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--ocean)]">
                      Read
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal delay={140} className="mt-16 flex flex-wrap items-center justify-center gap-4 border-t border-[var(--border)] pt-12">
            <Link
              to="/client-inquiry"
              className="cta inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-bold text-white gradient-teal shadow-[var(--shadow-soft)]"
            >
              Request coverage
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-7 py-3.5 text-[15px] font-bold text-[var(--deep)] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
            >
              Browse open roles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
