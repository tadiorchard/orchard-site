import { Link } from "@tanstack/react-router";
import footerLogo from "@/assets/orchard-logo.png";


export function Footer() {
  return (
    <footer
      className="relative text-white"
      style={{ background: "linear-gradient(160deg, #0C5289 0%, #0F5E9B 50%, #1265A3 100%)" }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20">
        <div className="grid lg:grid-cols-[1.4fr_2fr] gap-12">
          <div>
            <div className="inline-block rounded-xl bg-white px-4 py-3 shadow-[var(--shadow-soft)]">
              <img
                src={footerLogo}
                alt="Orchard — Deeply Rooted In Health"
                className="h-12 w-auto"
              />
            </div>
            <p className="mt-5 text-white/75 leading-relaxed max-w-sm">
              Premium locum tenens staffing. Built by clinicians, for clinicians.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* For Providers */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                For Providers
              </div>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a
                    href="https://orchardcorp.my.site.com/provider/s/jobs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/85 hover:text-white transition-colors"
                  >
                    Browse Jobs
                  </a>
                </li>
                <li>
                  <Link to="/provider-inquiry" className="text-white/85 hover:text-white transition-colors">
                    Providers
                  </Link>
                </li>
                <li>
                  <Link to="/refer-a-friend" className="text-white/85 hover:text-white transition-colors">
                    Refer a Friend
                  </Link>
                </li>
                <li>
                  <a
                    href="https://orchardcorp.my.site.com/provider/s/login/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/85 hover:text-white transition-colors"
                  >
                    Provider Portal
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                Social Media
              </div>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a
                    href="https://linkedin.com/company/orchard-inc-"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/85 hover:text-white transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/OrchardHealthcareStaffing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/85 hover:text-white transition-colors"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@orchardcorp.com"
                    className="text-white/85 hover:text-white transition-colors"
                  >
                    Email
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                Company
              </div>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link to="/about" className="text-white/85 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-white/85 hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/inquiry" className="text-white/85 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-white/60">
          <div>© 2026 Orchard Corp. All rights reserved.</div>
          <div className="flex flex-wrap gap-6">
            <Link to="/sms-terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <Link to="/sms-privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
