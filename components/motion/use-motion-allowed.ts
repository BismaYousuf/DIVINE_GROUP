"use client";

import { useEffect, useState } from "react";
import { DESKTOP_MIN } from "@/lib/motion/tokens";

export type MotionState = {
  /** OS "reduce motion" is on — render everything in its final state. */
  reduced: boolean;
  /** Viewport is wide enough for pins / horizontal scroll / heavy parallax. */
  desktop: boolean;
  /** matchMedia has been read at least once (avoids animating during hydration). */
  ready: boolean;
  /** Device has a precise pointer (enables magnetic hover). */
  finePointer: boolean;
};

const initial: MotionState = {
  reduced: false,
  desktop: false,
  ready: false,
  finePointer: false,
};

export function useMotionAllowed(): MotionState {
  const [state, setState] = useState<MotionState>(initial);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia(`(min-width: ${DESKTOP_MIN}px)`);
    const fine = window.matchMedia("(pointer: fine)");

    const update = () =>
      setState({
        reduced: reduce.matches,
        desktop: desktop.matches,
        finePointer: fine.matches,
        ready: true,
      });

    update();
    reduce.addEventListener("change", update);
    desktop.addEventListener("change", update);
    fine.addEventListener("change", update);
    return () => {
      reduce.removeEventListener("change", update);
      desktop.removeEventListener("change", update);
      fine.removeEventListener("change", update);
    };
  }, []);

  return state;
}
