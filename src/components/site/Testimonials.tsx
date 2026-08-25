import { useCallback, useEffect, useRef, useState } from "react";
import { Quote, Stethoscope, Building2 } from "lucide-react";
import { Reveal } from "./Reveal";
import herdrichImg from "@/assets/1238-2024-09-11t220313-042.png";
import noggleImg from "@/assets/Todd.png";

type Testimonial = {
  quote: string;
  name: string;
  title?: string;
  /** Which side of the placement they sit on — a physician is not a client. */
  kind: "Provider" | "Client";
  /** Omit to show the stethoscope emblem instead of a headshot. */
  image?: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Orchard has been fantastic to work with — fast reimbursements, timely payments, and outstanding support. I highly recommend them. It's been a great experience!",
    name: "A. M. A., MD",
    kind: "Provider",
  },
  {
    quote:
      "As Director of Operations for a large healthcare system, I quickly recognized Orchard as our partner of choice for locum tenens hospitalists. Orchard consistently stood out for their quality outcomes, responsiveness, and strong relationships. When I moved to a new role overseeing 47 physician practices, I again chose Orchard for our staffing needs. They swiftly provided credentialed physicians who contributed to excellent quality metrics and positive patient experiences. Though we have since hired our own team, we value Orchard as a reliable partner when needed.",
    name: "Bob",
    title: "Vice President",
    kind: "Client",
    image: herdrichImg,
  },
  {
    quote:
      "It has been a true pleasure working with you and your team. I completely understand that some processes take a little extra time, but I really appreciate Orchard's dedication, responsiveness, and partnership throughout it all. Your support made a big difference!",
    name: "T. N.",
    title: "Sr. Credentialing Partner",
    kind: "Client",
  },
  {
    quote:
      "Working with Orchard has been a positive experience. Their team consistently delivers excellent service, always responsive, professional, and dedicated to finding the right fit for our needs. They work hard at making the staffing process seamless, and I couldn't be more satisfied with the results. Highly recommend!",
    name: "Todd",
    title: "Healthcare Administrator",
    kind: "Client",
    image: noggleImg,
  },
  {
    quote:
      "It has been a while since I've seen such a meticulously completed application! Thank you all for your consistent collaboration; it makes this process much smoother and easier for everyone.",
    name: "T. N.",
    title: "Sr. Credentialing Partner",
    kind: "Client",
  },
];

const AUTOPLAY_MS = 6000;
/** One card per slide. The layout below is written to match — change both. */
const PER_PAGE = 1;

