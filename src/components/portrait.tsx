/**
 * Neutral placeholder portrait — a warm circle with serif initials.
 * Replace with a real photograph when available.
 */
export function Portrait({ size = 220 }: { size?: number }) {
  return (
    <svg
      role="img"
      aria-label="Porträttplaceholder för Göran Billingskog"
      viewBox="0 0 220 220"
      width={size}
      height={size}
      className="block"
    >
      <defs>
        <linearGradient id="portrait-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.92 0.02 80)" />
          <stop offset="100%" stopColor="oklch(0.86 0.03 75)" />
        </linearGradient>
      </defs>
      <circle cx="110" cy="110" r="108" fill="url(#portrait-bg)" stroke="oklch(0.42 0.09 155)" strokeWidth="1.5" />
      <text
        x="110"
        y="128"
        textAnchor="middle"
        fontFamily="Fraunces, Georgia, serif"
        fontSize="72"
        fontStyle="italic"
        fill="oklch(0.42 0.09 155)"
      >
        GB
      </text>
    </svg>
  );
}
