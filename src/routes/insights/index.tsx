import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Clock } from "lucide-react";

import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { articlesByDate, articlePath, readingMinutes, formatDate } from "@/lib/insights";
import { seo, jsonLd, breadcrumbSchema, absoluteUrl } from "@/lib/seo";
import insightsHero from "@/assets/facility-split.jpeg";

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

function Meta({ topic, minutes, light }: { topic: string; minutes: number; light?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span
        className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] ${
          light ? "bg-white/15 text-white ring-1 ring-white/25" : "bg-[var(--ice)] text-[var(--ocean)]"
        }`}
      >
        {topic}
      </span>
      <span
        className={`inline-flex items-center gap-1.5 text-[13px] ${
          light ? "text-white/75" : "text-[var(--slate)]"
        }`}
      >
        <Clock className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
        {minutes} min read
      </span>
    </div>
  );
}

function InsightsIndex() {
  const articles = articlesByDate();
  const [featured, ...rest] = articles;

  return (
    <main className="min-h-screen">
      <Navbar overlay />

      {/*
        A photographic hero, and deliberately a building rather than people.
        The subject here is how organisations staff themselves, and a facade
        carries that without putting a stock face on an article about hiring.
      */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={insightsHero}
            alt=""
            aria-hidden
            className="ken-burns h-full w-full object-cover"
          />
          {/*
            Deeper on the left, where the words sit, easing right so the
            building still reads as a building. Same structure as the homepage
            hero, and the same reason: an even wash flattens the photograph.
          */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, rgba(8,28,52,0.95) 0%, rgba(10,45,80,0.90) 42%, rgba(12,64,110,0.76) 72%, rgba(12,82,137,0.66) 100%)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 pt-36 pb-20 sm:px-8 md:pt-44 md:pb-24">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
              <BookOpen className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden />
              Insights &amp; Resources
            </span>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.06] tracking-tight text-white md:text-5xl lg:text-[56px]">
              Perspectives on the healthcare workforce
            </h1>
            {/* Plain description of what is here. The previous line promised
                "what we see working and what we see failing", which reads as a
                column of strong opinions — the writing is measured guidance,
                and a subtitle should not set up an article the reader is not
                about to get. */}
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80 text-pretty">
              Practical guidance on workforce planning, locum tenens, and physician recruitment
              from a physician-founded staffing agency.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="gradient-soft">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-20">
          {/* Latest piece, given the room it deserves. With one article this is
              the whole page and reads as intentional; with ten it becomes the
              lead and the rest fall into the grid below. */}
          {featured && (
            <Reveal>
              <Link
                to={articlePath(featured.slug)}
                className="group grid overflow-hidden rounded-3xl border border-[var(--border)] bg-white shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-float)] lg:grid-cols-[1.05fr_1fr]"
              >
                <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[380px]">
                  <img
                    src={featured.image}
                    alt={featured.imageAlt}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <span className="absolute left-5 top-5 rounded-full bg-white/95 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--ocean)] shadow-sm backdrop-blur">
                    Latest
                  </span>
                </div>

                <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
                  <Meta topic={featured.topic} minutes={readingMinutes(featured)} />
                  <h2 className="mt-5 text-[26px] font-bold leading-snug tracking-tight text-[var(--deep)] transition-colors group-hover:text-[var(--ocean)] md:text-[32px]">
                    {featured.title}
                  </h2>
                  <p className="mt-4 text-[16px] leading-relaxed text-[var(--slate)] text-pretty">
                    {featured.summary}
                  </p>
                  <div className="mt-7 flex items-center justify-between border-t border-[var(--border)] pt-6">
                    <time
                      dateTime={featured.published}
                      className="text-[13px] text-[var(--muted-foreground)]"
                    >
                      {formatDate(featured.published)}
                    </time>
                    <span className="inline-flex items-center gap-2 text-[15px] font-bold text-[var(--ocean)]">
                      Read the article
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          )}

          {rest.length > 0 && (
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:mt-14 lg:grid-cols-3">
              {rest.map((article, i) => (
                <Reveal key={article.slug} delay={(i % 3) * 90}>
                  <Link
                    to={articlePath(article.slug)}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-[var(--teal)] hover:shadow-[var(--shadow-soft)]"
                  >
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.imageAlt}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <Meta topic={article.topic} minutes={readingMinutes(article)} />
                      <h3 className="mt-4 text-[19px] font-bold leading-snug text-[var(--deep)] transition-colors group-hover:text-[var(--ocean)]">
                        {article.title}
                      </h3>
                      <p className="mt-2.5 flex-1 text-[15px] leading-relaxed text-[var(--slate)]">
                        {article.summary}
                      </p>
                      <time
                        dateTime={article.published}
                        className="mt-5 block border-t border-[var(--border)] pt-4 text-[13px] text-[var(--muted-foreground)]"
                      >
                        {formatDate(article.published)}
                      </time>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}

          <Reveal delay={140} className="mt-16 rounded-3xl border border-[var(--border)] bg-white p-8 text-center shadow-sm sm:p-12">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--deep)] md:text-3xl">
              Have a staffing need behind the reading?
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-[var(--slate)] text-pretty">
              Tell us what your organization is facing and we will help you work out the options —
              or browse what is open right now.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
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
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
