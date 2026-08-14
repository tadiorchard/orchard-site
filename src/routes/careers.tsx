import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FormConsent } from "@/components/site/FormConsent";
import { Reveal } from "@/components/site/Reveal";
import heroTeam from "@/assets/hero-team.jpg";
import {
  ClipboardList,
  BadgeCheck,
  Laptop,
  Compass,
  Megaphone,
  UserPlus,
  HeartPulse,
  TrendingUp,
  Sparkles,
  ArrowDown,
} from "lucide-react";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — Join the Orchard Team" },
      { name: "description", content: "Build your career at Orchard. We're hiring across Recruiting, Credentialing, IT, Admin & Scheduling, Marketing, and Leadership. Tell us where you fit in." },
      { property: "og:title", content: "Careers — Orchard" },
      { property: "og:description", content: "Join the team behind a physician-founded healthcare staffing company." },
      { property: "og:url", content: "/careers" },
    ],
    links: [{ rel: "canonical", href: "/careers" }],
  }),
  component: CareersPage,
});

// value === the exact Salesforce picklist value
const teams = [
  { icon: UserPlus, value: "Recruiting", desc: "Connect providers with the assignments and hospitals where they'll thrive." },
  { icon: BadgeCheck, value: "Credentialing", desc: "Keep every placement compliant, verified, and ready to go from day one." },
  { icon: ClipboardList, value: "Admin and Scheduling", desc: "Keep operations running smoothly and coverage on track, every day." },
  { icon: Laptop, value: "IT", desc: "Build and maintain the systems that power a nationwide staffing platform." },
  { icon: Megaphone, value: "Marketing", desc: "Tell Orchard's story and grow our reach with providers and facilities." },
  { icon: Compass, value: "Leadership", desc: "Set direction, mentor teams, and shape the future of the company." },
];

const culture = [
  { icon: HeartPulse, title: "Physician-founded", body: "We're built by clinicians who care deeply about doing right by providers and patients." },
  { icon: TrendingUp, title: "Room to grow", body: "A fast-growing company where your work is visible and your career can climb." },
  { icon: Sparkles, title: "Mission that matters", body: "Every role here helps hospitals deliver better care. The work counts." },
];

function CareersPage() {
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

      {/* HERO — team photo with overlay */}
      <section className="relative overflow-hidden text-white" style={{ background: "#083d68" }}>
        <img src={heroTeam} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(8,40,72,0.90) 0%, rgba(10,58,100,0.86) 55%, rgba(12,82,137,0.82) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-6 lg:px-10 pt-38 pb-20 md:pt-46 md:pb-28 text-center">
          <span className="enter-up inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]">
            Careers at Orchard
          </span>
          <h1 className="enter-up mt-6 text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.06]" style={{ animationDelay: "90ms" }}>
            Build your career with us
          </h1>
          <p className="enter-up mt-6 text-lg md:text-xl text-white/85 leading-relaxed" style={{ animationDelay: "180ms" }}>
            Behind every placement is a team of recruiters, credentialing
            specialists, technologists, and operators. If you want mission-driven
            work at a physician-founded company, we'd love to meet you.
          </p>
          <a
            href="#apply"
            className="enter-up cta mt-9 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[var(--deep)] shadow-[var(--shadow-soft)] hover:bg-[var(--ice)]"
            style={{ animationDelay: "270ms" }}
          >
            See where you fit
            <ArrowDown className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* TEAMS — departments grid */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 py-20 md:py-24">
          <Reveal className="text-center max-w-2xl mx-auto">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
              Teams you can join
            </div>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[var(--deep)] tracking-tight">
              Where you'll fit in
            </h2>
            <p className="mt-4 text-[var(--muted-foreground)]">
              We hire across the whole business — not just recruiting. Find your lane below,
              then tell us about yourself.
            </p>
          </Reveal>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {teams.map((t, i) => (
              <Reveal
                key={t.value}
                delay={(i % 3) * 90}
                className="group lift-lg glass rounded-2xl p-6 flex flex-col"
              >
                <div className="icon-pop inline-flex h-12 w-12 items-center justify-center rounded-xl gradient-teal text-white shadow-[var(--shadow-soft)]">
                  <t.icon className="h-6 w-6" strokeWidth={1.7} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-[var(--deep)]">{t.value}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{t.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CULTURE — colored band */}
      <section
        className="relative overflow-hidden text-white"
        style={{ background: "linear-gradient(135deg, #0C5289 0%, #0F5E9B 55%, #1265A3 100%)" }}
      >
        <div
          aria-hidden
          className="float-slow pointer-events-none absolute -top-24 -right-16 h-80 w-80 rounded-full opacity-20 blur-3xl"
          style={{ background: "#1A82CD" }}
        />
        <div className="relative mx-auto max-w-6xl px-6 lg:px-10 py-16 md:py-20">
          <Reveal className="text-center max-w-2xl mx-auto">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              Why Orchard
            </div>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold">A place to do your best work</h2>
          </Reveal>
          <div className="mt-12 grid sm:grid-cols-3 gap-8">
            {culture.map((c, i) => (
              <Reveal key={c.title} delay={i * 90} className="text-center sm:text-left">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur border border-white/25">
                  <c.icon className="h-6 w-6" strokeWidth={1.7} />
                </div>
                <h3 className="mt-4 text-lg font-bold">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80">{c.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FORM */}
      <section id="apply" className="gradient-soft scroll-mt-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-20 md:py-24">
          <Reveal className="text-center max-w-xl mx-auto mb-8">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
              Apply
            </div>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[var(--deep)] tracking-tight">
              Tell us where you fit
            </h2>
            <p className="mt-3 text-[var(--muted-foreground)] text-base">
              Share your details and the area you're interested in — our team will
              be in touch about opportunities.
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
                {/* Salesforce requires Company on every Lead. Career applicants
                    have no company to give, so we send a marker value. */}
                <input type="hidden" name="company" value="[Career Applicant]" />

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
                    <label htmlFor="email" className={labelCls}>Email</label>
                    <input id="email" maxLength={80} name="email" type="email" required className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="mobile" className={labelCls}>Mobile</label>
                    <input id="mobile" maxLength={40} name="mobile" type="tel" className={inputCls} />
                  </div>
                </div>

                <div>
                  <label htmlFor="00NWj00000UlcRx" className={labelCls}>Area of Interest</label>
                  <select
                    id="00NWj00000UlcRx"
                    name="00NWj00000UlcRx"
                    title="Areas of Interest"
                    defaultValue=""
                    className={inputCls + " cursor-pointer"}
                  >
                    <option value="">Select an area…</option>
                    <option value="Admin and Scheduling">Admin and Scheduling</option>
                    <option value="Credentialing">Credentialing</option>
                    <option value="IT">IT</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Recruiting">Recruiting</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label htmlFor="city" className={labelCls}>City</label>
                    <input id="city" maxLength={40} name="city" type="text" className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="state" className={labelCls}>State/Province</label>
                    <input id="state" maxLength={20} name="state" type="text" className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="country" className={labelCls}>Country</label>
                    <input id="country" maxLength={40} name="country" type="text" className={inputCls} />
                  </div>
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
                  <span className="relative z-10">Submit Application</span>
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
