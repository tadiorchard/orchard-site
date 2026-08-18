import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FormConsent } from "@/components/site/FormConsent";
import { Reveal } from "@/components/site/Reveal";
import { JobCard } from "@/components/site/JobCard";
import { getJobs } from "@/lib/api/jobs.functions";
import bannerProviders from "@/assets/banner-providers.jpg";
import {
  DollarSign,
  FileSignature,
  CalendarRange,
  ShieldCheck,
  Hospital,
  ArrowDown,
  ArrowRight,
  PhoneCall,
} from "lucide-react";

export const Route = createFileRoute("/provider-inquiry")({
  head: () => ({
    meta: [
      { title: "Provider Inquiry — Locum Tenens Opportunities | Orchard" },
      {
        name: "description",
        content:
          "Orchard is a physician-led locum tenens recruitment agency. Join our network for higher pay, desirable contracts, flexible schedules, long-term placements, and fully handled logistics.",
      },
      { property: "og:title", content: "Provider Inquiry — Orchard" },
      {
        property: "og:description",
        content: "Join Orchard's network of locum tenens healthcare providers.",
      },
      { property: "og:url", content: "/provider-inquiry" },
    ],
    links: [{ rel: "canonical", href: "/provider-inquiry" }],
  }),
  // A live count and a few roles — the board is the proof behind the pitch.
  loader: async () => {
    const feed = await getJobs();
    return {
      openCount: feed.status === "ok" ? feed.jobs.length : 0,
      featured: feed.status === "ok" ? feed.jobs.slice(0, 3) : [],
    };
  },
  component: ProviderInquiryPage,
});

const perks = ["Higher pay", "Flexible schedules", "Long-term placements", "Logistics handled"];

const reasons = [
  {
    icon: DollarSign,
    title: "Higher Pay",
    body: "We don't take the lion's share of your pay like a traditional locum agency. You work hard — you deserve to keep more of what you earn.",
  },
  {
    icon: FileSignature,
    title: "Desirable Contracts",
    body: "As a physician-led organization, we know which schedules and contracts are worth your time. We help you find the right assignment, not just any assignment.",
  },
  {
    icon: CalendarRange,
    title: "Flexibility & Control",
    body: "Keep control of your schedule. We match you to positions that fit the lifestyle and pace you want.",
  },
  {
    icon: ShieldCheck,
    title: "Long-Term Placements",
    body: "No more uncertainty of a few days at a time. We secure stable, long-term locum placements and as much work as you need.",
  },
  {
    icon: Hospital,
    title: "Varied Practice Settings",
    body: "Experience a range of facilities and find the environment that best fits your style of practice.",
  },
];

