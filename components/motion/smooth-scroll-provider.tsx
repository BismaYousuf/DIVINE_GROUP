"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsap } from "./gsap";
import { useMotionAllowed } from "./use-motion-allowed";

/**
 * Drives Lenis smooth scroll from the GSAP ticker and keeps ScrollTrigger in
 * sync. No-ops entirely when the user prefers reduced motion — native scroll,
 * ScrollTriggers still fire and set their final state.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const { reduced, ready } = useMotionAllowed();

  useEffect(() => {
    if (!ready) return;
    registerGsap();

    if (reduced) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    if (process.env.NODE_ENV !== "production") {
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    }

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [reduced, ready]);

  return <>{children}</>;
}
