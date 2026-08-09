import { MIND, SHIFT } from "./MindshiftMark";

/**
 * The cinema wordmark: the giant MINDSHIFT whose letterforms are windows onto
 * the archive photography.
 *
 * Layers per half: photo (<image>, oversized for pan headroom) → flash rect →
 * cream letterforms on top. The cream layer makes the match-cut with the hero
 * lockup — the mark arrives looking exactly like the hero's, then "develops"
 * into film as Page2's master timeline fades the cream away and starts the
 * cuts. SHIFT lives in a rotating group (reversed until the writing ends).
 */
export default function CinemaMark({ firstPhoto }: { firstPhoto: string }) {
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
        <image
          className="cin-img cin-img-m"
          href={firstPhoto}
          x="-12"
          y="-8"
          width="634.4"
          height="135.4"
          preserveAspectRatio="xMidYMid slice"
        />
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
          <image
            className="cin-img cin-img-s"
            href={firstPhoto}
            x="-12"
            y="-8"
            width="634.4"
            height="135.4"
            preserveAspectRatio="xMidYMid slice"
          />
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
