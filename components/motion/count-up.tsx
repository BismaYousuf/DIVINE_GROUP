"use client";

import { useRef } from "react";
import { gsap, useGSAP, registerGsap } from "./gsap";
import { useMotionAllowed } from "./use-motion-allowed";
import { EASE } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";

type CountUpProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
};

/**
 * Server-renders the final value (good for no-JS and SEO), then counts up from
 * zero when it scrolls into view. Shows the final value immediately under
 * reduced motion.
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const { reduced, ready } = useMotionAllowed();

  const format = (n: number) =>
    `${prefix}${n.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (!ready || reduced) {
        el.textContent = format(value);
        return;
      }
      registerGsap();
      const obj = { v: 0 };
      el.textContent = format(0);
      gsap.to(obj, {
        v: value,
        duration: 1.4,
        ease: EASE.out,
        onUpdate: () => {
          el.textContent = format(obj.v);
        },
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    },
    { dependencies: [ready, reduced, value] },
  );

  return (
    <span ref={ref} className={cn("tnum", className)}>
      {format(value)}
    </span>
  );
}
