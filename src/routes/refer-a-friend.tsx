import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { User, Mail, Phone, Users, Briefcase, MapPin, FileText, BadgeDollarSign } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/refer-a-friend")({
  head: () => ({
    meta: [
      { title: "Refer a Friend — Orchard Healthcare Staffing" },
      { name: "description", content: "Refer a fellow healthcare professional to Orchard and help them find their next locum tenens opportunity." },
      { property: "og:title", content: "Refer a Friend — Orchard" },
      { property: "og:description", content: "Refer a fellow healthcare professional to Orchard." },
      { property: "og:url", content: "/refer-a-friend" },
    ],
    links: [{ rel: "canonical", href: "/refer-a-friend" }],
  }),
  component: ReferAFriendPage,
});

const SPECIALTIES = [
  "Abdominal Radiology","Acute Care","Addiction Medicine","Adolescent Medicine","Allergy & Immunology",
  "Anesthesiology","Bariatric Surgery","Breast Surgery","Cardiac Surgery","Cardiology",
  "Cardiothoracic Surgery","Certified Anesthesiologist Assistant (CAA)","Certified Nurse Midwife",
  "Certified Registered Nurse Anesthetist (CRNA)","Colon & Rectal Surgery","Critical Care Medicine",
  "Dentistry","Dermatology","Diagnostic Radiology","Emergency Medicine","Endocrinology",
  "ENT / Otolaryngology","Family Medicine","Gastroenterology","General Surgery","Geriatric Medicine",
  "Gynecologic Oncology","Hand Surgery","Hematology / Oncology","Hospice & Palliative Medicine",
  "Hospitalist","Infectious Disease","Internal Medicine","Interventional Cardiology",
  "Interventional Radiology","Maternal-Fetal Medicine","Nephrology","Neurology","Neurosurgery",
  "Neonatology","Nuclear Medicine","Nurse Practitioner","Obstetrics & Gynecology","Occupational Medicine",
  "Oncology","Ophthalmology","Oral & Maxillofacial Surgery","Orthopedic Surgery","Pain Management",
  "Pathology","Pediatrics","Pediatric Cardiology","Pediatric Surgery","Physiatry / PM&R",
  "Physician Assistant","Plastic Surgery","Podiatry","Primary Care","Psychiatry","Psychology",
  "Pulmonology","Radiation Oncology","Radiology","Rheumatology","Sleep Medicine","Sports Medicine",
  "Surgical Oncology","Telemedicine","Thoracic Surgery","Trauma Surgery","Urgent Care","Urology",
  "Vascular Surgery","Wound Care","Other",
];

const STATES = [
  "AK","AL","AR","AZ","CA","CO","CT","DC","DE","FL","GA","HI","IA","ID","IL","IN","KS","KY","LA","MA",
  "MD","ME","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY","OH","OK","OR","PA","RI",
  "SC","SD","TN","TX","UT","VA","VT","WA","WI","WV","WY",
];

