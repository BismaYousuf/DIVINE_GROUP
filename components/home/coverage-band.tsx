"use client";

import { useRef } from "react";
import { gsap, useGSAP, registerGsap } from "@/components/motion/gsap";
import { useMotionAllowed } from "@/components/motion/use-motion-allowed";
import { EASE } from "@/lib/motion/tokens";
import { siteConfig } from "@/lib/site-config";
import {
  CoverageSlab,
  CoverageCtaSlab,
  CoverageIntroSlab,
} from "./coverage-slab";

export function CoverageBand() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const { ready } = useMotionAllowed();

  useGSAP(
    () => {
      if (!root.current || !stage.current || !track.current || !ready) return;
      registerGsap();

      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop:
            "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          flow: "(max-width: 1023px), (prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { desktop } = ctx.conditions as { desktop: boolean };
          const t = track.current!;

          if (desktop) {
            const distance = () => Math.max(0, t.scrollWidth - window.innerWidth);
            const tween = gsap.to(t, {
              x: () => -distance(),
              ease: "none",
              scrollTrigger: {
                trigger: stage.current,
                start: "top top",
                end: () => `+=${distance()}`,
                pin: true,
                scrub: 0.5,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                  if (bar.current)
                    bar.current.style.transform = `scaleX(${self.progress})`;
                },
              },
            });
            return () => {
              tween.scrollTrigger?.kill();
              tween.kill();
            };
          }

          // flow: reveal slabs as they enter
          const slabs = gsap.utils.toArray<HTMLElement>("> *", t);
          gsap.from(slabs, {
            autoAlpha: 0,
            y: 24,
            duration: 0.6,
            ease: EASE.out,
            stagger: 0.06,
            scrollTrigger: { trigger: t, start: "top 80%", once: true },
          });
        },
      );

      return () => mm.revert();
    },
    { scope: root, dependencies: [ready] },
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    window.scrollBy({ top: e.key === "ArrowRight" ? 360 : -360, behavior: "smooth" });
  };

  return (
    <section
      ref={root}
      aria-labelledby="coverage-heading"
      className="relative bg-paper"
    >
      <div
        ref={stage}
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-label="Coverage lines — scroll horizontally"
        className="relative overflow-hidden outline-none focus-visible:outline-2 focus-visible:outline-accent lg:h-screen"
      >
        <div
          ref={track}
          className="flex flex-col will-change-transform lg:h-full lg:flex-row lg:items-stretch"
        >
          <CoverageIntroSlab />
          {siteConfig.coverageLines.map((c) => (
            <CoverageSlab key={c.code} {...c} />
          ))}
          <CoverageCtaSlab href="/services" />
        </div>

        {/* progress hairline (desktop) */}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-px bg-hairline lg:block">
          <span
            ref={bar}
            className="block h-full origin-left scale-x-0 bg-accent"
          />
        </span>
      </div>
    </section>
  );
}
