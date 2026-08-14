import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FormConsent } from "@/components/site/FormConsent";
import { Reveal } from "@/components/site/Reveal";
import facilityImg from "@/assets/facility-split.jpeg";
import {
  UserRound,
  Users,
  CalendarClock,
  ShieldCheck,
  BadgeCheck,
  Handshake,
  Check,
  ArrowRight,
  PhoneCall,
} from "lucide-react";

export const Route = createFileRoute("/client-inquiry")({
  head: () => ({
    meta: [
      { title: "Client Inquiry — Locum Coverage & Healthcare Staffing | Orchard" },
      { name: "description", content: "Facing physician shortages or scheduling gaps? Orchard is a physician-led locum tenens staffing agency that connects hospitals and facilities with board-certified providers. Tell us what you need." },
      { property: "og:title", content: "Client Inquiry — Orchard" },
      { property: "og:description", content: "Locum tenens coverage and healthcare staffing for hospitals and facilities." },
      { property: "og:url", content: "/client-inquiry" },
    ],
    links: [{ rel: "canonical", href: "/client-inquiry" }],
  }),
  component: ClientInquiryPage,
});

const heroPoints = [
  "Board-certified, pre-vetted providers",
  "Coverage matched to your schedule",
  "Licensing & credentialing handled for you",
  "One partner from request to placement",
];

const offers = [
  {
    icon: UserRound,
    title: "Local, Specialized Providers",
    body: "Board-certified providers — primarily physicians — with years of hospital experience, matched to your specialty and culture.",
  },
  {
    icon: CalendarClock,
    title: "Complex Scheduling Gaps",
    body: "Individual providers or blocks of coverage to close call gaps, seasonal surges, and hard-to-fill shifts.",
  },
  {
    icon: Users,
    title: "Program Leadership",
    body: "Advanced staff to help launch, expand, or stabilize a service line and lead new hospital programs.",
  },
  {
    icon: ShieldCheck,
    title: "Quality & Consistency",
    body: "Consistent contracts keep the same trusted providers in place until positions are permanently filled.",
  },
  {
    icon: BadgeCheck,
    title: "Pre-Vetted & Credentialed",
    body: "Rigorous vetting and credentialing before arrival, so you can count on the quality of care from day one.",
  },
  {
    icon: Handshake,
    title: "White-Glove Partnership",
    body: "A dedicated, physician-led team owns your request end to end — not a transactional locum agency.",
  },
];

const stats = [
  { value: "16+", label: "Years in business" },
  { value: "50", label: "States covered" },
  { value: "100+", label: "Specialties" },
];

