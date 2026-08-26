import { Link } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";
import footerLogo from "@/assets/orchard-logo.png";

/**
 * The brands' own marks rather than generic glyphs, so each reads as itself.
 * Both paths draw the tile with the letter cut OUT of it, which is why the
 * link carries a white background: the letter shows white through the cut,
 * exactly as the brands publish them. `shape` matches each mark's silhouette
 * so no white corner peeks out from behind.
 */
export const socials = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/orchard-inc-",
    color: "#0A66C2",
    shape: "rounded-[3px]",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/OrchardHealthcareStaffing",
    color: "#1877F2",
    shape: "rounded-full",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
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
              Premium locum tenens and permanent staffing. Built by clinicians, for
              clinicians.
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
              {socials.map(({ label, href, color, shape, path }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  /* ring-white/25 keeps a brand blue from dissolving into the
                     footer's blue; both marks sit close to it. */
                  className={`block h-11 w-11 overflow-hidden bg-white ring-1 ring-white/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] hover:ring-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${shape}`}
                >
                  <svg viewBox="0 0 24 24" className="h-full w-full" fill={color} aria-hidden>
                    <path d={path} />
                  </svg>
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
                    Services
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
                    to="/locum-tenens-jobs"
                    className="inline-block py-1 text-white/85 hover:text-white transition-colors"
                  >
                    Jobs by State &amp; Specialty
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
                    to="/investors"
                    className="inline-block py-1 text-white/85 hover:text-white transition-colors"
                  >
                    Investors
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
