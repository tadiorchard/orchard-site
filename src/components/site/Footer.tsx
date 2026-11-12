import { Link } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";
import footerLogo from "@/assets/orchard-logo.png";
import { LINKEDIN_COMPANY } from "@/lib/seo";

/**
 * The brands' own marks rather than generic glyphs, so each reads as itself.
 *
 * Each entry owns both halves of its badge: `tile` is what sits behind the
 * mark, `mark` is the artwork drawn on it. LinkedIn and Facebook publish their
 * marks as a coloured tile with the letter cut OUT, so those keep a white tile
 * and the cut shows white through it. WhatsApp and Instagram publish the
 * reverse — a coloured badge with a white glyph on top — so their tile carries
 * the brand colour and the mark is drawn in white. Instagram's badge is a
 * gradient rather than a flat colour, which is why `tile` is a CSS background
 * string and not a hex value.
 *
 * `shape` matches each mark's silhouette so no corner peeks out from behind,
 * and the white-tile marks are drawn full-bleed while the coloured-badge marks
 * are inset, matching how each brand spaces its own glyph.
 */
export const socials = [
  {
    label: "LinkedIn",
    href: LINKEDIN_COMPANY,
    tile: "#FFFFFF",
    shape: "rounded-[3px]",
    mark: (
      <path
        fill="#0A66C2"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      />
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/OrchardHealthcareStaffing",
    tile: "#FFFFFF",
    shape: "rounded-full",
    mark: (
      <path
        fill="#1877F2"
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    ),
  },
  {
    label: "WhatsApp Channel",
    href: "https://whatsapp.com/channel/0029Vb9CpovFi8xhcEIJ1W3o",
    tile: "#25D366",
    shape: "rounded-full",
    // The bubble silhouette with the handset cut out of it (evenodd), drawn in
    // white on the green badge — the icon WhatsApp publishes for links like
    // this one. Inset to 74% so the bubble breathes inside the circle.
    mark: (
      <g transform="translate(3.12 3.12) scale(.74)">
        <path
          fill="#FFFFFF"
          fillRule="evenodd"
          d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M20.52 3.449A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"
        />
      </g>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/orchard.2026/",
    // Instagram's badge is a corner-to-corner gradient, not one colour. These
    // are the stops from their own brand assets.
    tile: "radial-gradient(circle at 30% 107%, #FDF497 0%, #FDF497 5%, #FD5949 45%, #D6249F 60%, #285AEB 90%)",
    shape: "rounded-[9px]",
    // Drawn rather than cut out: the camera is three strokes on the gradient,
    // which is how Instagram publishes the glyph version of the mark.
    mark: (
      <g transform="translate(2.64 2.64) scale(.78)">
        <rect
          x="2.6"
          y="2.6"
          width="18.8"
          height="18.8"
          rx="5.4"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
        />
        <circle cx="12" cy="12" r="4.1" fill="none" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="17.1" cy="6.9" r="1.3" fill="#FFFFFF" />
      </g>
    ),
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
      { label: "Insights & Resources", to: "/insights" },
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
              {socials.map(({ label, href, tile, shape, mark }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  /* ring-white/25 keeps a brand blue from dissolving into the
                     footer's blue; several marks sit close to it. */
                  className={`block h-10 w-10 overflow-hidden ring-1 ring-white/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] hover:ring-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${shape}`}
                  style={{ background: tile }}
                >
                  <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden>
                    {mark}
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
