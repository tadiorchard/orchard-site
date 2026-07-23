import { useEffect, useState } from "react";

type Props = {
  words: string[];
  /** ms each word stays on screen */
  interval?: number;
  className?: string;
};

/**
 * Swaps one word inside an otherwise fixed headline. Renders words[0] on the
 * server so there's no hydration mismatch, and holds still entirely for users
 * who prefer reduced motion.
 */
export function RotatingWord({ words, interval = 2800, className = "" }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length < 2) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      interval,
    );
    return () => window.clearInterval(id);
  }, [words.length, interval]);

  return (
    <span
      // key forces a remount so the entrance animation replays on each swap
      key={index}
      className={`rotating-word ${className}`}
    >
      {words[index]}
    </span>
  );
}
