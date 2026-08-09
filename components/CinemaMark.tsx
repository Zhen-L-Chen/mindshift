import { MIND, SHIFT } from "./MindshiftMark";

/**
 * The cinema wordmark: the giant MINDSHIFT whose letterforms are windows onto
 * the archive photography.
 *
 * MIND is one clip window. SHIFT is FIVE — one per letter — so the finale can
 * play in boot language: windows power down in cascade, the orientation swaps
 * while dark, windows power back up. No visible rotation, ever. The cream
 * layers make the match-cut with the hero (they develop away as cuts begin).
 */
export default function CinemaMark({
  firstPhoto,
  firstH,
  firstY,
}: {
  firstPhoto: string;
  firstH: number;
  firstY: number;
}) {
  const img = (cls: string) => (
    <image
      className={`cin-img ${cls}`}
      href={firstPhoto}
      x="-12"
      y={firstY}
      width="634.4"
      height={firstH}
      preserveAspectRatio="none"
    />
  );
  return (
    <svg
      className="cinema-svg"
      viewBox="0 0 610.4 119.4"
      role="img"
      aria-label="MINDSHIFT"
      style={{ overflow: "visible" }}
    >
      <defs>
        <clipPath id="cin-clip-m">
          {MIND.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </clipPath>
        {SHIFT.map((d, i) => (
          <clipPath key={i} id={`cin-clip-s${i}`}>
            <path d={d} />
          </clipPath>
        ))}
      </defs>

      <g clipPath="url(#cin-clip-m)">
        {img("cin-img-m")}
        <rect
          className="cin-flash"
          x="0"
          y="0"
          width="610.4"
          height="119.4"
          fill="currentColor"
          opacity="0"
        />
      </g>
      <g className="cin-cream cin-cream-m" fill="currentColor">
        {MIND.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      <g className="cin-shift">
        {SHIFT.map((_, i) => (
          <g key={i} className="cin-sletter" clipPath={`url(#cin-clip-s${i})`}>
            {img("cin-img-s")}
            <rect
              className="cin-flash"
              x="287"
              y="0"
              width="323.4"
              height="119.4"
              fill="currentColor"
              opacity="0"
            />
          </g>
        ))}
        <g className="cin-cream cin-cream-s" fill="currentColor">
          {SHIFT.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      </g>
    </svg>
  );
}
