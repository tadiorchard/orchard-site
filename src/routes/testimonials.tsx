import { createFileRoute, Link } from "@tanstack/react-router";
import { Quote, Stethoscope, Building2, ArrowRight, ArrowUpRight } from "lucide-react";

import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { testimonials, type Testimonial } from "@/lib/testimonials";
import { seo, jsonLd, breadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    ...seo({
      title: "Testimonials — What Providers and Hospitals Say | Orchard",
      description:
        "Firsthand accounts from the physicians Orchard places and the hospitals and credentialing teams we work with.",
      path: "/testimonials",
    }),
    /*
     * Breadcrumbs only. Review markup is deliberately absent: Google does not
     * show rich results for reviews a business publishes about itself, and
     * self-serving review markup is a guideline violation rather than a
     * shortcut. These quotes earn their place by being read, not by being
     * marked up.
     */
    scripts: [
      jsonLd(
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Testimonials", path: "/testimonials" },
        ]),
      ),
    ],
  }),
  component: TestimonialsPage,
});

function Card({ t, delay }: { t: Testimonial; delay: number }) {
  return (
    <Reveal delay={delay} className="flex h-full flex-col">
      <div className="relative flex-1">
        <span
          className="absolute -top-4 left-7 z-10 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-white shadow-[var(--shadow-soft)]"
          style={{ background: t.kind === "Provider" ? "var(--teal)" : "var(--ocean)" }}
        >
          {t.kind === "Provider" ? (
            <Stethoscope className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden />
          ) : (
            <Building2 className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden />
          )}
          <span className="text-[10px] font-bold uppercase tracking-[0.14em]">{t.kind}</span>
        </span>

        <blockquote className="h-full rounded-[1.75rem] bg-white px-8 pb-8 pt-10 text-[15px] leading-relaxed text-[var(--muted-foreground)] shadow-[var(--shadow-soft)] md:text-base">
          {t.quote}
        </blockquote>
      </div>

      <figcaption className="mt-7 flex items-center gap-4 px-2">
        {t.image ? (
          <img
            src={t.image}
            alt={t.name}
            width={112}
            height={112}
            loading="lazy"
            className="h-14 w-14 flex-none rounded-full bg-white object-cover shadow-[var(--shadow-soft)] ring-2 ring-white"
          />
        ) : (
          <span className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-[var(--ice)] shadow-[var(--shadow-soft)] ring-2 ring-white">
            <Stethoscope className="h-6 w-6 text-[var(--ocean)]" strokeWidth={1.6} aria-hidden />
          </span>
        )}
        <span className="min-w-0">
          <span className="block text-[17px] font-bold leading-tight text-[var(--ocean)]">
            {t.name}
          </span>
          {t.title && (
            <span className="mt-0.5 block text-sm text-[var(--muted-foreground)]">{t.title}</span>
          )}
        </span>
      </figcaption>
    </Reveal>
  );
}

function TestimonialsPage() {
  const providers = testimonials.filter((t) => t.kind === "Provider");
  const clients = testimonials.filter((t) => t.kind === "Client");

  return (
    <main className="min-h-screen">
      <Navbar overlay tone="light" />

      <section className="gradient-soft">
        <div className="mx-auto max-w-6xl px-5 pt-34 pb-14 sm:px-8 md:pt-42 md:pb-16">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ocean)]">
              <Quote className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
              Testimonials
            </span>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.06] tracking-tight text-[var(--deep)] md:text-5xl">
              What providers and hospitals say
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--muted-foreground)]">
              Firsthand accounts from the physicians we place and the hospitals and credentialing
              teams we work alongside — {providers.length} from providers, {clients.length} from
              clients.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-20">
          <div className="grid items-stretch gap-10 md:grid-cols-2 md:gap-12">
            {testimonials.map((t, i) => (
              <Card key={`${t.name}-${i}`} t={t} delay={(i % 2) * 90} />
            ))}
          </div>

          {/* Reviews we do not control carry more weight than the ones we
              choose to publish, so we point at them rather than hide them. */}
          <Reveal delay={120} className="mt-16 rounded-2xl border border-[var(--border)] bg-[var(--ice)] p-8 text-center sm:p-10">
            <h2 className="text-xl font-bold text-[var(--deep)] md:text-2xl">
              Looking for more?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--muted-foreground)]">
              Orchard is listed on Locumpedia, the locum tenens industry's independent directory,
              where you can read further reviews and agency detail we do not control.
            </p>
            <a
              href="https://www.locumpedia.com/agencies/orchardcorp/"
              target="_blank"
              rel="noopener noreferrer"
              className="cta mt-7 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-bold text-white gradient-teal shadow-[var(--shadow-soft)]"
            >
              More reviews on Locumpedia
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </Reveal>

          <Reveal delay={160} className="mt-14 flex flex-wrap items-center justify-center gap-4 border-t border-[var(--border)] pt-12">
            <Link
              to="/jobs"
              className="cta inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-bold text-white gradient-teal shadow-[var(--shadow-soft)]"
            >
              Browse open roles
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/client-inquiry"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-7 py-3.5 text-[15px] font-bold text-[var(--deep)] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
            >
              Request coverage
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
