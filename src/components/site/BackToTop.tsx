import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollUp = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={scrollUp}
      className={`fixed bottom-6 right-6 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full text-white shadow-[var(--shadow-float)] transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none"
      }`}
      style={{ background: "#0C5289" }}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
