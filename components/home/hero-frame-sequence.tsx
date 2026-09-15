"use client";

import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger, registerGsap } from "@/components/motion/gsap";
import { HERO_FRAME_COUNT, heroFramePath } from "@/lib/hero-frames";

/**
 * Canvas frame-by-frame scrub of the hero. No pin — the frames advance across
 * the hero's natural scroll-out, so it never fights the pinned sections below.
 * Shows the static poster until every frame has decoded. Only mounted on
 * desktop with motion allowed — see HeroMedia.
 */
export function HeroFrameSequence() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas || HERO_FRAME_COUNT < 2) return;
    registerGsap();

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const section = wrap.closest("section") ?? wrap;
    const images: HTMLImageElement[] = [];
    const state = { frame: 0 };
    let loaded = 0;
    let mounted = true;

    const draw = () => {
      const img = images[Math.round(state.frame)];
      if (!img || !img.complete || img.naturalWidth === 0) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = cw / ch;
      let dw: number, dh: number, dx: number, dy: number;
      if (ir > cr) {
        dh = ch;
        dw = ch * ir;
        dx = (cw - dw) / 2;
        dy = 0;
      } else {
        dw = cw;
        dh = cw / ir;
        dx = 0;
        dy = (ch - dh) / 2;
      }
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(wrap.clientWidth * dpr);
      canvas.height = Math.round(wrap.clientHeight * dpr);
      draw();
    };

    for (let i = 0; i < HERO_FRAME_COUNT; i++) {
      const img = document.createElement("img");
      img.decoding = "async";
      // Deprioritize below the poster image, which is the actual LCP
      // candidate — these 98 frames shouldn't compete with it for bandwidth.
      img.fetchPriority = "low";
      img.onload = () => {
        if (!mounted) return;
        loaded += 1;
        setProgress(loaded / HERO_FRAME_COUNT);
        if (loaded === 1) resize();
        if (loaded === HERO_FRAME_COUNT) draw();
      };
      img.src = heroFramePath(i);
      images[i] = img;
    }

    // Scrub the frames across the hero's natural exit — no pin, so it never
    // fights the pinned sections that follow. Frame 0 when the hero fills the
    // viewport, last frame when it has scrolled fully past.
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom top",
      scrub: 0.5,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        state.frame = self.progress * (HERO_FRAME_COUNT - 1);
        draw();
      },
    });

    window.addEventListener("resize", resize);
    resize();

    return () => {
      mounted = false;
      window.removeEventListener("resize", resize);
      st.kill();
      images.forEach((im) => {
        im.onload = null;
        im.src = "";
      });
    };
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0 z-0">
      {/* poster until frames decode */}
      <NextImage
        src="/media/hero.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover filter-[grayscale(1)_contrast(1.05)_brightness(1.05)]"
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full filter-[grayscale(1)_contrast(1.05)_brightness(1.05)]"
        style={{ opacity: progress >= 1 ? 1 : 0, transition: "opacity .4s" }}
      />
      <div className="absolute inset-0 bg-ink/30" />
      <div className="absolute inset-0 bg-accent/10 mix-blend-overlay" />
      <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/25 to-ink/45" />
      {progress > 0 && progress < 1 ? (
        <p className="mono-label tnum absolute bottom-6 left-1/2 -translate-x-1/2 text-paper-hi/40">
          Loading {Math.round(progress * 100)}%
        </p>
      ) : null}
    </div>
  );
}
