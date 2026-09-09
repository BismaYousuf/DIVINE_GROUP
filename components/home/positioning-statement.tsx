"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, registerGsap } from "@/components/motion/gsap";
import { useMotionAllowed } from "@/components/motion/use-motion-allowed";

const INK = "#0b0b0c";
const EMBER = "#d64222";

const SENTENCE =
  "You don't need more insurance. You need the right coverage, built around how you actually run.";

export function PositioningStatement() {
  const section = useRef<HTMLElement>(null);
  const text = useRef<HTMLParagraphElement>(null);
  const { reduced, ready } = useMotionAllowed();

  useGSAP(
    () => {
      if (!section.current || !text.current || !ready) return;
      registerGsap();

      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce), (max-width: 1023px)",
        },
        (ctx) => {
          const conditions = ctx.conditions as {
            desktop: boolean;
            reduced: boolean;
          };
          const split = new SplitText(text.current!, { type: "words" });
          const words = split.words as HTMLElement[];

          if (conditions.reduced) {
            gsap.set(words.slice(-4), { color: EMBER });
            return () => split.revert();
          }

          gsap.set(words, { color: INK });
          gsap.set(words.slice(-4), { color: INK });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section.current,
              start: "top top",
              end: "+=90%",
              pin: true,
              scrub: 0.6,
            },
          });

          tl.to(words, {
            color: EMBER,
            ease: "none",
            stagger: { each: 0.045, from: "start" },
            duration: 0.6,
          });

          return () => split.revert();
        },
      );

      return () => mm.revert();
    },
    { scope: section, dependencies: [ready, reduced] },
  );

  return (
    <section
      ref={section}
      aria-labelledby="positioning-heading"
      className="relative flex min-h-[70svh] items-center bg-paper section-y"
    >
      <span className="mono-label absolute left-[clamp(1.25rem,6vw,6rem)] top-[clamp(2rem,8vh,5rem)] text-graphite">
        01 — Position
      </span>
      <div className="mx-auto w-full max-w-content gutter">
        <p
          ref={text}
          id="positioning-heading"
          className="mx-auto max-w-[20ch] text-center font-display text-[clamp(1.9rem,4.4vw,3.5rem)] font-medium leading-[1.12] tracking-[-0.02em] md:max-w-[24ch]"
        >
          {SENTENCE}
        </p>
      </div>
    </section>
  );
}
