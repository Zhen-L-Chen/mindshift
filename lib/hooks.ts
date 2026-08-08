"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { store, type SectionKey } from "./store";

gsap.registerPlugin(ScrollTrigger);

/**
 * Tracks a section's arrival progress (0 = top of section at viewport bottom,
 * 1 = top of section at `end`) and writes it into the shared store for the
 * Three.js scene to blend slinky poses.
 */
export function useSectionProgress<T extends HTMLElement>(
  key: SectionKey,
  end = "top 35%"
): RefObject<T | null> {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end,
      onUpdate: (self) => {
        store.sections[key] = self.progress;
      },
    });
    store.sections[key] = st.progress;
    return () => {
      st.kill();
      store.sections[key] = 0;
    };
  }, [key, end]);
  return ref;
}

/**
 * Runs a GSAP setup function only when the user allows motion.
 * Everything created inside is reverted on cleanup (lang switch / unmount).
 */
export function useMotion(fn: () => void, deps: unknown[] = []) {
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      fn();
    });
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}
