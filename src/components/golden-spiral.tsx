"use client";

/**
 * Fibonacci / golden-ratio spiral — hero visual for the guidance-lab aesthetic.
 * Pure SVG + CSS; respects prefers-reduced-motion.
 */
export function GoldenSpiral({ className = "" }: { className?: string }) {
  // Approximate logarithmic spiral (φ) as quadratic segments in a 200×200 viewBox
  const path =
    "M100 100 L100 62 Q100 38 76 38 L38 38 Q14 38 14 62 L14 100 Q14 162 76 162 L138 162 Q186 162 186 100 L186 62 Q186 14 138 14 L76 14 Q-10 14 -10 100 L-10 186 Q-10 270 76 270";

  return (
    <svg
      className={`golden-spiral ${className}`}
      viewBox="0 0 200 200"
      role="img"
      aria-label="Golden ratio spiral animation"
    >
      <defs>
        <linearGradient id="spiralStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.15" />
          <stop offset="55%" stopColor="var(--accent)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      {/* φ rectangles: 1, φ^{-1}, φ^{-2}, … */}
      <g className="phi-rects" fill="none" stroke="var(--border)" strokeWidth="0.6">
        <rect x="38" y="38" width="124" height="124" />
        <rect x="38" y="38" width="76.6" height="76.6" />
        <rect x="114.6" y="38" width="47.4" height="47.4" />
        <rect x="114.6" y="85.4" width="29.3" height="29.3" />
        <rect x="132.7" y="85.4" width="18.1" height="18.1" />
        <rect x="132.7" y="103.5" width="11.2" height="11.2" />
      </g>
      <path
        className="spiral-path"
        d="M38 162 A62 62 0 0 1 100 100 A38.2 38.2 0 0 1 138.2 61.8 A23.6 23.6 0 0 1 161.8 85.4 A14.6 14.6 0 0 1 147.2 100 A9 9 0 0 1 138.2 91 A5.6 5.6 0 0 1 143.8 85.4"
        fill="none"
        stroke="url(#spiralStroke)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle className="spiral-core" cx="100" cy="100" r="2.2" fill="var(--accent)" />
      <text
        x="12"
        y="192"
        className="spiral-caption"
        fill="var(--muted)"
        fontSize="7"
        fontFamily="var(--font-mono)"
      >
        φ = 1.618 · path following
      </text>
      {/* keep unused path string reference for future animation tooling */}
      <path d={path} fill="none" stroke="none" aria-hidden="true" />
    </svg>
  );
}
