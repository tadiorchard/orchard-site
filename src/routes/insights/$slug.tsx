import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";

import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import {
  findArticle,
  articlePath,
  articlesByDate,
  readingMinutes,
  wordCount,
  formatDate,
} from "@/lib/insights";
import { seo, jsonLd, breadcrumbSchema, articleSchema } from "@/lib/seo";

export const Route = createFileRoute("/insights/$slug")({
  // Resolved in the loader so an unknown slug 404s rather than rendering an
  // empty shell — the same rule the job and landing pages follow.
  loader: ({ params }) => {
    const article = findArticle(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData, params }) => {
    const article = loaderData?.article;
    const path = articlePath(params.slug);
    if (!article) {
      return seo({
        title: "Article not found | Orchard",
        description: "This article is no longer listed.",
        path,
        robots: "noindex, follow",
      });
    }
    return {
      ...seo({
        title: `${article.title} | Orchard`,
        description: article.summary,
        path,
        type: "article",
        // Shared links show the article's own hero rather than the site card.
        image: article.image,
      }),
      scripts: [
        jsonLd(
          articleSchema({
            title: article.title,
            description: article.summary,
            path,
            published: article.published,
            wordCount: wordCount(article),
            image: article.image,
          }),
        ),
        jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Insights & Resources", path: "/insights" },
            { name: article.title, path },
          ]),
        ),
      ],
    };
  },
  notFoundComponent: () => (
    <main className="min-h-screen">
      <Navbar overlay tone="light" />
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-bold text-[var(--deep)]">Article not found</h1>
        <p className="mt-3 text-[var(--slate)]">
          This piece is no longer listed. Everything we have published is on the insights page.
        </p>
        <Link
          to="/insights"
          className="cta mt-7 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-bold text-white gradient-teal shadow-[var(--shadow-soft)]"
        >
          Insights &amp; Resources
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <Footer />
    </main>
  ),
  component: ArticlePage,
});

function ArticlePage() {
  const { article } = Route.useLoaderData();
  const more = articlesByDate().filter((a) => a.slug !== article.slug).slice(0, 2);

  const bodyRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  /*
    Progress is measured against the article body, not the document. Measuring
    the whole page would have the bar finish somewhere inside the footer, which
    tells the reader they have further to go than they do.
  */
  useEffect(() => {
    const onScroll = () => {
      const el = bodyRef.current;
      if (!el) return;
      const start = el.offsetTop;
      const distance = el.offsetHeight - window.innerHeight;
      if (distance <= 0) {
        setProgress(1);
        return;
      }
      const seen = (window.scrollY - start) / distance;
      setProgress(Math.min(1, Math.max(0, seen)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [article.slug]);

  return (
    <main className="min-h-screen">
      {/* No tone="light" here: this page's hero became a photograph, and the
          bar has to invert to white over it. The not-found screen above keeps
          the light tone because it is still a plain light page. */}
      <Navbar overlay />

      {/* How far through the piece you are. On an 1,100-word article the
          scrollbar alone is a poor answer, and this costs one listener. */}
      <div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[55] h-[3px] origin-left bg-[var(--teal)] transition-transform duration-100"
        style={{ transform: `scaleX(${progress})` }}
      />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={article.image} alt="" aria-hidden className="h-full w-full object-cover" />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(8,28,52,0.86) 0%, rgba(9,40,68,0.80) 45%, rgba(10,50,86,0.88) 100%)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-3xl px-5 pt-34 pb-14 sm:px-8 md:pt-42 md:pb-16">
          <Reveal>
            <Link
              to="/insights"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/85 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Insights &amp; Resources
            </Link>

            <h1 className="mt-6 text-3xl font-bold leading-[1.12] tracking-tight text-white text-balance md:text-[42px]">
              {article.title}
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-white/75 text-pretty">
              {article.summary}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] text-white/75">
              <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur">
                {article.topic}
              </span>
              <time dateTime={article.published}>{formatDate(article.published)}</time>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
                {readingMinutes(article)} min read
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <article className="bg-white">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 md:py-16">
          {/* Blocks rather than dangerouslySetInnerHTML: the copy is data, so
              it cannot carry markup we did not intend to render. */}
          <div ref={bodyRef} className="space-y-6">
            {article.body.map((block, i) => {
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
              if (block.kind === "ul") {
                return (
                  <ul key={i} className="ml-5 list-disc space-y-2.5 text-[17px] leading-relaxed text-[var(--slate)]">
                    {block.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                );
              }
              // The opening paragraph is set larger, the way a standfirst is —
              // it carries the reader from the headline into the body.
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

          {/* The article's own close, kept as a component rather than a link
              buried in the last paragraph. */}
          <Reveal className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--ice)]/60 p-8 sm:p-10">
            <h2 className="text-xl font-bold text-[var(--deep)] md:text-2xl">
              Partner with Orchard for your healthcare staffing needs
            </h2>
            <p className="mt-4 leading-relaxed text-[var(--slate)]">
              Staffing challenges do not always have a simple solution. Every organization has
              different requirements, specialties, timelines, and workforce goals — whether you are
              facing a physician vacancy, preparing for an upcoming leave, navigating a difficult
              recruitment process, or exploring locum tenens coverage.
            </p>
            <p className="mt-4 leading-relaxed text-[var(--slate)]">
              Tell us what your organization needs, and our team can help you explore staffing
              solutions that fit your goals.
            </p>
            <Link
              to="/inquiry"
              className="cta mt-7 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-bold text-white gradient-teal shadow-[var(--shadow-soft)]"
            >
              Talk to Orchard about your staffing needs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>

          {more.length > 0 && (
            <Reveal delay={120} className="mt-14 border-t border-[var(--border)] pt-10">
              <h2 className="text-lg font-bold text-[var(--deep)]">More from Orchard</h2>
              <ul className="mt-5 space-y-3">
                {more.map((a) => (
                  <li key={a.slug}>
                    <Link
                      to={articlePath(a.slug)}
                      className="group flex items-start justify-between gap-4 rounded-xl border border-[var(--border)] bg-white px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-[var(--teal)] hover:shadow-[var(--shadow-soft)]"
                    >
                      <span className="font-semibold text-[var(--deep)] group-hover:text-[var(--ocean)]">
                        {a.title}
                      </span>
                      <ArrowRight className="mt-1 h-4 w-4 flex-none text-[var(--ocean)]" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </article>

      <Footer />
    </main>
  );
}
