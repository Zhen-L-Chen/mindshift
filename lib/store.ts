// Shared mutable scroll state — written by Lenis/ScrollTrigger on the DOM side,
// read every frame by the Three.js scene and ticker-driven UI (gauge, chip).
// Plain object on purpose: no React re-renders involved.

import type Lenis from "lenis";

export type SectionKey =
  | "hero"
  | "manifesto"
  | "program"
  | "infos"
  | "rsvp"
  | "footer";

export const store: {
  /** overall page progress 0..1 */
  p: number;
  /** lenis scroll velocity (px/frame-ish) */
  vel: number;
  /** per-section arrival progress 0..1 (hero = pin progress) */
  sections: Record<SectionKey, number>;
  /** pointer, normalized -1..1 */
  px: number;
  py: number;
  lenis: Lenis | null;
} = {
  p: 0,
  vel: 0,
  sections: { hero: 0, manifesto: 0, program: 0, infos: 0, rsvp: 0, footer: 0 },
  px: 0,
  py: 0,
  lenis: null,
};
