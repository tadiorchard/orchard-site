import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ArrowRight } from "lucide-react";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/consulting")({
  head: () => seo({
      title: "Consulting — Orchard",
      description:
        "Advisory services for the initiation, expansion, or restructuring of hospital programs.",
      path: "/consulting",
      robots: "noindex, follow",
    }),
  component: ConsultingPage,
});

function ConsultingPage() {
  return (
    <main className="min-h-screen">
      <Navbar overlay tone="light" />
      <section className="gradient-hero pt-46 pb-28 lg:pt-54 lg:pb-36">
        <div className="mx-auto max-w-4xl px-6 lg:px-10 text-center">
          <span className="text-xs font-semibold tracking-[0.22em] uppercase text-[var(--ocean)]">Consulting</span>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--deep)] leading-[1.05]">Consulting</h1>
          <p className="mt-6 text-lg text-[var(--muted-foreground)]">Content coming soon.</p>
          <Link to="/inquiry" className="mt-10 inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white gradient-teal lift">
            Contact Us <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
