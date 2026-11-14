type MarkProps = { title: string };

export function ViolinMark({ title }: MarkProps) {
  return (
    <svg className="interest-svg" viewBox="0 0 160 220" role="img" aria-label={title}>
      <path
        d="M80 34c10 0 16 8 14 16-2 8-12 10-16 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M80 50v28"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M80 78c28 0 46 22 40 46-4 16-20 20-20 36 0 16 18 22 14 42-4 20-64 20-68 0-4-20 14-26 14-42 0-16-16-20-20-36-6-24 12-46 40-46z"
        fill="color-mix(in oklab, currentColor 12%, transparent)"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M66 118c3 14 3 28 0 42M94 118c-3 14-3 28 0 42"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M62 156h36"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M74 36v156M80 36v160M86 36v156"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.7"
      />
      <circle cx="80" cy="196" r="3" fill="currentColor" />
    </svg>
  );
}

export function PhysicalAiMark({ title }: MarkProps) {
  return (
    <svg className="interest-svg" viewBox="0 0 200 180" role="img" aria-label={title}>
      <ellipse
        cx="100"
        cy="156"
        rx="62"
        ry="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.45"
      />
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="100" cy="36" r="10" />
        <path d="M100 46v36" />
        <path d="M100 58l-28 22M100 58l28 18" />
        <circle cx="72" cy="80" r="3.2" fill="currentColor" />
        <circle cx="128" cy="76" r="3.2" fill="currentColor" />
        <path d="M72 80l-16 22M128 76l18 8" />
        <path d="M88 82l-10 48M112 82l12 46" />
        <circle cx="78" cy="130" r="3" fill="currentColor" />
        <circle cx="124" cy="128" r="3" fill="currentColor" />
      </g>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeDasharray="3 3"
        opacity="0.55"
      >
        <path d="M118 40c18 6 28 22 24 40" />
        <path d="M132 78l22 16" />
        <path d="M126 90l16 40" />
      </g>
      <path
        d="M118 28c22 4 36 24 32 46"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.8"
      />
    </svg>
  );
}

export function MachineLearningMark({ title }: MarkProps) {
  return (
    <svg className="interest-svg" viewBox="0 0 220 160" role="img" aria-label={title}>
      <path
        d="M20 110c30-50 60-60 90-30s50 10 90-20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        opacity="0.55"
      />
      {[
        [46, 40],
        [46, 80],
        [46, 120],
      ].map(([x, y]) => (
        <circle key={`a${x}${y}`} cx={x} cy={y} r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
      ))}
      {[
        [110, 28],
        [110, 62],
        [110, 96],
        [110, 130],
      ].map(([x, y]) => (
        <circle key={`b${x}${y}`} cx={x} cy={y} r="7" fill="color-mix(in oklab, currentColor 16%, transparent)" stroke="currentColor" strokeWidth="1.5" />
      ))}
      {[
        [174, 52],
        [174, 96],
      ].map(([x, y]) => (
        <circle key={`c${x}${y}`} cx={x} cy={y} r="8" fill="none" stroke="currentColor" strokeWidth="1.6" />
      ))}
      <g stroke="currentColor" strokeWidth="0.6" opacity="0.35">
        {[40, 80, 120].map((y1) =>
          [28, 62, 96, 130].map((y2) => (
            <line key={`${y1}-${y2}`} x1="53" y1={y1} x2="103" y2={y2} />
          )),
        )}
        {[28, 62, 96, 130].map((y1) =>
          [52, 96].map((y2) => (
            <line key={`o${y1}-${y2}`} x1="117" y1={y1} x2="166" y2={y2} />
          )),
        )}
      </g>
    </svg>
  );
}

export function ReinforcementMark({ title }: MarkProps) {
  return (
    <svg className="interest-svg" viewBox="0 0 200 180" role="img" aria-label={title}>
      <path
        d="M100 28a62 62 0 1 1-44 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M54 40l8 14 16-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <g fill="color-mix(in oklab, currentColor 14%, transparent)" stroke="currentColor" strokeWidth="1.4">
        <circle cx="100" cy="28" r="11" />
        <circle cx="156" cy="90" r="11" />
        <circle cx="100" cy="152" r="11" />
        <circle cx="44" cy="90" r="11" />
      </g>
      <text x="100" y="32" textAnchor="middle" fill="currentColor" fontSize="8" fontFamily="var(--font-mono)">
        S
      </text>
      <text x="156" y="94" textAnchor="middle" fill="currentColor" fontSize="8" fontFamily="var(--font-mono)">
        A
      </text>
      <text x="100" y="156" textAnchor="middle" fill="currentColor" fontSize="8" fontFamily="var(--font-mono)">
        R
      </text>
      <text x="44" y="94" textAnchor="middle" fill="currentColor" fontSize="8" fontFamily="var(--font-mono)">
        S′
      </text>
    </svg>
  );
}