function ClientInquiryPage() {
  useEffect(() => {
    // Load reCAPTCHA script
    if (!document.querySelector('script[src*="recaptcha/api.js"]')) {
      const s = document.createElement("script");
      s.src = "https://www.google.com/recaptcha/api.js";
      s.async = true;
      s.defer = true;
      document.head.appendChild(s);
    }

    // Timestamp interval (preserves Salesforce captcha_settings behavior)
    const timestamp = () => {
      const response = document.getElementById("g-recaptcha-response") as HTMLTextAreaElement | null;
      if (response == null || response.value.trim() === "") {
        const el = document.getElementsByName("captcha_settings")[0] as HTMLInputElement | undefined;
        if (!el) return;
        try {
          const elems = JSON.parse(el.value);
          elems["ts"] = JSON.stringify(new Date().getTime());
          el.value = JSON.stringify(elems);
        } catch {}
      }
    };
    const id = window.setInterval(timestamp, 500);
    return () => window.clearInterval(id);
  }, []);

  const inputCls =
    "w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[15px] text-[var(--deep)] placeholder:text-[var(--muted-foreground)] shadow-sm transition-all focus:outline-none focus:border-[var(--teal)] focus:ring-4 focus:ring-[color:var(--teal)]/15";
  const labelCls =
    "block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--deep)]/75 mb-2";

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar overlay tone="light" />

      {/* HERO — split: intro + facility image panel */}
      <section className="gradient-soft">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-34 pb-16 md:pt-42 md:pb-24">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Left: copy */}
            <Reveal>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
                For Clients · Facilities
              </div>
              <h1 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--deep)] tracking-tight leading-[1.05]">
                Staff your facility with Orchard
              </h1>
              <p className="mt-5 text-[var(--muted-foreground)] text-base md:text-lg leading-relaxed max-w-xl">
                Orchard is a physician-led locum tenens staffing agency. When
                shortages, call gaps, or growing programs leave you short-handed,
                we connect you with experienced, board-certified providers —
                primarily physicians — and handle the sourcing, credentialing,
                and logistics end to end.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-6">
                <a
                  href="#inquire"
                  className="cta inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white shadow-[var(--shadow-soft)]"
                  style={{ background: "linear-gradient(135deg, #3D9AB8 0%, #5097D5 50%, #467A9F 100%)" }}
                >
                  Request coverage
                  <ArrowRight className="h-4 w-4" />
                </a>
                <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                  <PhoneCall className="h-4 w-4 text-[var(--ocean)]" />
                  Prefer to talk? Call 847 861 5300
                </div>
              </div>

              {/* inline stats */}
              <div className="mt-10 flex gap-8 border-t border-[var(--border)] pt-6">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl md:text-3xl font-bold text-[var(--deep)] tabular-nums">
                      {s.value}
                    </div>
                    <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Right: image panel with checklist */}
            <Reveal delay={150} className="img-zoom relative overflow-hidden rounded-[1.75rem] shadow-[var(--shadow-float)] min-h-[440px] flex">
              <img
                src={facilityImg}
                alt="Modern hospital facility"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(155deg, rgba(6,32,58,0.93) 0%, rgba(9,58,100,0.9) 55%, rgba(12,74,124,0.86) 100%)",
                }}
              />
              <div className="relative p-9 lg:p-11 flex flex-col justify-center text-white w-full">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur border border-white/25">
                  <ShieldCheck className="h-7 w-7" strokeWidth={1.7} />
                </span>
                <div className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                  What you can expect
                </div>
                <ul className="mt-5 space-y-3.5">
                  {heroPoints.map((p) => (
                    <li key={p} className="flex items-center gap-3 text-[15px] font-medium">
                      <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-white/15 backdrop-blur border border-white/25">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* WHAT WE HANDLE — horizontal two-column list */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-20 md:py-24">
          <Reveal className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
              Full-service staffing
            </div>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[var(--deep)] tracking-tight">
              What we handle for your facility
            </h2>
          </Reveal>

          <div className="mt-12 grid md:grid-cols-2 gap-x-12 gap-y-10">
            {offers.map((o, i) => (
              <Reveal
                key={o.title}
                delay={(i % 2) * 100}
                className="group flex items-start gap-5"
              >
                <div className="icon-pop flex-none inline-flex h-14 w-14 items-center justify-center rounded-2xl gradient-teal text-white shadow-[var(--shadow-soft)]">
                  <o.icon className="h-7 w-7" strokeWidth={1.6} />
                </div>
                <div className="flex-1 border-b border-[var(--border)] pb-8">
                  <h3 className="text-lg font-bold text-[var(--deep)]">{o.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[var(--muted-foreground)]">
                    {o.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FORM — split: reassurance panel + form */}
      <section id="inquire" className="gradient-soft scroll-mt-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-20 md:py-24">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14 items-start">
            {/* Left: reassurance */}
            <Reveal className="lg:sticky lg:top-28">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
                Request coverage
              </div>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[var(--deep)] tracking-tight">
                Let's scope your coverage
              </h2>
              <p className="mt-5 text-[var(--muted-foreground)] leading-relaxed">
                Share a few details about your facility and the coverage you need.
                A member of our team will reach out to build the right plan — no
                obligation.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  "A physician-led team reviews your request",
                  "We source and vet qualified providers",
                  "You get a tailored coverage plan — fast",
                ].map((t, i) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full gradient-teal text-white text-xs font-bold shadow">
                      {i + 1}
                    </span>
                    <span className="text-[15px] text-[var(--deep)]/85 leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-soft)]">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl gradient-teal text-white">
                  <PhoneCall className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-sm font-bold text-[var(--deep)]">Need coverage urgently?</div>
                  <div className="text-sm text-[var(--muted-foreground)]">Call us at 847 861 5300</div>
                </div>
              </div>
            </Reveal>

            {/* Right: form */}
            <Reveal delay={120}>
              <div
                className="relative rounded-3xl bg-white shadow-[var(--shadow-float)] border border-[var(--border)] overflow-hidden"
                style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
              >
                <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #3D9AB8 0%, #5097D5 50%, #467A9F 100%)" }} />

                <form
                  action="https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8&orgId=00DKc000000Ivmn"
                  method="POST"
                  className="p-7 md:p-10 space-y-5"
                >
                  <input type="hidden" name="captcha_settings" value='{"keyname":"Google_reCAPTCHA_v2","fallback":"true","orgId":"00DKc000000Ivmn","ts":""}' />
                  <input type="hidden" name="oid" value="00DKc000000Ivmn" />
                  <input type="hidden" name="retURL" value="https://orchard-site-xi.vercel.app/thank-you" />
                  <input type="hidden" id="lead_source" name="lead_source" value="Web" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="first_name" className={labelCls}>First Name</label>
                      <input id="first_name" maxLength={40} name="first_name" type="text" required className={inputCls} />
                    </div>
                    <div>
                      <label htmlFor="last_name" className={labelCls}>Last Name</label>
                      <input id="last_name" maxLength={80} name="last_name" type="text" required className={inputCls} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="title" className={labelCls}>Job Title</label>
                      <input id="title" maxLength={40} name="title" type="text" className={inputCls} />
                    </div>
                    <div>
                      <label htmlFor="company" className={labelCls}>Facility / Company</label>
                      <input id="company" maxLength={40} name="company" type="text" className={inputCls} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="email" className={labelCls}>Email</label>
                      <input id="email" maxLength={80} name="email" type="email" required className={inputCls} />
                    </div>
                    <div>
                      <label htmlFor="phone" className={labelCls}>Phone</label>
                      <input id="phone" maxLength={40} name="phone" type="tel" className={inputCls} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="sm:col-span-2">
                      <label htmlFor="city" className={labelCls}>City</label>
                      <input id="city" maxLength={40} name="city" type="text" className={inputCls} />
                    </div>
                    <div>
                      <label htmlFor="state" className={labelCls}>State</label>
                      <input id="state" maxLength={20} name="state" type="text" className={inputCls} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="00NWj00000FpOpF" className={labelCls}>What coverage do you need?</label>
                    <textarea
                      id="00NWj00000FpOpF"
                      name="00NWj00000FpOpF"
                      rows={4}
                      wrap="soft"
                      placeholder="Specialty, coverage dates, location, and any details that help us scope your staffing needs."
                      className={inputCls + " resize-y min-h-[120px]"}
                    />
                  </div>

              <FormConsent />

                  <div className="flex justify-center pt-2">
                    <div className="g-recaptcha" data-sitekey="6LfpApAsAAAAAJGnaVnxcbJVdndYjgJeW_8KPZ_n" />
                  </div>

                  <button
                    type="submit"
                    name="submit"
                    className="group relative w-full overflow-hidden rounded-xl px-6 py-4 text-base font-semibold text-white shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-float)] hover:-translate-y-0.5 active:translate-y-0"
                    style={{ background: "linear-gradient(135deg, #3D9AB8 0%, #5097D5 50%, #467A9F 100%)" }}
                  >
                    <span className="relative z-10">Send Message</span>
                  </button>
                </form>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
