import { useCallback, useEffect, useRef, useState } from "react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "./Reveal";
import aryalImg from "@/assets/angel-17.png";
import herdrichImg from "@/assets/1238-2024-09-11t220313-042.png";
import noggleImg from "@/assets/Todd.png";

type Testimonial = {
  quote: string;
  name: string;
  title?: string;
  image: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Orchard has been fantastic to work with — fast reimbursements, timely payments, and outstanding support. I highly recommend them. It's been a great experience!",
    name: "Anuj M. Aryal, M.D.",
    image: aryalImg,
  },
  {
    quote:
      "As Director of Operations for a large healthcare system, I quickly recognized Orchard as our partner of choice for locum tenens hospitalists. Orchard consistently stood out for their quality outcomes, responsiveness, and strong relationships. When I moved to a new role overseeing 47 physician practices, I again chose Orchard for our staffing needs. They swiftly provided credentialed physicians who contributed to excellent quality metrics and positive patient experiences. Though we have since hired our own team, we value Orchard as a reliable partner when needed.",
    name: "Bob Herdrich, MS, RN",
    title: "Vice President",
    image: herdrichImg,
  },
  {
    quote:
      "Working with Orchard has been a positive experience. Their team consistently delivers excellent service, always responsive, professional, and dedicated to finding the right fit for our needs. They work hard at making the staffing process seamless, and I couldn't be more satisfied with the results. Highly recommend!",
    name: "Todd Noggle, MBA, MS, LPC",
    title: "Healthcare Administrator",
    image: noggleImg,
  },
];

const AUTOPLAY_MS = 5000;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = testimonials.length;

  const goTo = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, count]);

  return (
    <section
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #ffffff 0%, #F4F9FD 60%, #EAF3FB 100%)",
      }}
    >
      {/* soft ambient accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full opacity-[0.08] blur-3xl"
        style={{ background: "#1A82CD" }}
      />

      <div className="relative mx-auto max-w-5xl px-6 lg:px-10">
        {/* Heading */}
        <Reveal className="text-center">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--ocean)]">
            What our partners say
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-[var(--deep)] leading-tight">
            Read firsthand accounts of how we deliver
          </h2>
        </Reveal>

        {/* Carousel */}
        <Reveal delay={120} className="mt-14">
          <div
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ transform: `translateX(-${index * 100}%)` }}
              >
                {testimonials.map((t) => (
                  <figure key={t.name} className="w-full shrink-0 px-1 md:px-3">
                    <div className="glass h-full rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                      {/* Headshot — prominent */}
                      <div className="shrink-0 flex flex-col items-center text-center">
                        <div
                          className="rounded-full p-[3px] shadow-[var(--shadow-float)]"
                          style={{ background: "var(--gradient-brand)" }}
                        >
                          <img
                            src={t.image}
                            alt={t.name}
                            width={192}
                            height={192}
                            loading="lazy"
                            className="h-36 w-36 md:h-48 md:w-48 rounded-full object-cover ring-4 ring-white bg-white"
                          />
                        </div>
                        <div className="mt-5 font-bold text-[var(--deep)] text-lg">
                          {t.name}
                        </div>
                        {t.title && (
                          <div className="mt-0.5 text-sm font-medium text-[var(--ocean)]">
                            {t.title}
                          </div>
                        )}
                      </div>

                      {/* Quote */}
                      <div className="text-center md:text-left">
                        <Quote className="h-9 w-9 text-[var(--ocean)] opacity-25 mx-auto md:mx-0" />
                        <blockquote className="mt-4 text-lg md:text-xl leading-relaxed text-[var(--foreground)]">
                          "{t.quote}"
                        </blockquote>
                      </div>
                    </div>
                  </figure>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="mt-10 flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous testimonial"
                className="cta flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-white text-[var(--deep)] hover:bg-[var(--ice)] shadow-[var(--shadow-soft)]"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2.5">
                {testimonials.map((t, i) => (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    aria-current={i === index}
                    className="h-2.5 rounded-full transition-all duration-300"
                    style={{
                      width: i === index ? "1.75rem" : "0.625rem",
                      background: i === index ? "var(--ocean)" : "var(--border)",
                    }}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={next}
                aria-label="Next testimonial"
                className="cta flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-white text-[var(--deep)] hover:bg-[var(--ice)] shadow-[var(--shadow-soft)]"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
