import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms and Conditions | Orchard Corp" },
      {
        name: "description",
        content:
          "Read the Terms and Conditions governing your use of Orchard Corp services.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <main className="min-h-screen">
      <Navbar overlay />
      <section
        className="text-white pt-38 pb-20 lg:pt-46 lg:pb-28"
        style={{
          background:
            "linear-gradient(135deg, #0C5289 0%, #0A4A7C 60%, #083d68 100%)",
        }}
      >
        <div className="mx-auto max-w-4xl px-6 lg:px-10 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Terms and Conditions
          </h1>
          <p className="mt-5 text-white/80">
            Last updated: {new Date().getFullYear()}
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-3xl px-6 lg:px-10 py-20 space-y-6 text-[var(--muted-foreground)] leading-relaxed">
        <p>
          These Terms and Conditions govern your use of the Orchard Corp
          website and services. By accessing our site or engaging with our
          recruitment services, you agree to be bound by these terms.
        </p>
        <p>
          Orchard Corp provides healthcare staffing, telemedicine coordination,
          and consulting services to hospitals, clinics, and healthcare
          providers. All content on this website is provided for informational
          purposes and may be updated at any time without notice.
        </p>
        <p>
          For full details regarding SMS communications, please review our SMS
          Terms &amp; Conditions and SMS Privacy Policy. Questions may be
          directed to info@orchardcorp.com.
        </p>
      </div>
      <Footer />
    </main>
  );
}
