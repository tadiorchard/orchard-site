import { Link } from "@tanstack/react-router";
import { ChevronDown, Stethoscope, Building2 } from "lucide-react";
import { Logo } from "./Logo";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 glass-nav">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10 py-4">
        <Link to="/" className="lift">
          <Logo />
        </Link>

        <ul className="hidden md:flex items-center gap-7 text-sm font-medium text-[var(--deep)]">
          <li>
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="group relative">
            <Link to="/services" className="nav-link inline-flex items-center gap-1">
              Services
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
                    <span className="block font-semibold text-[var(--deep)]">For Healthcare Providers</span>
                    <span className="block text-xs text-[var(--muted-foreground)]">Find your next assignment</span>
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
                    <span className="block font-semibold text-[var(--deep)]">For Healthcare Facilities</span>
                    <span className="block text-xs text-[var(--muted-foreground)]">Request staffing &amp; coverage</span>
                  </span>
                </Link>
              </div>
            </div>
          </li>
          <li>
            <a
              href="https://orchardcorp.my.site.com/provider/s/jobs"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
            >
              Job Openings
            </a>
          </li>
          <li>
            <a
              href="https://orchardcorp.my.site.com/provider/s/login/"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
            >
              Physician Portal
            </a>
          </li>
          <li className="group relative">
            <Link to="/about" className="nav-link inline-flex items-center gap-1">
              About
              <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
            </Link>
            {/* Dropdown */}
            <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 translate-y-1 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0">
              <div className="min-w-[190px] rounded-2xl border border-[var(--border)] bg-white p-2 shadow-[var(--shadow-float)]">
                <Link
                  to="/about"
                  className="block rounded-xl px-3 py-2.5 font-semibold text-[var(--deep)] transition-colors hover:bg-[var(--ice)]"
                >
                  About Us
                </Link>
                <Link
                  to="/leadership"
                  className="block rounded-xl px-3 py-2.5 font-semibold text-[var(--deep)] transition-colors hover:bg-[var(--ice)]"
                >
                  Leadership
                </Link>
              </div>
            </div>
          </li>
          <li>
            <Link to="/investors" className="nav-link">Investors</Link>
          </li>
        </ul>

        <Link
          to="/provider-inquiry"
          className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white gradient-teal lift shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-float)]"
        >
          Quick Apply
        </Link>
      </nav>
    </header>
  );
}
