import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronDown, Stethoscope, Building2, Leaf, Users, Menu, X,
  Briefcase, LogIn, Gift,
} from "lucide-react";
import { Logo } from "./Logo";

/**
 * `overlay` makes the bar sit *on top of* the hero: transparent at the top of
 * the page, switching to the frosted bar once scrolled. `tone` is the hero's
 * brightness, which decides whether the transparent state uses white or deep
 * text — pass "light" on pages whose first section is light, or the white text
 * will disappear against it. Pages using `overlay` must leave room for the bar
 * in their hero's top padding, since a fixed header takes no space in flow.
 */
export function Navbar({
  overlay = false,
  tone = "dark",
}: {
  overlay?: boolean;
  tone?: "dark" | "light";
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  // Lock body scroll + close on Escape while the mobile menu is open
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const clear = overlay && !scrolled;
  // Only a clear bar over a *dark* hero needs the inverted (white) treatment.
  const inverted = clear && tone === "dark";
  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`${overlay ? "fixed" : "sticky"} top-0 left-0 right-0 z-50 transition-all duration-300 ${
        clear ? "bg-transparent" : "glass-nav"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10 py-4">
        <Link to="/" className="lift">
          <Logo variant={inverted ? "light" : "default"} />
        </Link>

        <ul
          className={`hidden lg:flex items-center gap-7 text-sm font-medium transition-colors duration-300 ${
            inverted ? "text-white" : "text-[var(--deep)]"
          }`}
        >
          <li>
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="group relative">
            <Link to="/services" className="nav-link inline-flex items-center gap-1">
              Staffing Solutions
              <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
            </Link>
            {/* Dropdown */}
            <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 translate-y-1 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0">
              <div className="min-w-[264px] rounded-2xl border border-[var(--border)] bg-white p-2 shadow-[var(--shadow-float)]">
                <Link
                  to="/provider-inquiry"
                  className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--ice)]"
                >
                  <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-lg gradient-teal text-white shadow-sm">
                    <Stethoscope className="h-5 w-5" strokeWidth={1.7} />
                  </span>
                  <span>
                    <span className="block font-semibold text-[var(--deep)]">
                      For Healthcare Providers
                    </span>
                    <span className="block text-xs text-[var(--muted-foreground)]">
                      Find your next assignment
                    </span>
                  </span>
                </Link>
                <Link
                  to="/client-inquiry"
                  className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--ice)]"
                >
                  <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-lg gradient-teal text-white shadow-sm">
                    <Building2 className="h-5 w-5" strokeWidth={1.7} />
                  </span>
                  <span>
                    <span className="block font-semibold text-[var(--deep)]">
                      For Healthcare Facilities
                    </span>
                    <span className="block text-xs text-[var(--muted-foreground)]">
                      Request staffing &amp; coverage
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </li>
          <li>
            <Link to="/jobs" className="nav-link">
              Open Jobs
            </Link>
          </li>
          <li className="group relative">
            <Link to="/provider-inquiry" className="nav-link inline-flex items-center gap-1">
              For Providers
              <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
            </Link>
            {/* Dropdown */}
            <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 translate-y-1 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0">
              <div className="min-w-[276px] rounded-2xl border border-[var(--border)] bg-white p-2 shadow-[var(--shadow-float)]">
                <Link
                  to="/jobs"
                  className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--ice)]"
                >
                  <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-lg gradient-teal text-white shadow-sm">
                    <Briefcase className="h-5 w-5" strokeWidth={1.7} />
                  </span>
                  <span>
                    <span className="block font-semibold text-[var(--deep)]">
                      Find an Assignment
                    </span>
                    <span className="block text-xs text-[var(--muted-foreground)]">
                      Browse every live role
                    </span>
                  </span>
                </Link>
                <a
                  href="https://orchardcorp.my.site.com/provider/s/login/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--ice)]"
                >
                  <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-lg gradient-teal text-white shadow-sm">
                    <LogIn className="h-5 w-5" strokeWidth={1.7} />
                  </span>
                  <span>
                    <span className="block font-semibold text-[var(--deep)]">Physician Portal</span>
                    <span className="block text-xs text-[var(--muted-foreground)]">
                      Sign in to your account
                    </span>
                  </span>
                </a>
                <Link
                  to="/refer-a-friend"
                  className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--ice)]"
                >
                  <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-lg gradient-teal text-white shadow-sm">
                    <Gift className="h-5 w-5" strokeWidth={1.7} />
                  </span>
                  <span>
                    <span className="block font-semibold text-[var(--deep)]">Refer a Friend</span>
                    <span className="block text-xs text-[var(--muted-foreground)]">
                      Earn $2,000 per referral
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </li>
          <li className="group relative">
            <Link to="/about" className="nav-link inline-flex items-center gap-1">
              About
              <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
            </Link>
            {/* Dropdown */}
            <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 translate-y-1 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0">
              <div className="min-w-[264px] rounded-2xl border border-[var(--border)] bg-white p-2 shadow-[var(--shadow-float)]">
                <Link
                  to="/about"
                  className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--ice)]"
                >
                  <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-lg gradient-teal text-white shadow-sm">
                    <Leaf className="h-5 w-5" strokeWidth={1.7} />
                  </span>
                  <span>
                    <span className="block font-semibold text-[var(--deep)]">About Us</span>
                    <span className="block text-xs text-[var(--muted-foreground)]">
                      Our story, mission &amp; values
                    </span>
                  </span>
                </Link>
                <Link
                  to="/leadership"
                  className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--ice)]"
                >
                  <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-lg gradient-teal text-white shadow-sm">
                    <Users className="h-5 w-5" strokeWidth={1.7} />
                  </span>
                  <span>
                    <span className="block font-semibold text-[var(--deep)]">Leadership</span>
                    <span className="block text-xs text-[var(--muted-foreground)]">
                      The team behind Orchard
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </li>
          <li>
            <Link to="/investors" className="nav-link">
              Investors
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-3">
          <Link
            to="/inquiry"
            className="hidden lg:inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white gradient-teal lift shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-float)]"
          >
            Get in Touch
          </Link>

          {/* Hamburger — mobile only */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className={`lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
              inverted ? "text-white hover:bg-white/10" : "text-[var(--deep)] hover:bg-[var(--ice)]"
            }`}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile menu — full-screen slide-in */}
      <div
        className={`lg:hidden fixed inset-0 z-[60] flex flex-col bg-white transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <Link to="/" onClick={closeMenu} className="lift">
            <Logo />
          </Link>
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[var(--deep)] hover:bg-[var(--ice)] transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 py-6">
          <Link
            to="/"
            onClick={closeMenu}
            className="block py-3 text-lg font-semibold text-[var(--deep)]"
          >
            Home
          </Link>

          <div className="mt-4 mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ocean)]">
            Staffing Solutions
          </div>
          <Link
            to="/provider-inquiry"
            onClick={closeMenu}
            className="block py-3 text-lg font-semibold text-[var(--deep)]"
          >
            For Healthcare Providers
          </Link>
          <Link
            to="/client-inquiry"
            onClick={closeMenu}
            className="block py-3 text-lg font-semibold text-[var(--deep)]"
          >
            For Healthcare Facilities
          </Link>

          <Link
            to="/jobs"
            onClick={closeMenu}
            className="block py-3 text-lg font-semibold text-[var(--deep)]"
          >
            Open Jobs
          </Link>

          <div className="mt-4 mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ocean)]">
            For Providers
          </div>
          <Link
            to="/jobs"
            onClick={closeMenu}
            className="block py-3 text-lg font-semibold text-[var(--deep)]"
          >
            Find an Assignment
          </Link>
          <a
            href="https://orchardcorp.my.site.com/provider/s/login/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="block py-3 text-lg font-semibold text-[var(--deep)]"
          >
            Physician Portal
          </a>
          <Link
            to="/refer-a-friend"
            onClick={closeMenu}
            className="block py-3 text-lg font-semibold text-[var(--deep)]"
          >
            Refer a Friend
          </Link>

          <div className="mt-4 mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ocean)]">
            About
          </div>
          <Link
            to="/about"
            onClick={closeMenu}
            className="block py-3 text-lg font-semibold text-[var(--deep)]"
          >
            About Us
          </Link>
          <Link
            to="/leadership"
            onClick={closeMenu}
            className="block py-3 text-lg font-semibold text-[var(--deep)]"
          >
            Leadership
          </Link>

          <Link
            to="/investors"
            onClick={closeMenu}
            className="mt-1 block py-3 text-lg font-semibold text-[var(--deep)]"
          >
            Investors
          </Link>
        </nav>

        <div className="px-6 py-5 border-t border-[var(--border)]">
          <Link
            to="/inquiry"
            onClick={closeMenu}
            className="flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-bold text-white gradient-teal shadow-[var(--shadow-soft)]"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </header>
  );
}
