import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FormConsent } from "@/components/site/FormConsent";
import { Reveal } from "@/components/site/Reveal";
import { StoryTimeline } from "@/components/site/StoryTimeline";
import { getJobs } from "@/lib/api/jobs.functions";
import investorsHero from "@/assets/investors.jpg";
import naltoLogo from "@/assets/nalto-member.png";
import naprLogo from "@/assets/NAPR.png";
import { ArrowDown, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/investors")({
  head: () => ({
    meta: [
      { title: "Investors — Orchard" },
      {
        name: "description",
        content:
          "Investor highlights for Orchard: a physician-founded locum tenens staffing company operating across 50 states and 100+ specialties. Express your interest.",
      },
      { property: "og:title", content: "Investors — Orchard" },
      { property: "og:description", content: "Investor highlights for Orchard." },
      { property: "og:url", content: "/investors" },
    ],
    links: [{ rel: "canonical", href: "/investors" }],
  }),
  /**
   * Demand figures come from the live board rather than a written-down number,
   * so nothing on this page can quietly go stale. Everything is expressed as a
   * count of open roles or a share of them — no revenue, no valuation, no
   * projections.
   */
  loader: async () => {
    const feed = await getJobs();
    if (feed.status !== "ok" || feed.jobs.length === 0) return { live: null };

    const jobs = feed.jobs;
    const tally = (get: (j: (typeof jobs)[number]) => string | null) => {
      const m = new Map<string, number>();
      for (const j of jobs) {
        const v = get(j);
        if (v) m.set(v, (m.get(v) ?? 0) + 1);
      }
      return m;
    };

    const specialties = tally((j) => j.specialty);
    const classes = tally((j) => j.jobClass);
    const classified = [...classes.values()].reduce((a, b) => a + b, 0);

    return {
      live: {
        openCount: jobs.length,
        statesLive: tally((j) => j.state).size,
        specialtiesLive: specialties.size,
        mix: [...classes.entries()]
          .sort((a, b) => b[1] - a[1])
          .map(([name, n]) => ({ name, pct: Math.round((n / classified) * 100) })),
        topSpecialties: [...specialties.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([name, n]) => ({ name, pct: Math.round((n / jobs.length) * 100) })),
      },
    };
  },
  component: InvestorsPage,
});

/** Facts already published elsewhere on the site. No figures invented here. */
const position = [
  { value: "2010", label: "Founded", note: "Physician-founded" },
  { value: "50", label: "States", note: "Licensing & credentialing in place" },
  { value: "100+", label: "Specialties", note: "Placed across the board" },
  { value: "<1%", label: "Provider fallout", note: "Rate across placements" },
];

const operating = [
  {
    label: "Model",
    body: "Locum tenens and permanent placement for hospitals and health systems, sold on consistency rather than transaction volume.",
  },
  {
    label: "Governance",
    body: "A clinical governance framework set by the founding physician covers provider vetting and service-line integration on every placement.",
  },
  {
    label: "Footprint",
    body: "All 50 states and more than 100 specialties, with the licensing and credentialing infrastructure to place into them.",
  },
  {
    label: "Track record",
    body: "Sixteen years operating without a malpractice lawsuit, and a sub-1% provider fallout rate.",
  },
];

const leadership = [
  { name: "Indira Saladi", role: "President & Board Director" },
  { name: "Dr. N. Ram Saladi", role: "Medical Director" },
  { name: "James Cantrell", role: "Chief Executive Officer" },
];

