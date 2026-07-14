import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import bannerProviders from "@/assets/banner-providers.jpg";
import {
  DollarSign,
  FileSignature,
  CalendarRange,
  Clock4,
  ShieldCheck,
  Hospital,
  Briefcase,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/providers")({
  head: () => ({
    meta: [
      { title: "For Providers — Quality Care. Quality Providers. | Orchard" },
      {
        name: "description",
        content:
          "Orchard partners with healthcare providers to deliver higher pay, desirable contracts, flexibility, and long-term placements.",
      },
      { property: "og:title", content: "For Providers | Orchard" },
      {
        property: "og:description",
        content:
          "Higher pay, desirable contracts, and long-term placements for healthcare providers.",
      },
    ],
  }),
  component: ProvidersPage,
});

const benefits = [
  {
    icon: DollarSign,
    title: "Higher Pay",
    body:
      "We aren't in business to profiteer off of our providers. We are here to help healthcare providers and hospitals work together to provide better care. Unlike a traditional locum agency, we don't take the lion's share of your pay. We know how hard you work; you deserve to be paid for it.",
  },
  {
    icon: FileSignature,
    title: "Desirable Contracts",
    body:
      "As a physician led staffing organization, we know what it's like to work in a hospital, and we know exactly which types of scheduling contracts are, and are not, desirable. We look out for our providers, helping them to find not only any contract — but the right contract, based on their unique wants and needs.",
  },
  {
    icon: CalendarRange,
    title: "Flexibility",
    body:
      "Orchard helps providers find the perfect positions to maximize their flexibility and retain more control over their schedules.",
  },
  {
    icon: Clock4,
    title: "Maximized Hours",
    body:
      "Orchard can help providers take on additional hours when needed, helping to supplement income from a permanent position or facilitating multiple contracts for those who prefer a more varied lifestyle.",
  },
  {
    icon: ShieldCheck,
    title: "Long Term Placements",
    body:
      "Traditional locum tenens organizations don't guarantee long term placement and often only guarantee a few days of work at a time. This can create an uncertain and anxious work environment. We help our providers not only find long term placements but also help to ensure that you find as much employment as you need.",
  },
  {
    icon: Hospital,
    title: "Varied Practice Settings",
    body:
      "Because our positions are temporary, the contracts allow you to experience a range of practice settings. By working with Orchard, you can test the waters at multiple locations and find the best environment for your style of practice. Unlike traditional locum tenens programs, we can help you find long term temporary positions to help you get a full feel for different places of practice.",
  },
  {
    icon: Briefcase,
    title: "Facilitated Logistics",
    body:
      "Licensing, obtaining insurance, and organizing managerial logistics are tedious activities that take away from your time with patients. Orchard will deal with all of the logistics to ensure that you not only have a placement in a healthcare facility, but that the administration is handled for you before you arrive.",
  },
];

function ProvidersPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <img
          src={bannerProviders}
          alt="Smiling physician in modern hospital corridor"
          width={1920}
          height={800}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(12,82,137,0.85) 0%, rgba(8,52,90,0.80) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-6 lg:px-10 py-28 lg:py-36 text-center text-white">
          <span className="text-xs font-semibold tracking-[0.22em] uppercase text-white/85">
            For Providers
          </span>
          <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.08]">
            Quality Care. Quality Providers.
          </h1>
          <div className="mt-8 space-y-5 text-lg text-white/85 leading-relaxed">
            <p>
              Orchard is more than just another recruiting firm. We get to know
              each healthcare provider we work with to make sure you are taken
              care of.
            </p>
            <p>
              We get to know your needs and interests in order to help you find
              the perfect placement. Then, we help you find long-term contracts
              and job assurance. Working with us is different than working with
              a recruiting agency.
            </p>
            <p className="font-semibold text-white">We offer:</p>
          </div>
        </div>
      </section>

      {/* Benefits — open asymmetric flow */}
      <section className="py-24 lg:py-28 bg-white">
        <div className="mx-auto max-w-5xl px-6 lg:px-10 space-y-20">
          {benefits.map((b, i) => {
            const reverse = i % 2 === 1;
            return (
              <div key={b.title}>
                <div
                  className={`flex flex-col ${
                    reverse ? "md:flex-row-reverse" : "md:flex-row"
                  } items-start gap-10 md:gap-16`}
                >
                  <div className="md:w-1/3 flex md:justify-center">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl border border-[var(--deep)]/15 bg-white text-[#0C5289]">
                      <b.icon className="h-9 w-9" strokeWidth={1.6} />
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <div className="flex items-baseline gap-4">
                      <span className="text-sm font-semibold tracking-[0.2em] text-[var(--ocean)]">
                        0{i + 1}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-bold text-[var(--deep)]">
                        {b.title}
                      </h2>
                    </div>
                    <p className="mt-5 text-[var(--muted-foreground)] leading-relaxed text-lg">
                      {b.body}
                    </p>
                  </div>
                </div>
                {i < benefits.length - 1 && (
                  <div className="mt-20 mx-auto h-px max-w-2xl bg-gradient-to-r from-transparent via-[var(--ocean)]/25 to-transparent" />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section
        className="relative py-24 lg:py-32 text-white overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0C5289 0%, #0A4A7C 60%, #083d68 100%)",
        }}
      >
        <div className="relative mx-auto max-w-3xl px-6 lg:px-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold">Get In Touch</h2>
          <p className="mt-6 text-lg text-white/85 leading-relaxed">
            The best way to learn about what we do is to get in touch! We're
            available by phone or email anytime.
          </p>
          <Link
            to="/inquiry"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-[var(--deep)] hover:bg-[var(--ice)] shadow-[var(--shadow-float)] transition-all lift"
          >
            contact us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