function ReferAFriendPage() {
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
    "w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[15px] text-[var(--deep)] placeholder:text-[var(--muted-foreground)]/70 shadow-sm transition-all focus:outline-none focus:border-[var(--teal)] focus:ring-4 focus:ring-[color:var(--teal)]/15";

  const Label = ({ htmlFor, icon: Icon, children, required }: {
    htmlFor: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode; required?: boolean;
  }) => (
    <label htmlFor={htmlFor} className="flex items-center gap-2 text-sm font-semibold text-[var(--deep)] mb-2">
      <Icon className="h-4 w-4 text-[var(--teal)]" />
      <span>{children}{required && <span className="text-red-500 ml-0.5">*</span>}</span>
    </label>
  );

  const SectionHeader = ({ icon: Icon, title }: { icon: React.ComponentType<{ className?: string }>; title: string }) => (
    <div className="flex items-center gap-4 my-2">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--teal)]/40" />
      <div className="flex items-center gap-2.5 rounded-full border border-[var(--teal)]/25 bg-[var(--ice)] px-5 py-2">
        <Icon className="h-4 w-4 text-[var(--teal)]" />
        <span className="text-sm font-semibold tracking-wide text-[var(--deep)]">{title}</span>
      </div>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--teal)]/40" />
    </div>
  );

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <section className="flex-1 gradient-soft">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 py-16 md:py-24">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
              Referral Program
            </div>
            <h1 className="mt-3 text-3xl md:text-5xl font-bold text-[var(--deep)] tracking-tight">
              Refer a Friend
            </h1>
            <p className="mt-4 text-[var(--muted-foreground)] text-base md:text-lg">
              Know a healthcare professional who'd thrive with Orchard? Share their details below and our team will reach out.
            </p>
          </div>

          <div
            className="mb-8 flex items-center gap-4 rounded-2xl border border-[var(--teal)]/30 bg-[var(--ice)] px-5 py-4 md:px-6 md:py-5 shadow-sm"
          >
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-[var(--shadow-soft)]"
              style={{ background: "linear-gradient(135deg, #1A82CD 0%, #2A95DD 50%, #0C5289 100%)" }}
            >
              <BadgeDollarSign className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--teal)]">
                REFERRAL BONUS OPPORTUNITY
              </div>
              <div className="mt-0.5 text-lg md:text-xl font-bold text-[var(--deep)] leading-snug">
                Earn a $2,000 Bonus for 10 Completed Shifts!
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl bg-white shadow-[var(--shadow-float)] border border-[var(--border)] overflow-hidden">
            <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #1A82CD 0%, #2A95DD 50%, #0C5289 100%)" }} />

            <form
              action="https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8&orgId=00DKc000000Ivmn"
              method="POST"
              className="p-6 md:p-10 space-y-6"
            >
              {/* Hidden Salesforce inputs */}
              <input type="hidden" name="captcha_settings" value='{"keyname":"Google_reCAPTCHA_v2","fallback":"true","orgId":"00DKc000000Ivmn","ts":""}' />
              <input type="hidden" name="oid" value="00DKc000000Ivmn" />
              <input type="hidden" name="retURL" value="https://orchard-site-xi.vercel.app/thank-you" />
              <input type="hidden" name="lead_source" value="Refer a Friend" />
              <input type="hidden" name="Company" value="[Refer a Friend]" />

              {/* Section 1 */}
              <SectionHeader icon={User} title="Your Details" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="first_name" icon={User} required>Your Name</Label>
                  <input id="first_name" name="first_name" maxLength={40} type="text" required placeholder="Enter your first name" className={inputCls} />
                </div>
                <div>
                  <Label htmlFor="last_name" icon={User}>Your Surname</Label>
                  <input id="last_name" name="last_name" maxLength={80} type="text" placeholder="Enter your surname" className={inputCls} />
                </div>
                <div>
                  <Label htmlFor="email" icon={Mail} required>Your Email</Label>
                  <input id="email" name="email" maxLength={80} type="email" required placeholder="your.email@example.com" className={inputCls} />
                </div>
                <div>
                  <Label htmlFor="mobile" icon={Phone} required>Your Phone Number</Label>
                  <input id="mobile" name="mobile" maxLength={40} type="text" required placeholder="+1 (555) 123-4567" className={inputCls} />
                </div>
              </div>

              {/* Section 2 */}
              <SectionHeader icon={Users} title="Your Friend's Details" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="00NWj00000UHs17" icon={User} required>Friend's Name</Label>
                  <input id="00NWj00000UHs17" name="00NWj00000UHs17" maxLength={20} type="text" required placeholder="Enter friend's first name" className={inputCls} />
                </div>
                <div>
                  <Label htmlFor="00NWj00000UHsPJ" icon={User}>Friend's Surname</Label>
                  <input id="00NWj00000UHsPJ" name="00NWj00000UHsPJ" maxLength={20} type="text" placeholder="Enter friend's surname" className={inputCls} />
                </div>
                <div>
                  <Label htmlFor="00NWj00000UHsh3" icon={Mail} required>Friend's Email</Label>
                  <input id="00NWj00000UHsh3" name="00NWj00000UHsh3" maxLength={80} type="text" required placeholder="friend.email@example.com" className={inputCls} />
                </div>
                <div>
                  <Label htmlFor="00NWj00000UHt0P" icon={Phone} required>Friend's Phone Number</Label>
                  <input id="00NWj00000UHt0P" name="00NWj00000UHt0P" type="text" required placeholder="+1 (555) 123-4567" className={inputCls} />
                </div>
                <div>
                  <Label htmlFor="00NWj00000UHYgp" icon={Briefcase} required>Friend's Specialty</Label>
                  <select id="00NWj00000UHYgp" name="00NWj00000UHYgp" required className={inputCls}>
                    <option value="">Select a specialty</option>
                    {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <Label htmlFor="00NWj00000UHNda" icon={MapPin} required>Friend's Location</Label>
                  <select id="00NWj00000UHNda" name="00NWj00000UHNda" required className={inputCls}>
                    <option value="">Select a state</option>
                    {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Section 3 */}
              

              <div>
                <Label htmlFor="00NWj00000UHuAz" icon={FileText} required>Please Mention Your Friend's Specialty</Label>
                <textarea
                  id="00NWj00000UHuAz"
                  name="00NWj00000UHuAz"
                  wrap="soft"
                  required
                  rows={5}
                  placeholder="Please describe your friend's medical specialty, areas of expertise, certifications, and any relevant experience..."
                  className={inputCls + " resize-y min-h-[140px]"}
                />
              </div>

              <div className="flex justify-center pt-2">
                <div className="g-recaptcha" data-sitekey="6LfpApAsAAAAAJGnaVnxcbJVdndYjgJeW_8KPZ_n" />
              </div>

              <button
                type="submit"
                name="submit"
                className="w-full rounded-xl px-6 py-4 text-base font-semibold text-white shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-float)] hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: "linear-gradient(135deg, #1A82CD 0%, #2A95DD 50%, #0C5289 100%)" }}
              >
                Submit Referral
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