function InvestorsPage() {
  const { live } = Route.useLoaderData();

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

      {/* MASTHEAD */}
      <section className="relative overflow-hidden text-white" style={{ background: "#083d68" }}>
        <img
          src={investorsHero}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Brand-tinted overlay — the image reads through, the type stays legible */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(12,82,137,0.92) 0%, rgba(10,74,124,0.90) 60%, rgba(8,61,104,0.93) 100%)",
          }}
        />
        <div
          aria-hidden
          className="float-slow pointer-events-none absolute -top-28 -left-24 h-96 w-96 rounded-full opacity-25 blur-3xl"
          style={{ background: "#1A82CD" }}
        />
        <div className="relative mx-auto max-w-6xl px-6 pt-34 pb-14 lg:px-10 md:pt-42 md:pb-16">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
            <div className="max-w-2xl">
              <span className="enter-up text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                Investor Relations
              </span>
              <h1
                className="enter-up mt-3 text-4xl font-bold leading-[1.05] md:text-5xl lg:text-6xl"
                style={{ animationDelay: "90ms" }}
              >
                Company Highlights
              </h1>
              <p
                className="enter-up mt-5 text-lg leading-relaxed text-white/85"
                style={{ animationDelay: "180ms" }}
              >
                Orchard is a physician-founded locum tenens and permanent placement
                staffing company, connecting hospitals and health systems nationwide
                with board-certified providers.
              </p>
            </div>

            <a
              href="#express-interest"
              className="enter-up cta inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[var(--deep)] shadow-[var(--shadow-soft)] hover:bg-[var(--ice)]"
              style={{ animationDelay: "270ms" }}
            >
              Express interest
              <ArrowDown className="h-4 w-4" />
            </a>
          </div>

          {/* Position strip */}
          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/15 lg:grid-cols-4">
            {position.map((m) => (
              <div key={m.label} className="bg-[#0A4A7C]/80 px-5 py-6 backdrop-blur">
                <div className="text-3xl font-bold tabular-nums tracking-tight md:text-4xl">
                  {m.value}
                </div>
                <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                  {m.label}
                </div>
                <div className="mt-2 text-[13px] leading-snug text-white/60">{m.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE DEMAND */}
      {live && (
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10 md:py-20">
            <Reveal className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
                  <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--teal)]" />
                  Live demand
                </div>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-[var(--deep)] md:text-3xl">
                  What is in market today
                </h2>
              </div>
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 text-sm font-bold text-[var(--ocean)] transition-colors hover:text-[var(--deep)]"
              >
                View the board
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>

            <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1.3fr]">
              {/* Counts */}
              <Reveal className="rounded-2xl border border-[var(--border)] bg-[var(--ice)] p-6">
                <dl className="space-y-5">
                  {[
                    ["Open roles", live.openCount],
                    ["States with live roles", live.statesLive],
                    ["Specialties in market", live.specialtiesLive],
                  ].map(([label, value]) => (
                    <div key={String(label)} className="flex items-baseline justify-between gap-4">
                      <dt className="text-sm font-semibold text-[var(--muted-foreground)]">{label}</dt>
                      <dd className="text-2xl font-bold tabular-nums text-[var(--deep)]">{value}</dd>
                    </div>
                  ))}
                </dl>

                {live.mix.length > 0 && (
                  <div className="mt-7 border-t border-[var(--border)] pt-5">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                      Assignment mix
                    </div>
                    <div className="mt-3 space-y-2.5">
                      {live.mix.map((m) => (
                        <div key={m.name} className="flex items-center gap-3">
                          <span className="w-32 flex-none text-sm font-semibold text-[var(--deep)]">
                            {m.name}
                          </span>
                          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--ocean)]/15">
                            <span
                              className="block h-full rounded-full gradient-teal"
                              style={{ width: `${m.pct}%` }}
                            />
                          </span>
                          <span className="w-10 flex-none text-right text-sm font-bold tabular-nums text-[var(--ocean)]">
                            {m.pct}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Reveal>

              {/* Specialty concentration */}
              <Reveal delay={100} className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  Largest specialties by share of open roles
                </div>
                <div className="mt-4 divide-y divide-[var(--border)]">
                  {live.topSpecialties.map((s) => (
                    <Link
                      key={s.name}
                      to="/jobs"
                      search={{ specialty: s.name }}
                      className="group flex items-center justify-between gap-4 py-3 transition-colors first:pt-0 last:pb-0 hover:text-[var(--ocean)]"
                    >
                      <span className="text-[15px] font-semibold text-[var(--deep)] group-hover:text-[var(--ocean)]">
                        {s.name}
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-[var(--ocean)]/15 sm:block">
                          <span
                            className="block h-full rounded-full gradient-teal"
                            style={{ width: `${Math.max(s.pct, 3)}%` }}
                          />
                        </span>
                        <span className="w-10 text-right text-sm font-bold tabular-nums text-[var(--ocean)]">
                          {s.pct}%
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
                <p className="mt-5 text-xs leading-relaxed text-[var(--muted-foreground)]">
                  Counts and shares are read directly from our staffing system when this
                  page loads, and move as roles open and close.
                </p>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* MILESTONES */}
      <section className="gradient-soft">
        <div className="mx-auto max-w-[88rem] px-6 py-16 lg:px-10 md:py-20">
          <Reveal className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
              Track record
            </div>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[var(--deep)] md:text-3xl">
              Fifteen years, in three eras
            </h2>
            <p className="mt-4 leading-relaxed text-[var(--muted-foreground)]">
              From a single Illinois health system to a national platform.
            </p>
          </Reveal>

          <div className="mt-12">
            <StoryTimeline />
          </div>
        </div>
      </section>

      {/* HOW WE OPERATE */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10 md:py-20">
          <Reveal>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
              How we operate
            </div>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[var(--deep)] md:text-3xl">
              The business, in short
            </h2>
          </Reveal>

          <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
            {operating.map((o) => (
              <div key={o.label} className="bg-white p-6">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ocean)]">
                  {o.label}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">{o.body}</p>
              </div>
            ))}
          </div>

          <Reveal delay={80} className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-6 rounded-2xl border border-[var(--border)] bg-white p-6">
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                Memberships &amp; standards
              </div>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--muted-foreground)]">
                A NALTO member and NAPR compliant — the ethical and practice standards our
                placement process is held to.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <img
                src={naltoLogo}
                alt="NALTO Member — National Association of Locum Tenens Organizations"
                loading="lazy"
                className="h-12 w-auto object-contain"
              />
              <img
                src={naprLogo}
                alt="NAPR — National Association for Physician Recruiters"
                loading="lazy"
                className="h-14 w-auto object-contain"
              />
            </div>
          </Reveal>

          <Reveal className="mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-5 rounded-2xl border border-[var(--border)] bg-[var(--ice)] p-6">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                Leadership
              </div>
              <div className="mt-3 flex flex-wrap gap-x-8 gap-y-3">
                {leadership.map((l) => (
                  <div key={l.name}>
                    <div className="text-sm font-bold text-[var(--deep)]">{l.name}</div>
                    <div className="text-[13px] text-[var(--muted-foreground)]">{l.role}</div>
                  </div>
                ))}
              </div>
            </div>
            <Link
              to="/leadership"
              className="inline-flex items-center gap-2 text-sm font-bold text-[var(--ocean)] transition-colors hover:text-[var(--deep)]"
            >
              Full leadership
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
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

      {/* DISCLAIMER */}
      <section className="border-t border-[var(--border)] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
          <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">
            Open role counts and specialty shares are read from Orchard's staffing
            system at page load and change as roles open and close. Operating history,
            coverage and milestone details are stated as of the dates shown. Nothing on
            this page is an offer to sell or a solicitation of an offer to buy any
            security, and no financial performance, projection or valuation is
            presented here. Prospective investors should contact us directly.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
