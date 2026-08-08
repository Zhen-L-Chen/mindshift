"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLang } from "@/lib/i18n";
import { DraftGoalLogo, PapermindsLogo, RingsMotif } from "./Motifs";

/**
 * The fixed header from the PDF. Micro-animation: on load, the circle series
 * trickles in from each outer edge and converges toward the center tag —
 * left motif flows right, right motif flows left.
 */
export default function FrameTop() {
  const { lang, t, setLang } = useLang();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const svgs = ref.current?.querySelectorAll("svg[data-mirror]") ?? [];
      svgs.forEach((svg) => {
        const mirror = svg.getAttribute("data-mirror") === "1";
        const rings = svg.querySelectorAll(".ring-c");
        gsap.from(rings, {
          x: mirror ? 30 : -30,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.35,
          stagger: { each: 0.055, from: mirror ? "end" : "start" },
          // hand the transform back to the scroll-driven CSS var
          onComplete: () => gsap.set(rings, { clearProps: "transform" }),
        });
      });
    });
    return () => mm.revert();
  }, [lang]);

  return (
    <div className="frame-top">
      <div className="topbar">
        <button
          className="lang"
          onClick={() => setLang(lang === "fr" ? "en" : "fr")}
          aria-label={lang === "fr" ? "Switch to English" : "Passer en français"}
        >
          {lang === "fr" ? (
            <>
              <b>FR</b>
              <span>/EN</span>
            </>
          ) : (
            <>
              <b>EN</b>
              <span>/FR</span>
            </>
          )}
        </button>
      </div>
      <header className="header" ref={ref}>
        <DraftGoalLogo />
        <RingsMotif className="rings" />
        <p className="tag header-tag">{t.topTag}</p>
        <RingsMotif className="rings" mirror />
        <PapermindsLogo />
      </header>
    </div>
  );
}
