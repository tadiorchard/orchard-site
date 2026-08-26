import { Link } from "@tanstack/react-router";
import { Users, Video, LineChart, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Users,
    title: "Staffing",
    desc: "We offer temporary and long-term healthcare staffing solutions, providing a strong network of competitive experienced providers.",
    to: "/services" as const,
  },
  {
    icon: Video,
    title: "Telemedicine",
    desc: "We offer a comprehensive telemedicine solution, providing 24-7 remote access to on-call specialists available via specialized technology.",
    to: "/telemedicine" as const,
  },
  {
    icon: LineChart,
    title: "Consulting",
    desc: "We provide advisory services focused on business planning and healthcare models for the initiation, expansion, or restructuring of hospital programs.",
    to: "/consulting" as const,
  },
];

export function Services() {
  return (
    <section className="relative py-24 lg:py-32 gradient-soft">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--ocean)]">
            What we do
          </span>
          <h2 className="mt-3 text-4xl lg:text-5xl font-bold text-[var(--deep)] leading-tight">
            Healthcare for the 21<sup className="text-2xl lg:text-3xl">st</sup> Century
          </h2>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((s) => (
            <div key={s.title} className="glass rounded-3xl p-8 lift flex flex-col">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl gradient-teal text-white shadow-[var(--shadow-soft)]">
                <s.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-[var(--deep)]">{s.title}</h3>
              <p className="mt-3 text-[var(--muted-foreground)] leading-relaxed flex-1">
                {s.desc}
              </p>
              <Link
                to={s.to}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--ocean)] hover:text-[var(--deep)] transition-colors w-fit"
              >
                Learn More
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
