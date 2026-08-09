import { MIND, SHIFT } from "./MindshiftMark";

/**
 * The cinema wordmark: the giant MINDSHIFT whose letterforms are windows onto
 * the archive photography. Two clip groups — MIND upright, SHIFT in a
 * rotating wrapper (starts reversed, rights itself when the sequence
 * completes). Both <image> layers span the full word so each photo reads as
 * one continuous frame; Page2's master timeline drives the cuts and rotation.
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
          x="0"
          y="0"
          width="610.4"
          height="119.4"
          preserveAspectRatio="xMidYMid slice"
        />
      </g>
      <g className="cin-shift">
        <g clipPath="url(#cin-clip-s)">
          <image
            className="cin-img cin-img-s"
            href={firstPhoto}
            x="0"
            y="0"
            width="610.4"
            height="119.4"
            preserveAspectRatio="xMidYMid slice"
          />
        </g>
      </g>
    </svg>
  );
}
