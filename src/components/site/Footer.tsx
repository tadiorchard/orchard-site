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

/**
 * The link columns as data. Every one of these was previously a hand-written
 * <li> carrying an identical forty-character class string — fifteen copies of
 * it — which is how a footer ends up with one link styled differently from its
 * neighbours after a year of edits.
 *
 * `external` marks the links that leave the site, so they get the target and
 * rel treatment automatically rather than by someone remembering.
 */
type FooterLink = { label: string; to: string; external?: boolean };

const COLUMNS: Array<{ title: string; links: FooterLink[] }> = [
  {
    title: "For Hospitals",
    links: [
      { label: "Request Coverage", to: "/client-inquiry" },
      { label: "Services", to: "/services" },
      { label: "General Inquiry", to: "/inquiry" },
    ],
  },
  {
    title: "For Providers",
    links: [
      { label: "Browse Jobs", to: "/jobs" },
      { label: "Jobs by State & Specialty", to: "/locum-tenens-jobs" },
      { label: "Join Our Network", to: "/provider-inquiry" },
      { label: "Refer a Friend", to: "/refer-a-friend" },
      {
        label: "Provider Portal",
        to: "https://orchardcorp.my.site.com/provider/s/login/",
        external: true,
      },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Leadership", to: "/leadership" },
      { label: "Careers", to: "/careers" },
      { label: "Testimonials", to: "/testimonials" },
      { label: "Investors", to: "/investors" },
      { label: "Contact", to: "/inquiry" },
    ],
  },
];

/*
  Legal links, named for what they actually are.

  The footer used to offer "Terms and Conditions" pointing at /sms-terms and
  "Privacy Policy" pointing at /sms-privacy — so the general terms page was
  unreachable from here, and an SMS-specific policy was being presented as the
  site's privacy policy. For a healthcare vendor whose clients run security
  reviews, that is worse than having no link at all.
*/
const LEGAL: FooterLink[] = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms", to: "/terms" },
  { label: "SMS Terms", to: "/sms-terms" },
  { label: "SMS Privacy", to: "/sms-privacy" },
];

/**
 * One link style, one place. The arrow-free hover shift is deliberate: it
 * signals interactivity without the underline clutter a fifteen-link footer
 * gets from `hover:underline`.
 */
const LINK_CLASS =
  "inline-block py-1 text-[15px] text-white/75 transition-all duration-200 " +
  "hover:translate-x-0.5 hover:text-white focus-visible:outline focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-white focus-visible:rounded-sm";

function FooterLinkItem({ link }: { link: FooterLink }) {
  if (link.external) {
    return (
      <a href={link.to} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
        {link.label}
      </a>
    );
  }
  return (
    <Link to={link.to} className={LINK_CLASS}>
      {link.label}
    </Link>
  );
}

export function Footer() {
  // Rendered, not hardcoded. The previous value was a literal 2026 that would
  // have quietly aged into being wrong.
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative text-white"
      style={{ background: "linear-gradient(160deg, #0C5289 0%, #0F5E9B 50%, #1265A3 100%)" }}
    >
      {/* A hairline of light along the top edge. It separates the footer from
          whatever section ends above it without drawing a hard rule. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.28) 50%, transparent 100%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_2fr] lg:gap-16">
          {/* Identity, contact, social */}
          <div>
            <div className="inline-block rounded-xl bg-white px-4 py-3 shadow-[var(--shadow-soft)]">
              <img
                src={footerLogo}
                alt="Orchard — Deeply Rooted In Health"
                width={224}
                height={48}
                className="h-12 w-auto"
              />
            </div>
            <p className="mt-5 max-w-sm leading-relaxed text-white/75">
              Premium locum tenens and permanent staffing. Built by clinicians, for clinicians.
            </p>

            {/* Phone and email stay spelled out — an icon alone would hide the
                two details a visitor wants to read or copy. Both are real
                links, so a phone taps to dial rather than forcing a select. */}
            <div className="mt-7 flex flex-col items-start gap-1">
              <a
                href="tel:+18478615300"
                className="group inline-flex items-center gap-3 py-1.5 text-[15px] text-white/85 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white focus-visible:rounded-sm"
              >
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15 transition-colors group-hover:bg-white/20">
                  <Phone className="h-4 w-4" strokeWidth={1.8} aria-hidden />
                </span>
                847 861 5300
              </a>
              <a
                href="mailto:info@orchardcorp.com"
                className="group inline-flex items-center gap-3 py-1.5 text-[15px] text-white/85 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white focus-visible:rounded-sm"
              >
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15 transition-colors group-hover:bg-white/20">
                  <Mail className="h-4 w-4" strokeWidth={1.8} aria-hidden />
                </span>
                info@orchardcorp.com
              </a>
            </div>

            {/* Social as brand marks rather than a text column. Each needs an
                aria-label — the glyph is the link's only content. */}
            <div className="mt-7 flex items-center gap-3">
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
                  className={`block h-10 w-10 overflow-hidden bg-white ring-1 ring-white/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] hover:ring-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${shape}`}
                >
                  <svg viewBox="0 0 24 24" className="h-full w-full" fill={color} aria-hidden>
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns. Each is its own landmark so a screen reader can skip
              between them instead of walking fifteen links in one list. */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
                  {col.title}
                </h2>
                <ul className="mt-4 space-y-1.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <FooterLinkItem link={link} />
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/15 pt-8 text-xs text-white/55 md:flex-row md:items-center">
          <div>© {year} Orchard Corp. All rights reserved.</div>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white focus-visible:rounded-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
