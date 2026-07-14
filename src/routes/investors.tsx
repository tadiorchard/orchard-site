import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";


export const Route = createFileRoute("/investors")({
  head: () => ({
    meta: [
      { title: "Investors — Orchard" },
      { name: "description", content: "Investor information and updates from Orchard." },
      { property: "og:title", content: "Investors — Orchard" },
      { property: "og:description", content: "Investor information and updates from Orchard." },
    ],
  }),
  component: InvestorsPage,
});

function InvestorsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <section
        className="flex-1 relative overflow-hidden py-24 lg:py-32"
        style={{ background: "linear-gradient(135deg, #EAF3FB 0%, #F1F7FC 100%)" }}
      >
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <div className="relative rounded-[2rem] p-12 md:p-16 text-center border border-[var(--ocean)]/15 shadow-[var(--shadow-float)] bg-white">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--deep)] leading-tight">
              Coming Soon
            </h1>
            <p className="mt-5 text-lg text-[var(--muted-foreground)] leading-relaxed">
              Investor resources and updates will be published here soon. Thank you for your interest in Orchard.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
