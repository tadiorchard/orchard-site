import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FormConsent } from "@/components/site/FormConsent";
import { Reveal } from "@/components/site/Reveal";
import {
  TrendingUp,
  HeartPulse,
  Globe2,
  ShieldCheck,
  Handshake,
  ArrowDown,
} from "lucide-react";

export const Route = createFileRoute("/investors")({
  head: () => ({
    meta: [
      { title: "Investors — Grow with Orchard" },
      { name: "description", content: "Invest in Orchard, a physician-founded locum tenens healthcare staffing company operating in 50 states across 100+ specialties. Express your interest." },
      { property: "og:title", content: "Investors — Grow with Orchard" },
      { property: "og:description", content: "Invest in a physician-founded healthcare staffing company. Express your interest." },
      { property: "og:url", content: "/investors" },
    ],
    links: [{ rel: "canonical", href: "/investors" }],
  }),
  component: InvestorsPage,
});

const metrics = [
  { value: "16+", label: "Years in business" },
  { value: "$20M+", label: "Revenue" },
  { value: "50", label: "States covered" },
  { value: "100+", label: "Specialties" },
];

const pillars = [
  {
    icon: HeartPulse,
    title: "Physician-founded model",
    body: "Founded and led by clinicians who understand hospital operations from the inside — a durable advantage in how we match, vet, and retain providers.",
  },
  {
    icon: TrendingUp,
    title: "Structural demand",
    body: "An aging population, rising costs, and workforce shortages mean hospitals need flexible staffing more than ever. We sit directly in that gap.",
  },
  {
    icon: Globe2,
    title: "Nationwide footprint",
    body: "Coverage across 50 states and more than 100 specialties, with the licensing and credentialing infrastructure to scale placements.",
  },
  {
    icon: ShieldCheck,
    title: "Quality that retains",
    body: "A 1% fallout rate and long-term placement focus build the repeat hospital relationships that compound over time.",
  },
  {
    icon: Handshake,
    title: "Long-term partnerships",
    body: "We prioritize consistent, long-term contracts over transactional placements — deeper relationships with both facilities and providers.",
  },
];

function InvestorsPage() {
  useEffect(() => {
    if (!document.querySelector('script[src*="recaptcha/api.js"]')) {
      const s = document.createElement("script");
      s.src = "https://www.google.com/recaptcha/api.js";
      s.async = true;
      s.defer = true;
      document.head.appendChild(s);
    }
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
      <Navbar overlay />

      {/* HERO */}
      <section
        className="relative overflow-hidden text-white"
        style={{ background: "linear-gradient(135deg, #0C5289 0%, #0A4A7C 60%, #083d68 100%)" }}
      >
        <div
          aria-hidden
          className="float-slow pointer-events-none absolute -top-28 -left-24 h-96 w-96 rounded-full opacity-25 blur-3xl"
          style={{ background: "#1A82CD" }}
        />
        <div
          aria-hidden
          className="float-slower pointer-events-none absolute -bottom-32 right-0 h-[26rem] w-[26rem] rounded-full opacity-20 blur-3xl"
          style={{ background: "#1A82CD" }}
        />
        <div className="relative mx-auto max-w-3xl px-6 lg:px-10 pt-38 pb-20 md:pt-46 md:pb-28 text-center">
          <span className="enter-up inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]">
            Investors
          </span>
          <h1 className="enter-up mt-6 text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.06]" style={{ animationDelay: "90ms" }}>
            Grow with Orchard
          </h1>
          <p className="enter-up mt-6 text-lg md:text-xl text-white/85 leading-relaxed" style={{ animationDelay: "180ms" }}>
            Invest in a physician-founded healthcare staffing company built for
            the long term. We connect hospitals nationwide with the providers
            they need — and we're just getting started.
          </p>
          <a
            href="#express-interest"
            className="enter-up cta mt-9 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[var(--deep)] shadow-[var(--shadow-soft)] hover:bg-[var(--ice)]"
            style={{ animationDelay: "270ms" }}
          >
            Express interest
            <ArrowDown className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* METRICS */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 py-16 md:py-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {metrics.map((m, i) => (
              <Reveal key={m.label} delay={i * 80} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-[var(--deep)] tabular-nums tracking-tight">
                  {m.value}
                </div>
                <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  {m.label}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY INVEST */}
      <section className="gradient-soft">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 py-20 md:py-24">
          <Reveal className="text-center max-w-2xl mx-auto">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
              Invest in us
            </div>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[var(--deep)] tracking-tight">
              Why Orchard
            </h2>
            <p className="mt-4 text-[var(--muted-foreground)] leading-relaxed">
              A staffing company built by clinicians, operating in a market with
              lasting demand — and a model designed for durable, repeatable growth.
            </p>
          </Reveal>

          <div className="mt-12 flex flex-wrap justify-center gap-5">
            {pillars.map((p, i) => (
              <Reveal
                key={p.title}
                delay={(i % 3) * 90}
                className="group lift-lg glass rounded-2xl p-6 flex flex-col w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.834rem)]"
              >
                <div className="icon-pop inline-flex h-12 w-12 items-center justify-center rounded-xl gradient-teal text-white shadow-[var(--shadow-soft)]">
                  <p.icon className="h-6 w-6" strokeWidth={1.7} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-[var(--deep)]">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* EXPRESS INTEREST FORM */}
      <section id="express-interest" className="bg-white scroll-mt-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-20 md:py-24">
          <Reveal className="text-center max-w-xl mx-auto mb-8">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
              Get in touch
            </div>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[var(--deep)] tracking-tight">
              Express your interest
            </h2>
            <p className="mt-3 text-[var(--muted-foreground)] text-base">
              Tell us a bit about you and your investment focus. Our leadership
              team will follow up directly and confidentially.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div
              className="relative rounded-3xl bg-white shadow-[var(--shadow-float)] border border-[var(--border)] overflow-hidden"
              style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
            >
              <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #3D9AB8 0%, #5097D5 50%, #467A9F 100%)" }} />

              <form
                action="https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8&orgId=00DKc000000Ivmn"
                method="POST"
                className="p-5 sm:p-7 md:p-10 space-y-5"
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
                    <label htmlFor="title" className={labelCls}>Title / Role</label>
                    <input id="title" maxLength={40} name="title" type="text" placeholder="e.g. Partner, Principal, Angel" className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="company" className={labelCls}>Firm / Organization</label>
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
                  <label htmlFor="00NWj00000FpOpF" className={labelCls}>
                    Your investment interest
                  </label>
                  <textarea
                    id="00NWj00000FpOpF"
                    name="00NWj00000FpOpF"
                    rows={4}
                    wrap="soft"
                    placeholder="Tell us about your investment focus, typical check size, timeline, and what you'd like to learn about Orchard."
                    className={inputCls + " resize-y min-h-[120px]"}
                  />
                </div>

                <FormConsent />

                <div className="flex justify-center pt-2">
                  <div className="recaptcha-fit">
                    <div className="g-recaptcha" data-sitekey="6LfpApAsAAAAAJGnaVnxcbJVdndYjgJeW_8KPZ_n" />
                  </div>
                </div>

                <button
                  type="submit"
                  name="submit"
                  className="group relative w-full overflow-hidden rounded-xl px-6 py-4 text-base font-semibold text-white shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-float)] hover:-translate-y-0.5 active:translate-y-0"
                  style={{ background: "linear-gradient(135deg, #3D9AB8 0%, #5097D5 50%, #467A9F 100%)" }}
                >
                  <span className="relative z-10">Express Interest</span>
                </button>
              </form>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
