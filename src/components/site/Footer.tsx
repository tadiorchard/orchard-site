import { Link } from "@tanstack/react-router";
import { Facebook, Linkedin, Mail, Phone } from "lucide-react";
import footerLogo from "@/assets/orchard-logo.png";

const socials = [
  { label: "LinkedIn", href: "https://linkedin.com/company/orchard-inc-", Icon: Linkedin },
  { label: "Facebook", href: "https://www.facebook.com/OrchardHealthcareStaffing", Icon: Facebook },
];

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

            {/* Phone and address stay spelled out — an icon would hide the two
                details a visitor wants to read or copy. Both are real links, so
                a phone taps to dial rather than forcing a copy-paste. */}
            <div className="mt-6 flex flex-col items-start gap-3">
              <a
                href="tel:+18478615300"
                className="inline-flex items-center gap-2.5 text-sm text-white/85 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4 flex-none" strokeWidth={1.8} aria-hidden />
                847 861 5300
              </a>
              <a
                href="mailto:info@orchardcorp.com"
                className="inline-flex items-center gap-2.5 text-sm text-white/85 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4 flex-none" strokeWidth={1.8} aria-hidden />
                info@orchardcorp.com
              </a>
            </div>

            {/* Social as icons rather than a text column. Each needs an
                aria-label — the glyph is the link's only content. */}
            <div className="mt-6 flex items-center gap-3">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-[var(--ocean)] hover:shadow-[var(--shadow-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} aria-hidden />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* For Hospitals */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                For Hospitals
              </div>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link
                    to="/client-inquiry"
                    className="inline-block py-1 text-white/85 hover:text-white transition-colors"
                  >
                    Request Coverage
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="inline-block py-1 text-white/85 hover:text-white transition-colors"
                  >
                    All Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/staffing"
                    className="inline-block py-1 text-white/85 hover:text-white transition-colors"
                  >
                    Staffing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/inquiry"
                    className="inline-block py-1 text-white/85 hover:text-white transition-colors"
                  >
                    General Inquiry
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Providers */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                For Providers
              </div>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link
                    to="/jobs"
                    className="inline-block py-1 text-white/85 hover:text-white transition-colors"
                  >
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/provider-inquiry"
                    className="inline-block py-1 text-white/85 hover:text-white transition-colors"
                  >
                    Join Our Network
                  </Link>
                </li>
                <li>
                  <Link
                    to="/refer-a-friend"
                    className="inline-block py-1 text-white/85 hover:text-white transition-colors"
                  >
                    Refer a Friend
                  </Link>
                </li>
                <li>
                  <a
                    href="https://orchardcorp.my.site.com/provider/s/login/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block py-1 text-white/85 hover:text-white transition-colors"
                  >
                    Provider Portal
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
                  <Link
                    to="/about"
                    className="inline-block py-1 text-white/85 hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className="inline-block py-1 text-white/85 hover:text-white transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/inquiry"
                    className="inline-block py-1 text-white/85 hover:text-white transition-colors"
                  >
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
            <Link to="/sms-terms" className="hover:text-white transition-colors">
              Terms and Conditions
            </Link>
            <Link to="/sms-privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
