import { createFileRoute } from "@tanstack/react-router";
import heroTeam from "@/assets/hero-team.jpg";
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
    if (feed.status !== "ok") return { openCount: 0, recent: [], specialties: [] };
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
    return { openCount: feed.jobs.length, recent, specialties };
  },
  component: Index,
});

function Index() {
  const { openCount, recent, specialties } = Route.useLoaderData();
  return (
    <main className="min-h-screen">
      <Navbar overlay />
      <Hero openCount={openCount} />
      <OpenRoles openCount={openCount} recent={recent} specialties={specialties} />
      <Features />
      <FacilityValue />
      <Testimonials />
      <Stats />
      <Footer />
    </main>
  );
}
