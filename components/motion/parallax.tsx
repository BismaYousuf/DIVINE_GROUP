"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP, registerGsap } from "./gsap";
import { useMotionAllowed } from "./use-motion-allowed";
import { cn } from "@/lib/utils";

type ParallaxProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** multiplier; 1 ≈ 60px of travel on desktop, clamped to 8px elsewhere */
  speed?: number;
};

export function Parallax({
  as: Tag = "div",
  children,
  className,
  speed = 1,
}: ParallaxProps) {
  const ref = useRef<HTMLElement | null>(null);
  const { reduced, desktop, ready } = useMotionAllowed();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !ready || reduced) return;
      registerGsap();

      const amount = Math.min(60 * speed, desktop ? 200 : 8);
      gsap.fromTo(
        el,
        { y: -amount },
        {
          y: amount,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    { scope: ref, dependencies: [ready, reduced, desktop] },
  );

  return (
    <Tag ref={ref as React.Ref<HTMLElement>} className={cn("will-change-transform", className)}>
      {children}
    </Tag>
  );
}
