import { MIND, SHIFT } from "./MindshiftMark";

/**
 * The cinema wordmark: the giant MINDSHIFT whose letterforms are windows onto
 * the archive photography.
 *
 * Layers per half: photo (<image>, geometry aimed at the frame's face by
 * Page2) → flash rect → cream letterforms on top. The cream layer makes the
 * match-cut with the hero lockup — the mark arrives looking exactly like the
 * hero's, then "develops" into film as the cuts begin. SHIFT lives in a
 * rotating group (reversed until the writing ends).
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
        <clipPath id="cin-clip-s">
          {SHIFT.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </clipPath>
      </defs>

      <g clipPath="url(#cin-clip-m)">
        {img("cin-img-m")}
        <rect
          className="cin-flash cin-flash-m"
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
        <g clipPath="url(#cin-clip-s)">
          {img("cin-img-s")}
          <rect
            className="cin-flash cin-flash-s"
            x="0"
            y="0"
            width="610.4"
            height="119.4"
            fill="currentColor"
            opacity="0"
          />
        </g>
        <g className="cin-cream cin-cream-s" fill="currentColor">
          {SHIFT.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      </g>
    </svg>
  );
}
