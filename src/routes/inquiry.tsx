import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/inquiry")({
  head: () => ({
    meta: [
      { title: "Inquiry Form — Orchard Healthcare Staffing" },
      { name: "description", content: "Get in touch with Orchard. Send us a message and our team will connect with you about locum tenens opportunities or staffing needs." },
      { property: "og:title", content: "Inquiry Form — Orchard" },
      { property: "og:description", content: "Connect with Orchard's healthcare staffing team." },
      { property: "og:url", content: "/inquiry" },
    ],
    links: [{ rel: "canonical", href: "/inquiry" }],
  }),
  component: InquiryPage,
});

function InquiryPage() {
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
      <Navbar />

      <section className="flex-1 gradient-soft">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-16 md:py-24">
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
              Get in touch
            </div>
            <h1 className="mt-3 text-3xl md:text-5xl font-bold text-[var(--deep)] tracking-tight">
              Connect with Orchard
            </h1>
            <p className="mt-4 text-[var(--muted-foreground)] text-base md:text-lg">
              Tell us a bit about yourself and our team will reach out shortly.
            </p>
          </div>

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
              <input type="hidden" name="retURL" value="http://orchardcorp.com/thank-you" />

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
                  <label htmlFor="company" className={labelCls}>Company</label>
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
                <label htmlFor="00NWj00000FpOpF" className={labelCls}>Message</label>
                <textarea
                  id="00NWj00000FpOpF"
                  name="00NWj00000FpOpF"
                  rows={4}
                  wrap="soft"
                  className={inputCls + " resize-y min-h-[120px]"}
                />
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--ice)] p-4">
                <input
                  type="checkbox"
                  id="sms_opt_in"
                  name="sms_opt_in__c"
                  required
                  className="mt-1 h-5 w-5 flex-none cursor-pointer accent-[var(--teal)]"
                />
                <label htmlFor="sms_opt_in" className="text-xs leading-relaxed text-[var(--muted-foreground)]">
                  By checking this box, you agree to receive SMS messages from Orchard Corp related to Marketing for Job alerts and available temporary healthcare positions and customer care sms and Customer Care for shift confirmations and scheduling updates, Daily reminders or instructions regarding upcoming assignments, Compliance requirements, onboarding, and documentation requests, Follow-up messages regarding job performance or client feedback. You may reply STOP to opt out at any time. Reply to HELP to 847 861 5300 for assistance. Messages and data rates may apply. Message frequency will vary. Learn more on our Privacy Policy page and Terms &amp; Conditions.
                </label>
              </div>

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
        </div>
      </section>

      <Footer />
    </main>
  );
}
