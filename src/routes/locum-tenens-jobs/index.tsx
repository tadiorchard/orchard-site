import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Stethoscope, ArrowRight, Briefcase } from "lucide-react";

import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { getTaxonomy } from "@/lib/api/jobs.functions";
import { landingPath, MIN_JOBS_FOR_PAGE } from "@/lib/taxonomy";
import { seo, jsonLd, breadcrumbSchema, ORG_ID, absoluteUrl } from "@/lib/seo";

export const Route = createFileRoute("/locum-tenens-jobs/")({
  loader: async () => ({ taxonomy: await getTaxonomy() }),
  head: ({ loaderData }) => {
    const total = loaderData?.taxonomy.total ?? 0;
    const states = loaderData?.taxonomy.states.length ?? 0;
    return {
      ...seo({
        title: "Locum Tenens Jobs — Browse by State & Specialty | Orchard",
        description:
          `${total} locum tenens and permanent physician jobs across ${states} states and ` +
          `54 specialties, from a physician-founded staffing agency. Apply direct, no middleman.`,
        path: "/locum-tenens-jobs",
      }),
      scripts: [
        jsonLd({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Locum Tenens Jobs",
          url: absoluteUrl("/locum-tenens-jobs"),
          about: { "@id": ORG_ID },
          description: `Locum tenens and permanent physician assignments across ${states} states.`,
        }),
        jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Locum Tenens Jobs", path: "/locum-tenens-jobs" },
          ]),
        ),
      ],
    };
  },
  component: HubPage,
});

function Group({
  title,
  icon: Icon,
  items,
  empty,
}: {
  title: string;
  icon: typeof MapPin;
  items: Array<{ name: string; slug: string; count: number }>;
  empty: string;
}) {
  const linked = items.filter((i) => i.count >= MIN_JOBS_FOR_PAGE);
  const rest = items.filter((i) => i.count < MIN_JOBS_FOR_PAGE);

  return (
    <div>
      <h2 className="flex items-center gap-2.5 text-2xl font-bold text-[var(--deep)]">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl gradient-teal text-white">
          <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
        </span>
        {title}
      </h2>

      {linked.length === 0 ? (
        <p className="mt-4 text-[var(--muted-foreground)]">{empty}</p>
      ) : (
        <ul className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {linked.map((item) => (
            <li key={item.slug}>
              <Link
                to={landingPath(item.slug)}
                className="group flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[15px] font-semibold text-[var(--deep)] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--teal)] hover:shadow-[var(--shadow-soft)]"
              >
                <span className="min-w-0 truncate">{item.name}</span>
                <span className="flex flex-none items-center gap-1.5 text-sm font-bold text-[var(--ocean)]">
                  {item.count}
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Below the threshold these get no page of their own — one card is thin
          content — but they are still real openings, so they stay visible and
          send the visitor to the filtered board. */}
      {rest.length > 0 && (
        <p className="mt-5 text-sm leading-relaxed text-[var(--muted-foreground)]">
          Also open right now:{" "}
          {rest.map((item, i) => (
            <span key={item.slug}>
              {i > 0 && ", "}
              <Link to="/jobs" className="font-semibold text-[var(--ocean)] hover:underline">
                {item.name}
              </Link>
              <span> ({item.count})</span>
            </span>
          ))}
          .
        </p>
      )}
    </div>
  );
}

function HubPage() {
  const { taxonomy } = Route.useLoaderData();

  return (
    <main className="min-h-screen">
      <Navbar overlay tone="light" />

      <section className="gradient-soft">
        <div className="mx-auto max-w-6xl px-5 pt-34 pb-16 sm:px-8 md:pt-42 md:pb-20">
          <Reveal>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
              For Providers
            </div>
            <h1 className="mt-3 text-4xl font-bold leading-[1.06] tracking-tight text-[var(--deep)] md:text-5xl lg:text-6xl">
              Locum Tenens Jobs
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--muted-foreground)]">
              {taxonomy.total > 0 ? (
                <>
                  <strong className="font-semibold text-[var(--deep)]">{taxonomy.total} openings</strong>{" "}
                  across {taxonomy.states.length} states and {taxonomy.specialties.length}{" "}
                  specialties — locum tenens and permanent. Orchard is physician-founded, so you
                  talk to people who have worked the shift, and you apply direct.
                </>
              ) : (
                <>
                  Locum tenens and permanent assignments nationwide from a physician-founded
                  staffing agency.
                </>
              )}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/jobs"
                className="cta inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-bold text-white gradient-teal shadow-[var(--shadow-soft)]"
              >
                Search all {taxonomy.total || ""} jobs
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/provider-inquiry"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-6 py-3.5 text-[15px] font-bold text-[var(--deep)] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
              >
                <Briefcase className="h-4 w-4" />
                Join the network
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl space-y-16 px-5 py-16 sm:px-8 md:py-20">
          <Reveal>
            <Group
              title="Browse by state"
              icon={MapPin}
              items={taxonomy.states}
              empty="No openings are listed right now — check the full board."
            />
          </Reveal>
          <Reveal>
            <Group
              title="Browse by specialty"
              icon={Stethoscope}
              items={taxonomy.specialties}
              empty="No specialties are listed right now — check the full board."
            />
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
