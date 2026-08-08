"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { store } from "@/lib/store";

/**
 * The designer's pixel-glitch collage, recreated subtly and in motion:
 * columns of tiny RGB dashes (corrupted scanlines) clustered at the edges of
 * the dark page. Columns breathe slowly toward new heights; the odd dash
 * flickers. Redrawn at ~12 fps for the analog feel. Static under
 * prefers-reduced-motion.
 */

type Column = {
  x: number;
  hMin: number;
  hMax: number;
  cur: number;
  target: number;
  nextChange: number;
  colors: string[];
  fromTop: boolean;
  /** how present this voice stays when the melody is elsewhere */
  residual: number;
  /** current envelope 0..1 — rises as the melody passes, falls after */
  live: number;
};

/* core marks: warm paper and candlelight ambers, the odd ember red */
const PALETTE = [
  "#e2d9c2",
  "#e2d9c2",
  "#e2d9c2",
  "#d9a441",
  "#c9a227",
  "#b8433c",
];

/* the aura: chromatic-aberration fringes around every block */
const FRINGE_L = "#e0473f";
const FRINGE_R = "#3b5bdb";

/* sparse: tall voices at the edges (they keep a quiet residual), a low carrier
   row along the bottom that only sounds when the melody passes over it */
const CLUSTERS: {
  xr: [number, number];
  n: number;
  h: [number, number];
  res: number;
}[] = [
  { xr: [0.0, 0.05], n: 5, h: [0.14, 0.42], res: 0.2 },
  { xr: [0.06, 0.15], n: 3, h: [0.05, 0.16], res: 0.08 },
  { xr: [0.18, 0.92], n: 8, h: [0.03, 0.09], res: 0 },
  { xr: [0.95, 1.0], n: 5, h: [0.12, 0.4], res: 0.2 },
];

/* the melody: a slow 22s swell across the stage, then a long quiet breath */
const PERIOD = 30;
const SWEEP = 22;
const WIDTH = 0.22;

export default function GlitchLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let cols: Column[] = [];
    let dashW = 8;
    let dashH = 3;
    let stepY = 6;

    const build = () => {
      const parent = canvas.parentElement!;
      W = parent.clientWidth;
      H = parent.clientHeight;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      dashW = Math.max(9, Math.round(W * 0.008));
      dashH = Math.max(3, Math.round(dashW * 0.32));
      stepY = Math.round(dashH * 2.2);

      cols = [];
      CLUSTERS.forEach(({ xr, n, h, res }) => {
        for (let i = 0; i < n; i++) {
          const x =
            Math.round(
              ((xr[0] + Math.random() * (xr[1] - xr[0])) * W) / (dashW + 3)
            ) *
            (dashW + 3);
          const hMin = h[0] * H;
          const hMax = h[1] * H;
          const cur = hMin + Math.random() * (hMax - hMin);
          const rows = Math.ceil(hMax / stepY) + 2;
          cols.push({
            x,
            hMin,
            hMax,
            cur,
            target: hMin + Math.random() * (hMax - hMin),
            nextChange: Math.random() * 3,
            colors: Array.from(
              { length: rows },
              () => PALETTE[(Math.random() * PALETTE.length) | 0]
            ),
            fromTop: false,
            residual: res,
            live: reduced ? 1 : 0,
          });
        }
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const fr = Math.max(1.5, dashW * 0.18);
      cols.forEach((c) => {
        const rows = Math.floor((c.cur * c.live) / stepY);
        const fade = Math.min(1, c.live * 1.6);
        for (let r = 0; r < rows; r++) {
          // gentle dissolve toward the column's tip
          const a = (1 - (r / Math.max(1, rows)) * 0.45) * fade;
          const y = c.fromTop ? r * stepY : H - (r + 1) * stepY;
          // the aura: red/blue misregistration around each block
          ctx.globalAlpha = 0.3 * a;
          ctx.fillStyle = FRINGE_L;
          ctx.fillRect(c.x - fr, y + 0.5, dashW, dashH);
          ctx.fillStyle = FRINGE_R;
          ctx.fillRect(c.x + fr, y - 0.5, dashW, dashH);
          // the block itself
          ctx.globalAlpha = 0.55 * a;
          ctx.fillStyle = c.colors[r % c.colors.length];
          ctx.fillRect(c.x, y, dashW, dashH);
        }
      });
      ctx.globalAlpha = 1;
    };

    build();
    draw();

    let ro: ResizeObserver | null = new ResizeObserver(() => {
      build();
      draw();
    });
    ro.observe(canvas.parentElement!);

    if (reduced) {
      return () => {
        ro?.disconnect();
        ro = null;
      };
    }

    let acc = 0;
    let clock = 0;
    let stageClock = 0; // advances only while page 2 is on stage
    const tick = (_t: number, deltaMs: number) => {
      const dt = Math.min(0.1, deltaMs / 1000);
      clock += dt;
      if (store.sections.rsvp > 0.3) stageClock += dt;
      // where the melody is: sweeping left → right, then resting
      const tPhase = stageClock % PERIOD;
      const mx = tPhase < SWEEP ? tPhase / SWEEP : 2; // parked off-stage at rest
      cols.forEach((c) => {
        if (clock >= c.nextChange) {
          c.target = c.hMin + Math.random() * (c.hMax - c.hMin);
          c.nextChange = clock + 7 + Math.random() * 7;
        }
        c.cur += (c.target - c.cur) * dt * 0.3;
        // voices rise as the swell reaches them, and settle softly after
        const d = c.x / Math.max(1, W) - mx;
        const env = Math.exp(-(d * d) / (2 * WIDTH * WIDTH));
        const want = Math.min(1, c.residual + env);
        c.live += (want - c.live) * Math.min(1, dt * 0.9);
      });
      // a single dash flickers every several seconds, site-wide
      if (Math.random() < dt * 0.2) {
        const c = cols[(Math.random() * cols.length) | 0];
        if (c)
          c.colors[(Math.random() * c.colors.length) | 0] =
            PALETTE[(Math.random() * PALETTE.length) | 0];
      }
      // presence builds gradually with scroll depth — a whisper at the page
      // turn, full voice only near the bottom (~12 fps redraw)
      const depth = Math.min(1, Math.max(0, (store.p - 0.5) / 0.4));
      canvas.style.opacity = String(depth * depth * (3 - 2 * depth));
      acc += dt;
      if (acc >= 1 / 12) {
        acc = 0;
        draw();
      }
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      ro?.disconnect();
      ro = null;
    };
  }, []);

  return <canvas ref={canvasRef} className="glitch-canvas" aria-hidden />;
}
