"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP, registerGsap } from "./gsap";
import { useMotionAllowed } from "./use-motion-allowed";
import { EASE, DUR, STAGGER } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";

type RevealProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** rise distance in px */
  y?: number;
  delay?: number;
  /** animate direct children in sequence instead of the container as one */
  stagger?: boolean;
  /** ScrollTrigger start */
  start?: string;
};

export function Reveal({
  as: Tag = "div",
  children,
  className,
  y = 24,
  delay = 0,
  stagger = false,
  start = "top 85%",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const { reduced, ready } = useMotionAllowed();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !ready || reduced) return;
      registerGsap();

      const targets = stagger ? Array.from(el.children) : el;
      gsap.set(targets, { autoAlpha: 0, y });
      gsap.to(targets, {
        autoAlpha: 1,
        y: 0,
        duration: DUR.enter,
        ease: EASE.out,
        delay,
        stagger: stagger ? STAGGER.base : 0,
        scrollTrigger: { trigger: el, start, once: true },
      });
    },
    { scope: ref, dependencies: [ready, reduced] },
  );

  return (
    <Tag ref={ref as React.Ref<HTMLElement>} className={cn(className)}>
      {children}
    </Tag>
  );
}
