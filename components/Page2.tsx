"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { useLang, LUMA_EVENT_ID, LUMA_URL } from "@/lib/i18n";
import { useMotion, useSectionProgress } from "@/lib/hooks";
import MindshiftMark from "./MindshiftMark";
import CinemaMark from "./CinemaMark";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * The cast. Each frame is aimed at its face: `ar` = aspect ratio, `a` = the
 * face's vertical center as a fraction of image height, `w` = weight in the
 * rotation (face-forward shots appear more). b09 (top-down table, no faces)
 * sits this one out.
 */
type Ph = { src: string; ar: number; a: number; w: number; br: number };
const PHOTOS: Ph[] = [
  { src: "b01.jpg", ar: 1.5, a: 0.44, w: 2, br: 1.2 },
  { src: "b02.jpg", ar: 1.5, a: 0.46, w: 2, br: 1.15 },
  { src: "b03.jpg", ar: 1.5, a: 0.46, w: 2, br: 1.1 },
  { src: "b04.jpg", ar: 0.666, a: 0.22, w: 2, br: 1.25 },
  { src: "b05.jpg", ar: 1.5, a: 0.3, w: 2, br: 1.2 },
  { src: "b06.jpg", ar: 1.5, a: 0.34, w: 1, br: 1.45 },
  { src: "b07.jpg", ar: 1.5, a: 0.28, w: 2, br: 1.15 },
  { src: "b08.jpg", ar: 1.5, a: 0.3, w: 2, br: 1.2 },
  { src: "b10.jpg", ar: 1.5, a: 0.32, w: 2, br: 1.15 },
  { src: "b11.jpg", ar: 1.5, a: 0.52, w: 2, br: 1.5 },
  { src: "b12.jpg", ar: 1.5, a: 0.64, w: 1, br: 1.5 },
  { src: "b13.jpg", ar: 1.5, a: 0.3, w: 2, br: 1.2 },
  { src: "b14.jpg", ar: 1.5, a: 0.46, w: 2, br: 1.55 },
].map((p) => ({ ...p, src: `${BASE}/photos/${p.src}` }));

/** the frame the film settles on — bright, joyful, holds the longest */
const FINAL = PHOTOS.find((p) => p.src.includes("b10"))!;

/** geometry that lands the face band in the letters (image width 634.4) */
const frameGeo = (p: Ph) => {
  const h = 634.4 / p.ar;
  return { h, y: 59.7 - p.a * h };
};

/**
 * PDF page 2, cinema edition: the giant MINDSHIFT is a window onto the
 * archive photography. When it enters, the copy types itself while the
 * photos cut rapidly inside the letters — and as the writing completes, the
 * reversed SHIFT rights itself and the small lockup in the bottom strip
 * slides together and converts. One master timeline, one story.
 */
