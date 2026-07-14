import { Calendar, FileText, MessageCircle, Pill } from "lucide-react";

const blocks = [
  { icon: Calendar, title: "Book a Visit", desc: "Same-day & next-day openings", grad: "gradient-teal" },
  { icon: FileText, title: "Medical Records", desc: "Secure access, anytime", grad: "gradient-cornflower" },
  { icon: Pill, title: "Refill Prescriptions", desc: "One-tap renewals", grad: "gradient-lavender" },
  { icon: MessageCircle, title: "Message Your Doctor", desc: "Replies within 4 hours", grad: "gradient-soft" },
];

export function Portal() {
  return (
    <section className="px-6 py-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--cornflower)' }}>Patient Portal</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3" style={{ color: 'var(--deep)' }}>
            Everything you need, in one calm place.
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {blocks.map(({ icon: Icon, title, desc, grad }) => (
            <a key={title} href="#" className="glass rounded-3xl p-7 lift group block">
              <div className={`w-12 h-12 rounded-2xl ${grad} grid place-items-center mb-5 shadow-[var(--shadow-soft)] transition-transform group-hover:scale-110`}>
                <Icon className="w-6 h-6 text-white" strokeWidth={1.8} />
              </div>
              <h3 className="font-semibold text-lg mb-1.5" style={{ color: 'var(--deep)' }}>{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
              <div className="mt-5 text-sm font-semibold inline-flex items-center gap-1 transition-transform group-hover:translate-x-1" style={{ color: 'var(--cornflower)' }}>
                Open →
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