/** Card plus the attribution that sits beneath it, outside the card. */
function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="flex flex-col">
      <div className="relative">
        {/* Badge overlapping the card's top edge. The reference puts a star
            rating here; these testimonials carry no rating, so inventing one
            was not an option — the mark keeps the shape without the claim. */}
        <span
          className="absolute -top-4 left-7 z-10 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-white shadow-[var(--shadow-soft)]"
          style={{ background: t.kind === "Provider" ? "var(--teal)" : "var(--ocean)" }}
        >
          {t.kind === "Provider" ? (
            <Stethoscope className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden />
          ) : (
            <Building2 className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden />
          )}
          <span className="text-[10px] font-bold uppercase tracking-[0.14em]">{t.kind}</span>
        </span>

        <div className="rounded-[1.75rem] bg-white px-8 pb-8 pt-10 shadow-[var(--shadow-soft)]">
          <blockquote className="text-[15px] leading-relaxed text-[var(--muted-foreground)] md:text-base">
            {t.quote}
          </blockquote>
        </div>
      </div>

      <figcaption className="mt-7 flex items-center gap-4 px-2">
        {t.image ? (
          <img
            src={t.image}
            alt={t.name}
            width={112}
            height={112}
            loading="lazy"
            className="h-14 w-14 flex-none rounded-full bg-white object-cover ring-2 ring-white shadow-[var(--shadow-soft)]"
          />
        ) : (
          <span className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-[var(--ice)] ring-2 ring-white shadow-[var(--shadow-soft)]">
            <Stethoscope className="h-6 w-6 text-[var(--ocean)]" strokeWidth={1.6} aria-hidden />
          </span>
        )}
        <span className="min-w-0">
          <span className="block text-[17px] font-bold leading-tight text-[var(--ocean)]">
            {t.name}
          </span>
          {t.title && (
            <span className="mt-0.5 block text-sm text-[var(--muted-foreground)]">{t.title}</span>
          )}
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const pages: Testimonial[][] = [];
  for (let i = 0; i < testimonials.length; i += PER_PAGE) {
    pages.push(testimonials.slice(i, i + PER_PAGE));
  }

  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = pages.length;

  const goTo = useCallback((i: number) => setPage(((i % count) + count) % count), [count]);

  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (paused || count < 2) return;
    timer.current = setInterval(() => setPage((p) => (p + 1) % count), AUTOPLAY_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, count]);

  return (
    <section
      className="relative overflow-hidden py-24 lg:py-32"
      style={{ background: "linear-gradient(180deg, #ffffff 0%, #F4F9FD 60%, #EAF3FB 100%)" }}
    >
      {/* Oversized outline quote marks, as in the reference */}
      <svg
        aria-hidden
        viewBox="0 0 200 100"
        className="pointer-events-none absolute -top-2 right-4 h-52 w-auto text-[var(--ocean)] opacity-[0.07] lg:right-16 lg:h-64"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      >
        <path d="M20 78c-9 0-16-7-16-16s7-16 16-16 16 7 16 16c0 18-11 30-27 34m73-18c-9 0-16-7-16-16s7-16 16-16 16 7 16 16c0 18-11 30-27 34" />
        <path d="M120 78c-9 0-16-7-16-16s7-16 16-16 16 7 16 16c0 18-11 30-27 34m73-18c-9 0-16-7-16-16s7-16 16-16 16 7 16 16c0 18-11 30-27 34" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ocean)]">
            <Quote className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
            Testimonials
          </span>
          <h2 className="mt-4 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-[var(--deep)] md:text-4xl lg:text-[2.75rem]">
            Read firsthand accounts of how we deliver
          </h2>
        </Reveal>

        <Reveal delay={120} className="mt-12">
          {/* Pausing on hover keeps a long quote readable. */}
          <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            {/*
              The quotes run from one sentence to a full paragraph, so the box
              has to take the active quote's height and nothing else. Only the
              active slide stays in flow; the rest are taken out of it, so the
              box measures exactly one card without any JS measuring it.

              -mx-1 px-1 keeps the card shadow from being shaved off.
            */}
            <div className="relative -mx-1 overflow-hidden px-1">
              {pages.map((group, gi) => (
                <div
                  key={gi}
                  aria-hidden={gi !== page}
                  className={
                    gi === page
                      ? "relative opacity-100 transition-opacity duration-500 ease-out"
                      : "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out"
                  }
                >
                  {/* Capped and centred: a single card left full-width
                      would run these quotes to an unreadable measure. */}
                  <div className="mx-auto grid max-w-3xl gap-8 px-1 pt-6">
                    {group.map((t, ti) => (
                      <TestimonialCard key={gi * PER_PAGE + ti} t={t} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {count > 1 && (
              <div className="mt-10 flex items-center justify-center gap-0.5">
                {pages.map((_, i) => (
                  /* The dot is small, so the button carries a full-height hit
                     area around it — the dot alone is too small to tap. */
                  <button
                    key={i}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Go to testimonials, page ${i + 1}`}
                    aria-current={i === page}
                    className="flex h-11 items-center justify-center px-1.5"
                  >
                    <span
                      className="block h-2.5 rounded-full transition-all duration-300"
                      style={{
                        width: i === page ? "1.75rem" : "0.625rem",
                        background: i === page ? "var(--ocean)" : "var(--border)",
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
