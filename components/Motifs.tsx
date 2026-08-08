/* Official brand assets from the designer's remise (public/assets/…). */

/* eslint-disable @next/next/no-img-element */

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * The circle series, rebuilt as live elements (geometry matches
 * SERIE_CERCLES.svg: 10 rings, r≈20.1, step≈10.6) so the rings can trickle
 * in from each side and converge toward the header's center tag.
 */
export function RingsMotif({
  className,
  mirror = false,
}: {
  className?: string;
  mirror?: boolean;
}) {
  const N = 10;
  const r = 20.1;
  const step = 10.64;
  return (
    <svg
      className={className}
      viewBox="0 0 149.4 57.2"
      width={112}
      height={43}
      fill="none"
      aria-hidden
      data-mirror={mirror ? "1" : "0"}
      style={{ overflow: "visible" }}
    >
      {Array.from({ length: N }, (_, i) => (
        <circle
          key={i}
          className="ring-c"
          cx={26.8 + i * step}
          cy={28.6}
          r={r}
          stroke="currentColor"
          strokeWidth={1}
          style={
            {
              // scroll stretches the series outward, away from the center tag —
              // the reverse of the entrance trickle (outer rings travel furthest)
              "--rx": mirror ? i * 2.4 : -((N - 1 - i) * 2.4),
            } as React.CSSProperties
          }
        />
      ))}
    </svg>
  );
}

export function DraftGoalLogo({ height = 44 }: { height?: number }) {
  // viewBox 249.3 × 118.4
  return (
    <img
      className="logo-dg"
      src={`${BASE}/assets/draft-n-goal.svg`}
      alt="Draft & Goal"
      height={height}
      width={Math.round((height * 249.3) / 118.4)}
    />
  );
}

export function PapermindsLogo({ height = 22 }: { height?: number }) {
  // viewBox 263.4 × 54.7
  return (
    <img
      className="logo-pm"
      src={`${BASE}/assets/paperminds.svg`}
      alt="paperminds"
      height={height}
      width={Math.round((height * 263.4) / 54.7)}
    />
  );
}
