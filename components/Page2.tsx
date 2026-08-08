"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useLang, LUMA_EVENT_ID, LUMA_URL } from "@/lib/i18n";
import { useMotion, useSectionProgress } from "@/lib/hooks";
import MindshiftMark from "./MindshiftMark";
import GlitchLayer from "./GlitchLayer";

/**
 * PDF page 2, the dark screen: tags strip, two mono columns (the event copy ·
 * rules + venue + CTA), the small lockup between hairlines at the bottom —
 * where the page-long shift completes — and the designer's pixel glitch,
 * recreated subtly and alive behind everything.
 */
export default function Page2() {
  const { t } = useLang();
  const ref = useSectionProgress<HTMLElement>("rsvp", "top 65%");
  const cols = useRef<HTMLDivElement>(null);

  useMotion(() => {
    const el = cols.current;
    if (!el) return;
    gsap.from(el.querySelectorAll(".p2-block"), {
      autoAlpha: 0,
      y: 16,
      stagger: 0.1,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 74%" },
    });
  }, [t]);

  return (
    <section className="page2" id="page2" ref={ref}>
      <GlitchLayer />
      <div className="p2-content">
        <div className="p2-strip">
          <p className="tag">{t.netTag}</p>
          <p className="tag">{t.dateTag2}</p>
        </div>

        <div className="p2-cols" ref={cols}>
          <div className="p2-left">
            {t.paras.map((p) => (
              <p className="p2-block" key={p.slice(0, 24)}>
                {p}
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
                className="btn"
                data-luma-action="checkout"
                data-luma-event-id={LUMA_EVENT_ID}
              >
                {t.cta}
              </a>
            </div>
          </div>
        </div>

        <div className="p2-foot">
          <div className="p2-mark">
            <MindshiftMark className="small-mark" />
          </div>
        </div>
      </div>
    </section>
  );
}
