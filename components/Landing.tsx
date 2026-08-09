"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { LangContext, dicts, type Lang } from "@/lib/i18n";
import { store } from "@/lib/store";
import FrameTop from "./Frame";
import Hero from "./Hero";
import Page2 from "./Page2";

gsap.registerPlugin(ScrollTrigger);

const BLUE: [number, number, number] = [0, 13, 255];
const BLUE_DEEP: [number, number, number] = [0, 9, 214];
const DUSK: [number, number, number] = [58, 24, 52]; // sunset plum between day and night
const DARK: [number, number, number] = [32, 22, 14]; // the bar: warm night brown

const mix = (
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

const rgb = (c: [number, number, number]) =>
  `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`;

export default function Landing() {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const saved = window.localStorage.getItem("ms-lang");
    if (saved === "en" || saved === "fr") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("ms-lang", l);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Lenis smooth scroll + ScrollTrigger plumbing
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let lenis: Lenis | null = null;
    let raf: ((time: number) => void) | null = null;
    if (!reduced) {
      lenis = new Lenis({ duration: 1.15 });
      store.lenis = lenis;
      raf = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      lenis.on("scroll", () => {
        store.vel = lenis!.velocity;
        ScrollTrigger.update();
      });
    }

    const total = ScrollTrigger.create({
      start: 0,
      end: () => ScrollTrigger.maxScroll(window),
      onUpdate: (self) => {
        store.p = self.progress;
      },
    });

    const onMove = (e: PointerEvent) => {
      store.px = (e.clientX / window.innerWidth) * 2 - 1;
      store.py = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);

    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      window.removeEventListener("pointermove", onMove);
      total.kill();
      if (raf) gsap.ticker.remove(raf);
      lenis?.destroy();
      store.lenis = null;
    };
  }, []);

  // Page-wide shift (180 → 0, completes at the very bottom) + the background
  // turning from vivid blue to page 2's dark as the second screen arrives.
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return; // static: flipped lockup, CSS gives page 2 its dark bg

    const root = document.documentElement;
    let sm = 0;
    let smDark = 0;
    const tick = () => {
      sm += (store.p - sm) * 0.09;
      const rot = 180 * (1 - sm);
      const f = rot / 180;
      root.style.setProperty("--shift-rot", rot.toFixed(2));
      // official reverse lockup seats the flipped SHIFT 2.9 units tighter,
      // 0.29 lower (measured against MINDSHIFT_REVERSE.svg) — eased with rot
      root.style.setProperty("--sdx", (-2.9 * f).toFixed(3));
      root.style.setProperty("--sdy", (0.29 * f).toFixed(3));
      // letters sit loose only MID-turn, locked at both resting states
      root.style.setProperty(
        "--wob-k",
        Math.sin(Math.PI * f).toFixed(3)
      );
      // header circle series stretches outward as you scroll (reverse trickle)
      root.style.setProperty("--ring-x", sm.toFixed(3));
      // (the bottom mark's convergence is a GSAP timeline in Page2 — it plays
      // once, on entering the viewport, independent of scroll position)

      const darkT = store.sections.rsvp; // page 2 arrival 0..1
      smDark += (darkT - smDark) * 0.09;
      const base = mix(BLUE, BLUE_DEEP, Math.min(1, sm * 1.6));
      // day → dusk plum → warm bar night. The blue HOLDS through the first
      // 45% of the arrival (mobile reaches it early), then dusk sweeps in.
      const kRaw = Math.min(1, smDark);
      const kH = kRaw < 0.45 ? 0 : (kRaw - 0.45) / 0.55;
      const k = kH * kH * (3 - 2 * kH);
      const col = rgb(
        k < 0.5 ? mix(base, DUSK, k * 2) : mix(DUSK, DARK, (k - 0.5) * 2)
      );
      document.body.style.backgroundColor = col;
      root.style.setProperty("--bg-dyn", col);
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      document.body.style.backgroundColor = "";
      root.style.removeProperty("--shift-rot");
      root.style.removeProperty("--sdx");
      root.style.removeProperty("--sdy");
      root.style.removeProperty("--wob-k");
      root.style.removeProperty("--ring-x");
      root.style.removeProperty("--bg-dyn");
    };
  }, []);

  // After a language switch remounts the page tree, recompute trigger positions.
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, t: dicts[lang], setLang }}>
      <div className="grain" aria-hidden />
      <div key={lang}>
        <FrameTop />
        <main className="page">
          <Hero />
          <Page2 />
        </main>
      </div>
    </LangContext.Provider>
  );
}
