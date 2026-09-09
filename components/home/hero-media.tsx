"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, registerGsap } from "@/components/motion/gsap";
import { useMotionAllowed } from "@/components/motion/use-motion-allowed";
import { EASE, DUR } from "@/lib/motion/tokens";
import { heroFramesEnabled } from "@/lib/hero-frames";
import { HeroFrameSequence } from "./hero-frame-sequence";

/**
 * The hero's media layer. When hero frames are supplied (lib/hero-frames.ts)
 * and the viewport can take it, the still image is swapped for the
 * scroll-scrubbed canvas sequence. Otherwise it's the Phase 1 static image
 * with a clip-wipe entrance and a slow parallax scale.
 */
export function HeroMedia() {
  const root = useRef<HTMLDivElement>(null);
  const imageWrap = useRef<HTMLDivElement>(null);
  const { reduced, ready, desktop } = useMotionAllowed();

  useGSAP(
    () => {
      if (!root.current || !imageWrap.current || !ready || reduced) return;
      registerGsap();

      gsap.fromTo(
        root.current,
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: DUR.cinematic, ease: EASE.expo },
      );

      gsap.fromTo(
        imageWrap.current,
        { scale: 1.14, yPercent: -3 },
        {
          scale: 1,
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    { scope: root, dependencies: [ready, reduced] },
  );

  if (heroFramesEnabled && ready && desktop && !reduced) {
    return <HeroFrameSequence />;
  }

  return (
    <div ref={root} className="absolute inset-0 z-0">
      <div ref={imageWrap} className="absolute inset-0 will-change-transform">
        <Image
          src="/media/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover filter-[grayscale(1)_contrast(1.08)_brightness(0.82)]"
        />
      </div>
      {/* duotone + legibility wash */}
      <div className="absolute inset-0 bg-ink/55" />
      <div className="absolute inset-0 bg-accent/10 mix-blend-overlay" />
      <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/25 to-ink/45" />
    </div>
  );
}
