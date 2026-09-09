"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, registerGsap } from "./gsap";
import { useMotionAllowed } from "./use-motion-allowed";
import { EASE, DUR, STAGGER } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";

type SplitLinesProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  start?: string;
  /** play immediately on mount instead of on scroll (hero headline) */
  immediate?: boolean;
};

/**
 * Line-by-line mask reveal of the element's text. Waits for fonts so line
 * breaks are correct, reverts the SplitText after playing, and renders the
 * text statically when reduced motion is on.
 */
export function SplitLines({
  as: Tag = "div",
  children,
  className,
  id,
  delay = 0,
  start = "top 85%",
  immediate = false,
}: SplitLinesProps) {
  const ref = useRef<HTMLElement | null>(null);
  const { reduced, ready } = useMotionAllowed();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !ready || reduced) return;
      registerGsap();

      let split: SplitText | undefined;

      const run = () => {
        if (!ref.current) return;
        split = new SplitText(ref.current, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
        });
        gsap.set(split.lines, { yPercent: 115 });
        gsap.to(split.lines, {
          yPercent: 0,
          duration: DUR.enter,
          ease: EASE.outStrong,
          stagger: STAGGER.tight,
          delay,
          scrollTrigger: immediate
            ? undefined
            : { trigger: ref.current, start, once: true },
          onComplete: () => split?.revert(),
        });
      };

      if (document.fonts && document.fonts.status !== "loaded") {
        document.fonts.ready.then(run);
      } else {
        run();
      }

      return () => split?.revert();
    },
    { scope: ref, dependencies: [ready, reduced] },
  );

  return (
    <Tag id={id} ref={ref as React.Ref<HTMLElement>} className={cn(className)}>
      {children}
    </Tag>
  );
}
