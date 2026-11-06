import { createFileRoute } from "@tanstack/react-router";
import heroTeam from "@/assets/hero-group.jpg";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { FacilityValue } from "@/components/site/FacilityValue";
import { Features } from "@/components/site/Features";
import { OpenRoles } from "@/components/site/OpenRoles";
import { featuredJobs, getJobs } from "@/lib/api/jobs.functions";
import { Testimonials } from "@/components/site/Testimonials";
import { Stats } from "@/components/site/Stats";
import { Footer } from "@/components/site/Footer";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => {
    const base = seo({
      // Both drafts overran Google's cut-off; these fit at 51/60 and 148/155.
      title: "Healthcare Staffing Agency — Locum Tenens | Orchard",
      description:
        "Physician-founded healthcare staffing agency placing locum tenens and permanent " +
        "clinicians with hospitals in all 50 states. Credentialing handled.",
      path: "/",
    });
    return {
      ...base,
      links: [
        ...base.links,
      { rel: "preload", as: "image", href: heroTeam, fetchpriority: "high" },
      ],
    };
  },
  // The board is the strongest proof the provider pitch has — show a little of it.
  loader: async () => {
    const feed = await getJobs();
    if (feed.status !== "ok")
      return {
        openCount: 0,
        recent: [],
        specialties: [],
        specialtyOptions: [],
        stateOptions: [],
        specialtyCounts: {},
        stateCounts: {},
        pairCounts: {},
      };
    const recent = featuredJobs(feed.jobs, 6);
    // The specialties we actually have most roles in — a real way in, not a
    // decorative tag cloud.
    const counts = new Map<string, number>();
    for (const j of feed.jobs) {
      if (j.specialty) counts.set(j.specialty, (counts.get(j.specialty) ?? 0) + 1);
    }
    const specialties = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([name]) => name);
    // Only specialties and states with a live role behind them, so no choice
    // in the hero panel leads to an empty board.
    const specialtyOptions = [...counts.keys()].sort((a, b) => a.localeCompare(b));
    const stateOptions = [
      ...new Set(feed.jobs.map((j) => j.state?.trim().toUpperCase()).filter(Boolean)),
    ].sort() as string[];

    // Counts for the hero panel, so choosing a specialty or a state answers
    // "how many" before anybody submits. Three small maps rather than the job
    // list: the pair map only holds combinations that actually exist, so it is
    // at most one entry per open role.
    const stateCounts: Record<string, number> = {};
    const pairCounts: Record<string, number> = {};
    for (const j of feed.jobs) {
      const st = j.state?.trim().toUpperCase();
      if (st) stateCounts[st] = (stateCounts[st] ?? 0) + 1;
      if (j.specialty && st) {
        const key = `${j.specialty}|${st}`;
        pairCounts[key] = (pairCounts[key] ?? 0) + 1;
      }
    }

    return {
      openCount: feed.jobs.length,
      recent,
      specialties,
      specialtyOptions,
      stateOptions,
      specialtyCounts: Object.fromEntries(counts),
      stateCounts,
      pairCounts,
    };
  },
  component: Index,
});

function Index() {
  const {
    openCount,
    recent,
    specialties,
    specialtyOptions,
    stateOptions,
    specialtyCounts,
    stateCounts,
    pairCounts,
  } = Route.useLoaderData();
  return (
    <main className="min-h-screen">
      <Navbar overlay />
      <Hero
        specialtyOptions={specialtyOptions}
        stateOptions={stateOptions}
        specialtyCounts={specialtyCounts}
        stateCounts={stateCounts}
        pairCounts={pairCounts}
        totalOpen={openCount}
      />
      <OpenRoles openCount={openCount} recent={recent} specialties={specialties} />
      <Features />
      <FacilityValue />
      <Testimonials />
      <Stats />
      <Footer />
    </main>
  );
}
