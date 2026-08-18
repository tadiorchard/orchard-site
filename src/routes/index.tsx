import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { MissionStatement } from "@/components/site/MissionStatement";
import { FacilityValue } from "@/components/site/FacilityValue";
import { Features } from "@/components/site/Features";
import { getJobs } from "@/lib/api/jobs.functions";
import { Testimonials } from "@/components/site/Testimonials";
import { Stats } from "@/components/site/Stats";
import { ClosingCta } from "@/components/site/ClosingCta";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Orchard — Premium Locum Tenens Staffing for Providers" },
      {
        name: "description",
        content:
          "Orchard connects hospitals with experienced, competitive healthcare providers. Staffing, telemedicine, and consulting for the 21st century.",
      },
      { property: "og:title", content: "Orchard — Premium Locum Tenens Staffing" },
      {
        property: "og:description",
        content:
          "Your medical career, on your terms. Integrity, reliability, and the highest quality of care.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  // The board is the strongest proof the provider pitch has — show a little of it.
  loader: async () => {
    const feed = await getJobs();
    if (feed.status !== "ok") return { openCount: 0, recent: [] };
    const recent = [...feed.jobs]
      .sort((a, b) => (b.postedAt ?? "").localeCompare(a.postedAt ?? ""))
      .slice(0, 3);
    return { openCount: feed.jobs.length, recent };
  },
  component: Index,
});

function Index() {
  const { openCount, recent } = Route.useLoaderData();
  return (
    <main className="min-h-screen">
      <Navbar overlay />
      <Hero />
      <MissionStatement />
      <FacilityValue />
      <Features openCount={openCount} recent={recent} />
      <Testimonials />
      <Stats />
      <ClosingCta />
      <Footer />
    </main>
  );
}
