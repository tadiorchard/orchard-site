import infoImg from "@/assets/info-consultation.jpg";
import { Check } from "lucide-react";

const items = [
  "Same-day virtual visits with your primary doctor",
  "Integrated mental, physical, and preventive care",
  "Transparent pricing — no surprise bills, ever",
];

export function InfoSections() {
  return (
    <section className="px-6 py-24">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Row 1: text left, image right */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="gradient-soft rounded-[2.5rem] p-10 md:p-14 shadow-[var(--shadow-soft)]">
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--cornflower)' }}>Our Promise</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-5" style={{ color: 'var(--deep)' }}>
              Medicine that listens before it prescribes.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Every Lumen visit starts with a conversation, not a checklist. We give our clinicians the time and tools to truly know you — because better understanding leads to better outcomes.
            </p>
            <ul className="space-y-3">
              {items.map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm" style={{ color: 'var(--deep)' }}>
                  <span className="mt-0.5 w-5 h-5 rounded-full gradient-teal grid place-items-center shrink-0">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 gradient-lavender opacity-40 blur-2xl rounded-[3rem]" />
            <div className="relative glass rounded-[2.5rem] p-3 lift">
              <img
                src={infoImg}
                alt="Doctor listening intently to patient"
                loading="lazy"
                width={1400}
                height={1200}
                className="w-full h-[480px] object-cover rounded-[2rem]"
              />
            </div>
          </div>
        </div>

        {/* Row 2: image left, text right - alternating */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Avg. wait time", value: "9 min", grad: "gradient-teal" },
                { label: "In-network providers", value: "12,400", grad: "gradient-cornflower" },
                { label: "Follow-up within", value: "48 hrs", grad: "gradient-lavender" },
                { label: "Languages spoken", value: "24", grad: "gradient-soft" },
              ].map((m, i) => (
                <div key={m.label} className={`glass rounded-3xl p-6 lift ${i % 2 ? 'translate-y-6' : ''}`}>
                  <div className={`w-10 h-10 rounded-xl ${m.grad} mb-4 shadow-[var(--shadow-soft)]`} />
                  <div className="text-3xl font-bold" style={{ color: 'var(--deep)' }}>{m.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2 lg:pl-8">
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--teal)' }}>By the numbers</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-5" style={{ color: 'var(--deep)' }}>
              Quiet, measurable improvements in every metric that matters.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              From shorter waits to longer conversations, Lumen continuously measures what patients actually feel — and adjusts care accordingly.
            </p>
            <a href="#" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold gradient-cornflower text-white lift shadow-[var(--shadow-soft)]">
              Read the 2026 report →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
