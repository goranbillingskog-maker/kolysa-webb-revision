import type { ReactNode } from "react";

/**
 * Wraps a word in a hand-drawn SVG underline in the accent color.
 */
export function UnderlineSquiggle({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -bottom-1 left-0 h-[0.35em] w-full text-primary"
      >
        <path
          d="M2 7 C 30 2, 60 10, 95 5 S 160 3, 198 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
