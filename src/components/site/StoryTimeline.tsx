import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Reveal } from "./Reveal";
import { eras } from "@/lib/timeline";

/**
 * Eighteen milestones is a lot to face at once, so each era collapses to its
 * summary and opens on demand.
 *
 * The entries inside are plain markup rather than Reveal-wrapped: Reveal holds
 * elements at zero opacity until an IntersectionObserver fires, and an observer
 * on collapsed, overflow-hidden content may never fire — which would leave the
 * entries invisible after expanding.
 */
export function StoryTimeline() {
  const [open, setOpen] = useState<number[]>([]);
  const toggle = (i: number) =>
    setOpen((prev) => (prev.includes(i) ? prev.filter((n) => n !== i) : [...prev, i]));

  return (
    <div className="space-y-5">
      {eras.map((era, ei) => {
        const isOpen = open.includes(ei);
        const panelId = `era-panel-${ei}`;
        return (
          <Reveal
            key={era.name}
            delay={ei * 90}
            className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow-soft)]"
          >
            <button
              type="button"
              onClick={() => toggle(ei)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="group flex w-full items-start gap-5 p-6 text-left transition-colors hover:bg-[var(--ice)]/50 md:p-8"
            >
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--teal)]">
                    Era {["One", "Two", "Three"][ei] ?? ei + 1}
                  </span>
                  <span className="text-sm font-bold tabular-nums text-[var(--muted-foreground)]">
                    {era.range}
                  </span>
                </span>
                <span className="mt-2 block text-2xl font-bold tracking-tight text-[var(--deep)] md:text-3xl">
                  {era.name}
                </span>
                <span className="mt-2 block text-[15px] leading-relaxed text-[var(--muted-foreground)]">
                  {era.tagline}
                </span>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--ocean)]">
                  {isOpen ? "Hide" : "View"} {era.entries.length} milestones
                </span>
              </span>

              <span
                className={`mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-full text-white shadow-[var(--shadow-soft)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[var(--shadow-float)] ${
                  isOpen ? "rotate-180" : ""
                }`}
                style={{ background: "linear-gradient(135deg, #1A82CD 0%, #2A95DD 55%, #0C5289 100%)" }}
              >
                <ChevronDown className="h-5 w-5" strokeWidth={2.4} />
              </span>
            </button>

            {/* 0fr -> 1fr animates height without measuring anything in JS. */}
            <div
              id={panelId}
              className={`grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <ol className="border-t border-[var(--border)] px-6 py-7 md:px-8">
                  {era.entries.map((m, i) => (
                    <li
                      key={`${m.year}-${m.title}`}
                      className="relative grid gap-x-6 gap-y-2 pb-7 pl-8 last:pb-0 sm:grid-cols-[5.5rem_1fr] sm:pl-0"
                    >
                      <span
                        aria-hidden
                        className={`absolute left-[7px] top-2 w-px bg-[var(--border)] sm:hidden ${
                          i === era.entries.length - 1 ? "h-0" : "h-full"
                        }`}
                      />
                      <span
                        aria-hidden
                        className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[var(--ocean)] bg-white sm:hidden"
                      />
                      <span className="text-sm font-bold tabular-nums text-[var(--ocean)] sm:pt-0.5">
                        {m.year}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[17px] font-bold leading-snug text-[var(--deep)]">
                          {m.title}
                        </span>
                        <span className="mt-2 block max-w-3xl text-[15px] leading-relaxed text-[var(--muted-foreground)]">
                          {m.body}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