export default function Page2() {
  const { t } = useLang();
  const ref = useSectionProgress<HTMLElement>("rsvp", "top 40%");
  const cinema = useRef<HTMLDivElement>(null);
  const cols = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);

  // weighted, shuffled rotation — face-forward frames come around more often
  const order = useMemo(() => {
    const a: number[] = [];
    PHOTOS.forEach((p, i) => {
      for (let k = 0; k < p.w; k++) a.push(i);
    });
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }, []);

  // warm the cache so the cuts never flash empty
  useEffect(() => {
    PHOTOS.forEach((p) => {
      const im = new Image();
      im.src = p.src;
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

    const imgM = cinEl.querySelector<SVGImageElement>(".cin-img-m");
    const imgS = cinEl.querySelector<SVGImageElement>(".cin-img-s");
    const flashes = cinEl.querySelectorAll<SVGRectElement>(".cin-flash");
    const creams = cinEl.querySelectorAll<SVGGElement>(".cin-cream");

    // initial states: reversed SHIFT, empty text, strip pieces far apart —
    // equidistant from center, same baseline, sized to the strip's real width
    gsap.set(cinShift, { rotation: 180, svgOrigin: "448.9 59.7" });
    gsap.set(ghostEls, { visibility: "hidden" }); // typing takes over (ghosts keep the layout)
    const svgMark = stripEl.querySelector<SVGSVGElement>(".strip-mark");
    const mw = svgMark?.clientWidth || 150;
    const sepPx = Math.max(
      50,
      Math.min(190, (stripEl.clientWidth - mw) / 2 - 150)
    );
    const SEP = sepPx * (610.4 / mw);
    gsap.set(sMind, { x: -SEP });
    gsap.set(sShift, { x: SEP, rotation: 180, transformOrigin: "50% 51%" });

    // approach shot: the mark drifts up into place as it enters — the hero's
    // lockup receding above makes this read as one object crossing the fold
    gsap.fromTo(
      cinEl,
      { y: 70, scale: 1.05 },
      {
        y: 0,
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: cinEl,
          start: "top 96%",
          end: "top 45%",
          scrub: true,
        },
      }
    );

    // ——— the cutting room: an editor's rhythm, not a metronome ———
    // bursts of quick cuts, long holds with a slow pan, split frames where the
    // two halves disagree for a beat, the occasional film flash
    const RHYTHM = [
      0.16, 0.13, 0.16, 0.95, 0.3, 0.13, 0.12, 1.4, 0.24, 0.15, 0.8, 0.18,
    ];
    const cut = { on: false, clock: 0, nextAt: 0, k: 0, beat: 0, split: false };
    const pick = () => PHOTOS[order[cut.k++ % order.length]];
    const show = (im: SVGImageElement | null, p: Ph) => {
      if (!im) return;
      const g = frameGeo(p);
      im.setAttribute("href", p.src);
      im.setAttribute("height", String(g.h));
      im.setAttribute("y", String(g.y));
      // lift the moody frames — small letters on small screens eat shadows
      im.style.filter = `brightness(${p.br})`;
    };

    const doCut = () => {
      const dur = RHYTHM[cut.beat++ % RHYTHM.length] * (0.85 + Math.random() * 0.3);
      const r = Math.random();

      if (cut.split) {
        // resolve last beat's disagreement: both halves sync up
        const p = pick();
        show(imgM, p);
        show(imgS, p);
        cut.split = false;
      } else if (r < 0.14) {
        // split frame: MIND and SHIFT see different faces, for one beat
        show(imgM, pick());
        show(imgS, pick());
        cut.split = true;
      } else {
        const p = pick();
        show(imgM, p);
        show(imgS, p);
        if (r < 0.24) {
          // film flash on the cut
          gsap.fromTo(
            flashes,
            { opacity: 0.85 },
            { opacity: 0, duration: 0.22, ease: "power1.out" }
          );
        } else if (r < 0.44) {
          // zoom punch
          gsap.fromTo(
            [imgM, imgS],
            { scale: 1.045, svgOrigin: "305 60" },
            { scale: 1, svgOrigin: "305 60", duration: 0.35, ease: "power2.out" }
          );
        }
      }

      if (dur > 0.5) {
        // long hold: a slow drift, like the camera breathing
        const dx = (Math.random() < 0.5 ? -1 : 1) * 8;
        gsap.fromTo(
          [imgM, imgS],
          { x: -dx },
          { x: dx, duration: dur, ease: "none" }
        );
      }
      cut.nextAt = cut.clock + dur;
    };

    const cutTick = (_t: number, deltaMs: number) => {
      if (!cut.on) return;
      cut.clock += deltaMs / 1000;
      if (cut.clock >= cut.nextAt) doCut();
    };
    gsap.ticker.add(cutTick);

    const master = gsap.timeline({
      scrollTrigger: { trigger: cinEl, start: "top 72%", once: true },
    });

    // the match-cut develops: the cream lockup (the hero's double) dissolves
    // into film as the first cuts fire
    master.call(() => {
      cut.on = true;
    });
    master.to(creams, { autoAlpha: 0, duration: 1.1, ease: "power2.in" }, 0.15);

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

    // writing done: the cuts settle on the bright frame, SHIFT rights itself
    master.call(
      () => {
        cut.on = false;
        show(imgM, FINAL);
        show(imgS, FINAL);
      },
      [],
      ">-0.1"
    );
    master.to(
      cinShift,
      { rotation: 0, svgOrigin: "448.9 59.7", duration: 1.2, ease: "power2.inOut" },
      "<"
    );

    // and the bottom lockup: converge to center first, then SHIFT turns around
    master
      .to(sMind, { x: 0, duration: 1.5, ease: "power2.inOut" }, ">-0.3")
      .to(sShift, { x: -2.9, y: 0.29, duration: 1.5, ease: "power2.inOut" }, "<")
      .to(sShift, { rotation: 0, duration: 0.7, ease: "power2.inOut" }, ">+0.12");

    return () => {
      gsap.ticker.remove(cutTick);
    };
  }, [t]);

  return (
    <section className="page2" id="page2" ref={ref}>
      <div className="cinema" ref={cinema}>
        <CinemaMark
          firstPhoto={PHOTOS[0].src}
          firstH={frameGeo(PHOTOS[0]).h}
          firstY={frameGeo(PHOTOS[0]).y}
        />
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
