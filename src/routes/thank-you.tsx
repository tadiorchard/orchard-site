import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/thank-you")({
  head: () => seo({
      title: "Thank You — Orchard Healthcare Staffing",
      description:
        "Your submission has been received. A member of the Orchard team will reach out shortly.",
      path: "/thank-you",
      robots: "noindex, follow",
    }),
  component: ThankYouPage,
});

function ThankYouPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar overlay tone="light" />

      <section
        className="flex-1 flex items-center justify-center px-6 pt-42 pb-24"
        style={{
          background:
            "linear-gradient(160deg, #F1F7FC 0%, #DBEAF6 55%, #E5EFF8 100%)",
        }}
      >
        <div className="w-full max-w-xl text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full check-circle shadow-[var(--shadow-float)]"
               style={{ background: "linear-gradient(135deg, #1A82CD 0%, #2A95DD 50%, #0C5289 100%)" }}>
            <svg viewBox="0 0 52 52" className="h-14 w-14" fill="none" aria-hidden="true">
              <path
                className="check-path"
                d="M14 27 L23 36 L39 18"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1
            className="mt-8 text-4xl md:text-5xl font-bold text-[var(--deep)] tracking-tight enter-up"
            style={{ animationDelay: "200ms" }}
          >
            Thank You!
          </h1>
          <p
            className="mt-5 text-base md:text-lg text-[var(--muted-foreground)] leading-relaxed enter-up"
            style={{ animationDelay: "400ms" }}
          >
            Your submission has been successfully received. A member of the
            Orchard team will review your details and reach out to you shortly.
          </p>

          <div className="mt-10 enter-bounce" style={{ animationDelay: "600ms" }}>
            <Link
              to="/"
              className="cta inline-flex items-center justify-center rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-soft)]"
              style={{ background: "linear-gradient(135deg, #1A82CD 0%, #2A95DD 50%, #0C5289 100%)" }}
            >
              Return to Home
            </Link>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
