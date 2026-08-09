"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLang, LUMA_EVENT_ID, LUMA_URL } from "@/lib/i18n";
import { store } from "@/lib/store";
import MindshiftMark from "./MindshiftMark";

/**
 * PDF page 1. On landing the letters boot up like an old video game: each one
 * flashes in as a solid block (unloaded sprite), then snaps to the letterform
 * with a two-frame CRT flicker — stepped timing, no easing, all snap.
 */
export default function Hero() {
  const { lang, t } = useLang();
  const sec = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const svg = sec.current?.querySelector<SVGSVGElement>(".wordmark");
      if (!svg) return;
      const letters = [...svg.querySelectorAll<SVGPathElement>(".ltr")];

      // sprite blocks from each letter's bbox (removed after the boot)
      const blocks = letters.map((p) => {
        const b = p.getBBox();
        const rect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        rect.setAttribute("x", String(b.x + 2));
        rect.setAttribute("y", String(b.y + 2));
        rect.setAttribute("width", String(Math.max(4, b.width - 4)));
        rect.setAttribute("height", String(Math.max(4, b.height - 4)));
        rect.setAttribute("fill", "currentColor");
        rect.setAttribute("opacity", "0");
        p.parentNode?.insertBefore(rect, p);
        return rect;
      });

      const tl = gsap.timeline({
        onComplete: () => blocks.forEach((r) => r.remove()),
      });
      gsap.set(letters, { opacity: 0 });
      letters.forEach((p, i) => {
        const at = 0.3 + i * 0.075;
        tl.set(blocks[i], { opacity: 0.9 }, at)
          .set(blocks[i], { opacity: 0 }, at + 0.1)
          .set(p, { opacity: 1 }, at + 0.1)
          .set(p, { opacity: 0 }, at + 0.14)
          .set(p, { opacity: 1 }, at + 0.18);
      });
      // one stray late flicker — a tired CRT
      tl.set(letters[6], { opacity: 0.25 }, 1.55)
        .set(letters[6], { opacity: 1 }, 1.62);

      tl.from(
        sec.current!.querySelectorAll(".hero-tagline, .hero-bar"),
        { autoAlpha: 0, duration: 0.5, stagger: 0.15 },
        1.15
      );

      // the lockup recedes as you leave the blue — its cream double waits on
      // the dark page for the match cut
      gsap.to(sec.current!.querySelector(".hero-lockup"), {
        yPercent: -12,
        autoAlpha: 0.12,
        scale: 0.94,
        ease: "none",
        scrollTrigger: {
          trigger: sec.current,
          start: "top top",
          end: "bottom 30%",
          scrub: true,
        },
      });

      // the relay: every so often, at rest, the sign catches its true state.
      // Boot language, not jitter — SHIFT's letters power down in cascade,
      // the orientation swaps while dark, letters power up staggered (one
      // blinks, tired), it HOLDS upright a few seconds, then relays back.
      // Same translate as the flipped seat — the word never leaves its line.
      const shiftEl = svg.querySelector<SVGGElement>(".shift-live");
      if (shiftEl) {
        const sLetters = [...shiftEl.querySelectorAll<SVGPathElement>(".ltr")];
        // GSAP owns this group outright — absolute pivot on the SHIFT
        // letters' center, identical seat in both states: it can never
        // leave its line. (A stylesheet transform here poisons GSAP's
        // matrix parsing — the cinema taught us.)
        const SEAT = { x: -2.9, y: 0.29, svgOrigin: "448.9 59.7" };
        gsap.set(shiftEl, { ...SEAT, rotation: 180 });

        let phase: "rest" | "in" | "hold" | "out" = "rest";
        let clock = 0;
        let nextAt = 2.8 + Math.random() * 1.7; // first catch, a couple seconds in
        let holdUntil = 0;

        const cascade = (dir: "up" | "down", onDone: () => void) => {
          const tl = gsap.timeline({ onComplete: onDone });
          // power down, letter by letter
          sLetters.forEach((p, i) => tl.set(p, { opacity: 0 }, i * 0.045));
          // swap orientation in the dark — same seat, same line
          tl.set(
            shiftEl,
            { ...SEAT, rotation: dir === "up" ? 0 : 180 },
            "+=0.07"
          );
          // power up, staggered
          const base = sLetters.length * 0.045 + 0.07;
          sLetters.forEach((p, i) =>
            tl.set(p, { opacity: 1 }, base + 0.055 * i)
          );
          // one letter blinks awake late — the boot's tired CRT
          const j = Math.floor(Math.random() * sLetters.length);
          tl.set(sLetters[j], { opacity: 0.25 }, "+=0.12").set(
            sLetters[j],
            { opacity: 1 },
            "+=0.07"
          );
        };

        const flickTick = (_t: number, deltaMs: number) => {
          clock += deltaMs / 1000;
          if (phase === "rest" && clock >= nextAt && store.p < 0.04) {
            phase = "in";
            cascade("up", () => {
              phase = "hold";
              holdUntil = clock + 2.6 + Math.random() * 1.4;
            });
          } else if (
            phase === "hold" &&
            (clock >= holdUntil || store.p >= 0.04)
          ) {
            phase = "out";
            cascade("down", () => {
              phase = "rest";
              nextAt = clock + 5 + Math.random() * 3.5;
            });
          }
        };
        gsap.ticker.add(flickTick);
        return () => {
          gsap.ticker.remove(flickTick);
        };
      }
    });
    return () => mm.revert();
  }, [lang]);

  return (
    <section className="hero" id="hero" ref={sec}>
      <div className="hero-stage">
        <div className="hero-lockup">
          <MindshiftMark className="wordmark" />
          <p className="hero-tagline">{t.tagline}</p>
        </div>
      </div>
      <div className="hero-foot">
        <div className="hero-bar">
          <p className="tag">{t.dateTag}</p>
          <a
            href={LUMA_URL}
            className="btn"
            data-luma-action="checkout"
            data-luma-event-id={LUMA_EVENT_ID}
          >
            {t.cta}
          </a>
          <p className="tag">{t.netTag}</p>
        </div>
      </div>
    </section>
  );
}
