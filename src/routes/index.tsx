import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { MissionStatement } from "@/components/site/MissionStatement";
import { FacilityValue } from "@/components/site/FacilityValue";
import { Features } from "@/components/site/Features";
import { SplitSection } from "@/components/site/SplitSection";
import { Testimonials } from "@/components/site/Testimonials";
import { Stats } from "@/components/site/Stats";
import { ClosingCta } from "@/components/site/ClosingCta";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Orchard — Premium Locum Tenens Staffing for Providers" },
      { name: "description", content: "Orchard connects hospitals with experienced, competitive healthcare providers. Staffing, telemedicine, and consulting for the 21st century." },
      { property: "og:title", content: "Orchard — Premium Locum Tenens Staffing" },
      { property: "og:description", content: "Your medical career, on your terms. Integrity, reliability, and the highest quality of care." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <MissionStatement />
      <SplitSection />
      <FacilityValue />
      <Features />
      <Testimonials />
      <Stats />
      <ClosingCta />
      <Footer />
    </main>
  );
}
