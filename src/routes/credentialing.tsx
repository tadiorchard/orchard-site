import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/credentialing")({
  head: () => ({
    meta: [
      { title: "Credentialing | Orchard" },
      { name: "description", content: "Credentialing resources for Orchard providers." },
      // TEMPORARY: page is coming-soon / thin content. Remove this line when the
      // real content ships so search engines can index it. See MEMORY.md.
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: CredentialingPage,
});

function CredentialingPage() {
  return (
    <main className="min-h-screen">
      <Navbar overlay tone="light" />
      <section className="gradient-hero pt-50 pb-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--deep)]">Credentialing</h1>
          <p className="mt-6 text-lg text-[var(--muted-foreground)]">Coming soon.</p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
