"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { useLang, LUMA_EVENT_ID, LUMA_URL } from "@/lib/i18n";
import { useMotion, useSectionProgress } from "@/lib/hooks";
import MindshiftMark from "./MindshiftMark";
import CinemaMark from "./CinemaMark";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const PHOTOS = Array.from(
  { length: 14 },
  (_, i) => `${BASE}/photos/b${String(i + 1).padStart(2, "0")}.jpg`
);

/**
 * PDF page 2, cinema edition: the giant MINDSHIFT is a window onto the
 * archive photography. When it enters, the copy types itself while the
 * photos cut rapidly inside the letters — and as the writing completes, the
 * reversed SHIFT rights itself and the small lockup in the bottom strip
 * slides together and converts. One master timeline, one story.
 */
export default function Page2() {
  const { t } = useLang();
  const ref = useSectionProgress<HTMLElement>("rsvp", "top 65%");
  const cinema = useRef<HTMLDivElement>(null);
  const cols = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);

  // stable shuffled cut order per mount
  const order = useMemo(() => {
    const a = PHOTOS.map((_, i) => i);
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }, []);

  // warm the cache so the cuts never flash empty
  useEffect(() => {
    PHOTOS.forEach((src) => {
      const im = new Image();
      im.src = src;
    });
  }, []);

  useMotion(() => {
    const cinEl = cinema.current;
    const colsEl = cols.current;
    const stripEl = strip.current;
    if (!cinEl || !colsEl || !stripEl) return;

    const cinShift = cinEl.querySelector<SVGGElement>(".cin-shift");
    const imgs = cinEl.querySelectorAll<SVGImageElement>(".cin-img");
    const typedEls = colsEl.querySelectorAll<HTMLElement>(".typed-out");
    const ghostEls = colsEl.querySelectorAll<HTMLElement>(".typed .ghost");
    const sMind = stripEl.querySelector(".mind-live");
    const sShift = stripEl.querySelector(".shift-live");
    if (!cinShift || !sMind || !sShift) return;

    // initial states: reversed SHIFT, empty text, strip pieces far apart
    gsap.set(cinShift, { rotation: 180, svgOrigin: "448.9 59.7" });
    gsap.set(ghostEls, { visibility: "hidden" }); // typing takes over (ghosts keep the layout)
    const SEP = 420;
    gsap.set(sMind, { x: -SEP });
    gsap.set(sShift, { x: SEP, rotation: 180, transformOrigin: "50% 51%" });

    // the cutting room: rapid photo changes inside the letters
    const cut = { on: false, acc: 0, k: 0 };
    const swap = () => {
      const src = PHOTOS[order[cut.k % order.length]];
      cut.k += 1;
      imgs.forEach((im) => im.setAttribute("href", src));
    };
    const cutTick = (_t: number, deltaMs: number) => {
      if (!cut.on) return;
      cut.acc += deltaMs / 1000;
      if (cut.acc >= 0.21) {
        cut.acc = 0;
        swap();
      }
    };
    gsap.ticker.add(cutTick);

    const master = gsap.timeline({
      scrollTrigger: { trigger: cinEl, start: "top 72%", once: true },
    });

    master.call(() => {
      cut.on = true;
    });

    // the text writes itself, paragraph by paragraph
    typedEls.forEach((el, i) => {
      const text = ghostEls[i]?.textContent ?? "";
      const proxy = { n: 0 };
      master.to(
        proxy,
        {
          n: text.length,
          duration: Math.max(0.8, text.length / 55),
          ease: "none",
          onStart: () => el.classList.add("typing"),
          onUpdate: () => {
            el.textContent = text.slice(0, Math.round(proxy.n));
          },
          onComplete: () => el.classList.remove("typing"),
        },
        i === 0 ? 0.4 : "+=0.35"
      );
    });

    // writing done: the cuts settle, SHIFT rights itself
    master.call(
      () => {
        cut.on = false;
      },
      [],
      ">-0.1"
    );
    master.to(
      cinShift,
      { rotation: 0, svgOrigin: "448.9 59.7", duration: 1.2, ease: "power2.inOut" },
      "<"
    );

    // and the bottom lockup merges — a sliding conversion
    master
      .to(sMind, { x: 0, duration: 1.4, ease: "power2.inOut" }, ">-0.4")
      .to(sShift, { x: -2.9, y: 0.29, duration: 1.4, ease: "power2.inOut" }, "<")
      .to(sShift, { rotation: 0, duration: 0.55, ease: "power3.inOut" }, ">-0.1");

    return () => {
      gsap.ticker.remove(cutTick);
    };
  }, [t]);

  return (
    <section className="page2" id="page2" ref={ref}>
      <div className="cinema" ref={cinema}>
        <CinemaMark firstPhoto={PHOTOS[0]} />
      </div>

      <div className="p2-cols" ref={cols}>
        <div className="p2-left">
          {t.paras.map((p) => (
            <p className="p2-block typed" key={p.slice(0, 24)} aria-label={p}>
              <span className="ghost" aria-hidden>
                {p}
              </span>
              <span className="typed-out" aria-hidden />
            </p>
          ))}
        </div>
        <div className="p2-right">
          <div className="p2-block p2-rules">
            {t.rules.map((r) => (
              <p key={r}>{r}</p>
            ))}
          </div>
          <div className="p2-block p2-venue">
            {t.venue.map((v) => (
              <p key={v}>{v}</p>
            ))}
          </div>
          <p className="p2-block">{t.fiveA8}</p>
          <div className="p2-block">
            <a
              href={LUMA_URL}
              className="btn btn-blue"
              data-luma-action="checkout"
              data-luma-event-id={LUMA_EVENT_ID}
            >
              {t.cta}
            </a>
          </div>
        </div>
      </div>

      <div className="p2-foot-strip" ref={strip}>
        <p className="tag">{t.dateTag}</p>
        <MindshiftMark className="strip-mark" />
        <p className="tag">{t.netTag}</p>
      </div>
    </section>
  );
}
