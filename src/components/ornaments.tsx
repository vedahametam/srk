/** Decorative SVG ornaments: mandala, lotus divider, diya and Om mark. */

type SvgProps = { className?: string };

function petals(count: number, radius: number, length: number, width: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (360 / count) * i;
    const tip = radius + length;
    return (
      <path
        key={i}
        d={`M0 ${-radius} C ${width} ${-radius - length * 0.35}, ${width * 0.6} ${-tip + length * 0.2}, 0 ${-tip} C ${-width * 0.6} ${-tip + length * 0.2}, ${-width} ${-radius - length * 0.35}, 0 ${-radius}Z`}
        transform={`rotate(${angle})`}
      />
    );
  });
}

export function Mandala({ className }: SvgProps) {
  return (
    <svg viewBox="-200 -200 400 400" className={className} aria-hidden="true" fill="none" stroke="currentColor">
      <g strokeWidth="0.8" opacity="0.9">
        <circle r="196" />
        <circle r="188" strokeDasharray="2 5" />
        <g strokeWidth="0.7">{petals(32, 150, 36, 12)}</g>
        <circle r="148" />
        <g strokeWidth="0.8">{petals(24, 108, 38, 16)}</g>
        <circle r="104" strokeDasharray="1 4" />
        <g strokeWidth="0.9">{petals(16, 66, 36, 17)}</g>
        <circle r="62" />
        <g strokeWidth="1">{petals(8, 26, 32, 15)}</g>
        <circle r="22" />
        <circle r="8" />
        {Array.from({ length: 48 }, (_, i) => (
          <circle key={i} r="1.6" cy="-170" transform={`rotate(${i * 7.5})`} fill="currentColor" stroke="none" />
        ))}
      </g>
    </svg>
  );
}

export function Lotus({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 120 60" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M60 52 C52 38 52 20 60 6 C68 20 68 38 60 52Z" />
      <path d="M60 52 C46 44 38 30 38 14 C50 20 58 34 60 52Z" />
      <path d="M60 52 C74 44 82 30 82 14 C70 20 62 34 60 52Z" />
      <path d="M60 52 C42 50 26 40 18 26 C34 26 50 38 60 52Z" />
      <path d="M60 52 C78 50 94 40 102 26 C86 26 70 38 60 52Z" />
      <path d="M30 55 H90" strokeLinecap="round" />
    </svg>
  );
}

export function LotusDivider({ className = "text-gold" }: SvgProps) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden="true">
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-current sm:w-28" />
      <Lotus className="h-7 w-14" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-current sm:w-28" />
    </div>
  );
}

/** Oil lamp with a softly flickering flame. */
export function Diya({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="diya-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd98a" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#e8892b" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#e8892b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="diya-flame" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#e8892b" />
          <stop offset="55%" stopColor="#ffc454" />
          <stop offset="100%" stopColor="#fff6d8" />
        </linearGradient>
        <linearGradient id="diya-bowl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2b659" />
          <stop offset="100%" stopColor="#8a5a1f" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="46" r="44" fill="url(#diya-halo)" className="animate-glow origin-center [transform-box:fill-box]" />
      <g className="animate-flicker origin-bottom [transform-box:fill-box]">
        <path d="M60 18 C68 32 70 42 60 58 C50 42 52 32 60 18Z" fill="url(#diya-flame)" />
      </g>
      <path d="M20 66 H100 C98 86 82 98 60 98 C38 98 22 86 20 66Z" fill="url(#diya-bowl)" />
      <path d="M20 66 H100" stroke="#f3d58e" strokeWidth="2" strokeLinecap="round" />
      <path d="M100 66 L112 58" stroke="#c9a14a" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function OmMark({ className }: SvgProps) {
  return (
    <span className={`font-deva leading-none ${className ?? ""}`} aria-hidden="true">
      ॐ
    </span>
  );
}
