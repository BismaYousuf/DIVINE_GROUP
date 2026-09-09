"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Observer } from "gsap/Observer";
import { useGSAP } from "@gsap/react";

let registered = false;

/** Register GSAP plugins once, client-side only. Safe to call repeatedly. */
export function registerGsap(): void {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, SplitText, Observer);
  registered = true;
}

export { gsap, ScrollTrigger, SplitText, Observer, useGSAP };