function ProviderInquiryPage() {
  const { openCount, featured } = Route.useLoaderData();
  const [active, setActive] = useState(0);
  const activeReason = reasons[active];

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
      const response = document.getElementById(
        "g-recaptcha-response",
      ) as HTMLTextAreaElement | null;
      if (response == null || response.value.trim() === "") {
        const el = document.getElementsByName("captcha_settings")[0] as
          HTMLInputElement | undefined;
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

      {/* HERO — background image with dark gradient overlay */}
      <section className="relative overflow-hidden text-white" style={{ background: "#083d68" }}>
        <img
          src={bannerProviders}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(12,82,137,0.92) 0%, rgba(10,74,124,0.88) 60%, rgba(8,61,104,0.85) 100%)",
          }}
        />
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
            For Providers · Locum Tenens
          </span>
          <h1
            className="enter-up mt-6 text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.06]"
            style={{ animationDelay: "90ms" }}
          >
            Your next assignment, on your terms.
          </h1>
          <p
            className="enter-up mt-6 text-lg md:text-xl text-white/85 leading-relaxed"
            style={{ animationDelay: "180ms" }}
          >
            Orchard is a physician-led locum tenens recruitment agency — built by clinicians who
            know what it's like to work in a hospital. We connect you with the right assignments and
            handle the logistics, so you're always taken care of.
          </p>

          <div
            className="enter-up mt-9 flex flex-wrap justify-center gap-3"
            style={{ animationDelay: "270ms" }}
          >
            {perks.map((p) => (
              <span
                key={p}
                className="rounded-full border border-white/25 bg-white/10 backdrop-blur px-4 py-2 text-sm font-medium"
              >
                {p}
              </span>
            ))}
          </div>

          {openCount > 0 && (
            <p
              className="enter-up mt-9 text-sm font-semibold text-white/75"
              style={{ animationDelay: "330ms" }}
            >
              <span className="pulse-dot mr-2 inline-block h-2 w-2 rounded-full bg-[#7ED0A5] align-middle" />
              {openCount} open {openCount === 1 ? "position" : "positions"} right now
            </p>
          )}

          <div
            className="enter-up mt-6 flex flex-wrap items-center justify-center gap-4"
            style={{ animationDelay: "390ms" }}
          >
            <Link
              to="/jobs"
              className="cta inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[var(--deep)] shadow-[var(--shadow-soft)] hover:bg-[var(--ice)]"
            >
              Browse open jobs
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#apply"
              className="cta inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              Send an inquiry
              <ArrowDown className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* OPEN ROLES — a taste of the board, no filters; the full list lives at /jobs */}
      {featured.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
            <Reveal className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
                  Open right now
                </div>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--deep)] md:text-4xl">
                  A few of the roles we're filling
                </h2>
              </div>
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 text-sm font-bold text-[var(--ocean)] transition-colors hover:text-[var(--deep)]"
              >
                View all {openCount > 0 ? openCount : ""} open jobs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((job, i) => (
                <JobCard key={job.id} job={job} delay={(i % 3) * 90} />
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                to="/jobs"
                className="cta inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white shadow-[var(--shadow-soft)]"
                style={{
                  background: "linear-gradient(135deg, #3D9AB8 0%, #5097D5 50%, #467A9F 100%)",
                }}
              >
                View all open jobs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* WHY PROVIDERS CHOOSE US — interactive selector */}
      <section className="relative overflow-hidden gradient-soft">
        <div
          aria-hidden
          className="float-slow pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full opacity-[0.12] blur-3xl"
          style={{ background: "#1A82CD" }}
        />
        <div className="relative mx-auto max-w-6xl px-6 lg:px-10 py-20 md:py-28">
          <Reveal className="text-center max-w-2xl mx-auto">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
              Why providers choose Orchard
            </div>
            <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--deep)] tracking-tight">
              Recruitment that actually works for you
            </h2>
          </Reveal>

          <Reveal
            delay={120}
            className="mt-14 grid lg:grid-cols-[0.85fr_1.15fr] gap-6 lg:gap-8 items-stretch"
          >
            {/* Left: selectable list */}
            <ul className="flex flex-col gap-2.5">
              {reasons.map((r, i) => {
                const on = i === active;
                return (
                  <li key={r.title}>
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      onMouseEnter={() => setActive(i)}
                      aria-pressed={on}
                      className={`group flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-300 ${
                        on
                          ? "border-transparent text-white shadow-[var(--shadow-soft)]"
                          : "border-[var(--border)] bg-white/70 text-[var(--deep)] hover:bg-white"
                      }`}
                      style={
                        on
                          ? { background: "linear-gradient(135deg, #1A82CD 0%, #0C5289 100%)" }
                          : undefined
                      }
                    >
                      <span
                        className={`text-lg font-extrabold tabular-nums tracking-tight transition-colors ${
                          on ? "text-white/90" : "text-[var(--ocean)]"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 font-semibold">{r.title}</span>
                      <span
                        className={`h-2 w-2 rounded-full transition-all duration-300 ${
                          on ? "bg-white scale-100" : "bg-[var(--ocean)]/30 scale-75"
                        }`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Right: active detail panel */}
            <div
              className="relative overflow-hidden rounded-[1.75rem] p-9 lg:p-12 text-white shadow-[var(--shadow-float)] flex flex-col justify-center min-h-[320px]"
              style={{
                background: "linear-gradient(150deg, #0C5289 0%, #0A4A7C 55%, #083d68 100%)",
              }}
            >
              <div
                aria-hidden
                className="float-slower pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full opacity-25 blur-3xl"
                style={{ background: "#1A82CD" }}
              />
              <span className="pointer-events-none absolute -right-4 -bottom-10 select-none text-[12rem] font-extrabold leading-none text-white/[0.07]">
                {String(active + 1).padStart(2, "0")}
              </span>

              <div key={active} className="enter-up relative">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur border border-white/25">
                  <activeReason.icon className="h-8 w-8" strokeWidth={1.6} />
                </div>
                <h3 className="mt-6 text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                  {activeReason.title}
                </h3>
                <p className="mt-4 text-white/85 text-lg leading-relaxed max-w-lg">
                  {activeReason.body}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FORM — split: reassurance panel + form */}
      <section id="apply" className="gradient-soft scroll-mt-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-20 md:py-24">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14 items-start">
            {/* Left: reassurance */}
            <Reveal className="lg:sticky lg:top-28">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
                Join the network
              </div>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[var(--deep)] tracking-tight">
                Tell us about yourself
              </h2>
              <p className="mt-5 text-[var(--muted-foreground)] leading-relaxed">
                Share your specialty and where you'd like to work. A recruiter who understands
                medicine will reach out with assignments that fit your life — no pressure, no
                obligation.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  "A physician-led team reviews your profile",
                  "We match you to the right assignments",
                  "Licensing, credentialing & logistics handled",
                ].map((t, i) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full gradient-teal text-white text-xs font-bold shadow">
                      {i + 1}
                    </span>
                    <span className="text-[15px] text-[var(--deep)]/85 leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>

              {/* Confidentiality assurance */}
              <div className="mt-8">
                <span className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white gradient-teal shadow-[var(--shadow-soft)]">
                  <ShieldCheck className="h-4 w-4" />
                  Confidentiality
                </span>
                <p className="mt-3 font-bold text-[var(--deep)] leading-relaxed">
                  We promise not to present any physician/provider anywhere without explicit
                  approval. You stay in control.
                </p>
              </div>

              <div className="mt-8 flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-soft)]">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl gradient-teal text-white">
                  <PhoneCall className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-sm font-bold text-[var(--deep)]">Have questions first?</div>
                  <div className="text-sm text-[var(--muted-foreground)]">
                    Call us at 847 861 5300
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Right: form */}
            <Reveal delay={120}>
              <div
                className="relative rounded-3xl bg-white shadow-[var(--shadow-float)] border border-[var(--border)] overflow-hidden"
                style={{
                  fontFamily:
                    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                }}
              >
                <div
                  className="h-1.5 w-full"
                  style={{
                    background: "linear-gradient(90deg, #3D9AB8 0%, #5097D5 50%, #467A9F 100%)",
                  }}
                />

                <form
                  action="https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8&orgId=00DKc000000Ivmn"
                  method="POST"
                  className="p-5 sm:p-7 md:p-10 space-y-5"
                >
                  <input
                    type="hidden"
                    name="captcha_settings"
                    value='{"keyname":"Google_reCAPTCHA_v2","fallback":"true","orgId":"00DKc000000Ivmn","ts":""}'
                  />
                  <input type="hidden" name="oid" value="00DKc000000Ivmn" />
                  <input
                    type="hidden"
                    name="retURL"
                    value="https://orchard-site-xi.vercel.app/thank-you"
                  />
                  <input type="hidden" id="lead_source" name="lead_source" value="Web" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="first_name" className={labelCls}>
                        First Name
                      </label>
                      <input
                        id="first_name"
                        maxLength={40}
                        name="first_name"
                        type="text"
                        required
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label htmlFor="last_name" className={labelCls}>
                        Last Name
                      </label>
                      <input
                        id="last_name"
                        maxLength={80}
                        name="last_name"
                        type="text"
                        required
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="email" className={labelCls}>
                        Email
                      </label>
                      <input
                        id="email"
                        maxLength={80}
                        name="email"
                        type="email"
                        required
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label htmlFor="mobile" className={labelCls}>
                        Mobile
                      </label>
                      <input
                        id="mobile"
                        maxLength={40}
                        name="mobile"
                        type="tel"
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="00NWj00000UkWBz" className={labelCls}>
                      Specialty
                    </label>
                    <select
                      id="00NWj00000UkWBz"
                      name="00NWj00000UkWBz"
                      title="Specialty"
                      defaultValue=""
                      className={inputCls + " cursor-pointer"}
                    >
                      <option value="">Select a specialty…</option>
                      {specialties.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="sm:col-span-3">
                      <label htmlFor="company" className={labelCls}>
                        Company
                      </label>
                      <input
                        id="company"
                        maxLength={40}
                        name="company"
                        type="text"
                        className={inputCls}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="city" className={labelCls}>
                        City
                      </label>
                      <input
                        id="city"
                        maxLength={40}
                        name="city"
                        type="text"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className={labelCls}>
                        State/Province
                      </label>
                      <input
                        id="state"
                        maxLength={20}
                        name="state"
                        type="text"
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="00NWj00000FpOpF" className={labelCls}>
                      Message
                    </label>
                    <textarea
                      id="00NWj00000FpOpF"
                      name="00NWj00000FpOpF"
                      rows={4}
                      wrap="soft"
                      className={inputCls + " resize-y min-h-[120px]"}
                    />
                  </div>

                  <FormConsent />

                  <div className="flex justify-center pt-2">
                    <div className="recaptcha-fit">
                      <div
                        className="g-recaptcha"
                        data-sitekey="6LfpApAsAAAAAJGnaVnxcbJVdndYjgJeW_8KPZ_n"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    name="submit"
                    className="group relative w-full overflow-hidden rounded-xl px-6 py-4 text-base font-semibold text-white shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-float)] hover:-translate-y-0.5 active:translate-y-0"
                    style={{
                      background: "linear-gradient(135deg, #3D9AB8 0%, #5097D5 50%, #467A9F 100%)",
                    }}
                  >
                    <span className="relative z-10">Submit</span>
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

const specialties = [
  "Abdominal Radiology",
  "Acute Care",
  "Addiction Medicine",
  "Addiction Psychiatry",
  "Adolescent Medicine",
  "Adult",
  "Adult Reconstructive Orthopedics",
  "Allergy",
  "Allergy/Immunology",
  "Allergy and Immunology",
  "Anatomic/Clinical Pathology",
  "Anatomic Pathology",
  "Anesthesia Assistant",
  "Anesthesiology",
  "Anesthesiology - Cardiac",
  "Audiology",
  "Bariatric Surgery",
  "Bloodbanking/Transfusion Medicine",
  "Breast Radiology",
  "Breast Surgery",
  "Cardiac Electrophysiology",
  "Cardiac Surgery",
  "Cardiology",
  "Cardiothoracic Anesthesiology",
  "Cardiothoracic Radiology",
  "Cardiothoracic Surgery",
  "Cardiovascular Diseases",
  "Cardiovascular Surgery",
  "Certified Anesthesiologist Assistant (CAA)",
  "Child & Adolescent Psychiatry",
  "Child Development",
  "Child Neurology",
  "Clinical Neurophysiology",
  "Clinical Pathology",
  "Colon & Rectal Surgery",
  "Critical Care Medicine",
  "Critical Care Surgery",
  "CRNA",
  "Cytopathology",
  "Dental Hygenist",
  "Dentistry",
  "Dermatology",
  "Dermatopathology",
  "Diabetes",
  "Emergency Medicine",
  "Endocrinology",
  "Endodontist",
  "Family Medicine",
  "Family Medicine - Obstetrics",
  "Foot & Ankle Orthopedics",
  "Forensic Pathology",
  "Forensic Psychiatry",
  "Gastroenterology",
  "General Practice",
  "General Surgery",
  "Geriatric Medicine",
  "Geriatric Psychiatry",
  "Gerontology/Elder Health",
  "Gynecolgic Oncology",
  "Gynecology",
  "Hand Surgery",
  "Head & Neck Surgery",
  "Hematology",
  "Hematology/Oncology",
  "Hematopathology",
  "Hospice & Pallative Medicine",
  "Hospice & Palliative Medicine",
  "Hospitalist",
  "Hyperbaric Medicine/Wound Care",
  "IM/Pediatrics (MedPed)",
  "Immunology",
  "Infectious Disease",
  "Internal Medicine",
  "Interventional Cardiology",
  "Interventional Neuro Radiology",
  "Interventional Pain Management",
  "Interventional Radiology",
  "Kidney Transplant",
  "Maternal & Fetal Medicine",
  "Medical Genetics",
  "Medical Microbiology",
  "Medical Toxicology",
  "Mens Health",
  "Molecular Genetic Pathology",
  "Musculoskeletal Radiology",
  "Neonatal-Perinatal Medicine",
  "Nephrology",
  "Neurodevelopmental Disabilities",
  "Neurological surgery",
  "Neurology",
  "Neuropathology",
  "Neuroradiology",
  "Neurotology",
  "Nocturnist",
  "Nonsurgical/Nonprimary Care",
  "Nucelar Radiology",
  "Nuclear Medicine",
  "Nurse Midwife",
  "Nurse Practitioner",
  "Obstetrics and Gynecology",
  "Occupational Medicine",
  "Occupational Therapist",
  "Occupational Therapy Assistant",
  "Oncology",
  "Ophthalmology",
  "Optometry",
  "Oral & Maxillofacial Surgery",
  "Oral Surgery",
  "Orthodontist",
  "Orthopedic Sports Medicine",
  "Orthopedic Surgery",
  "Orthopedic Trauma Surgery",
  "Otolaryngology",
  "Pain Management",
  "Pathology",
  "Pediatric Allergy and Immunology",
  "Pediatric Anesthesiology",
  "Pediatric Cardiology",
  "Pediatric Cardiothoracic Surgery",
  "Pediatric Certified Dentist",
  "Pediatric Critical Care Medicine",
  "Pediatric Dentistry",
  "Pediatric Emergency Medicine",
  "Pediatric Endocrinology",
  "Pediatric Gastroenterology",
  "Pediatric Genetics",
  "Pediatric Hematology/Oncology",
  "Pediatric Hospitalist",
  "Pediatric Hospitalist-Internal Medicine",
  "Pediatric Infectious Disease",
  "Pediatric Internal Medicine",
  "Pediatric Neonatal Medicine",
  "Pediatric Nephrology",
  "Pediatric Neurological Surgery",
  "Pediatric Neurology",
  "Pediatric Oncology",
  "Pediatric Ophthalmology",
  "Pediatric Orthopedic Surgery",
  "Pediatric Otolaryngology",
  "Pediatric Pathology",
  "Pediatric Pulmonology",
  "Pediatric Radiology",
  "Pediatric Rehabilitation Medicine",
  "Pediatric Rheumatology",
  "Pediatrics",
  "Pediatrics & Behavioral",
  "Pediatrics Orthopedics",
  "Pediatric Surgery",
  "Pediatric Urology",
  "Perfusionist",
  "Periodontist",
  "Physical Medicine and Rehabilitation",
  "Plastic Surgery",
  "Podiatry",
  "Preventive Medicine",
  "Primary Care",
  "Psychiatry",
  "Psychology",
  "Pulmonary Critical Care Medicine",
  "Pulmonary Disease",
  "Pulmonary Sleep Medicine",
  "Radiation Oncology",
  "Radiation Physics",
  "Radiology",
  "Reproductive Endorcrinology",
  "Rheumatology",
  "Selective Pathology",
  "Sleep Medicine",
  "Social Work",
  "Speech Language Pathology",
  "Spine Surgery",
  "Sports Medicine",
  "Surgery",
  "Surgical Oncology",
  "Thoracic Surgery",
  "Transplant Surgery",
  "Trauma",
  "Trauma Surgery",
  "Urgent Care",
  "Urology",
  "Vascular/Interventional Radiology",
  "Vascular Medicine",
  "Vascular Neurology",
  "Vascular Surgery",
  "Womens Health",
  "Wound Care",
];
