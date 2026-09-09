"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  registerGsap,
} from "@/components/motion/gsap";
import { useMotionAllowed } from "@/components/motion/use-motion-allowed";
import { SplitLines } from "@/components/motion/split-lines";
import { useUIStore } from "@/stores/ui-store";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function DivineDifference() {
  const root = useRef<HTMLElement>(null);
  const bloomA = useRef<HTMLDivElement>(null);
  const bloomB = useRef<HTMLDivElement>(null);
  const { reduced, ready, desktop } = useMotionAllowed();
  const setHeaderInverted = useUIStore((s) => s.setHeaderInverted);

  useGSAP(
    () => {
      if (!root.current || !ready) return;
      registerGsap();

      // Header inversion while this dark band is under the header.
      const invertTrigger = ScrollTrigger.create({
        trigger: root.current,
        start: "top 72px",
        end: "bottom 72px",
        invalidateOnRefresh: true,
        onToggle: (self) => setHeaderInverted(self.isActive),
        onRefresh: (self) => setHeaderInverted(self.isActive),
      });

      if (reduced) return () => invertTrigger.kill();

      const amt = desktop ? 80 : 8;
      [bloomA.current, bloomB.current].forEach((el, i) => {
        if (!el) return;
        const d = amt * (i ? 0.55 : 1);
        gsap.fromTo(
          el,
          { yPercent: -d },
          {
            yPercent: d,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      return () => invertTrigger.kill();
    },
    { scope: root, dependencies: [ready, reduced, desktop] },
  );

  return (
    <section
      ref={root}
      id="difference"
      data-invert-header
      aria-labelledby="difference-heading"
      className="relative isolate overflow-hidden bg-night text-night-fg section-y"
    >
      <div
        ref={bloomA}
        aria-hidden
        className="pointer-events-none absolute -left-[12%] top-[6%] -z-10 size-[46vw] rounded-full bg-amber/20 blur-[130px] will-change-transform"
      />
      <div
        ref={bloomB}
        aria-hidden
        className="pointer-events-none absolute -right-[6%] bottom-[2%] -z-10 size-[40vw] rounded-full bg-accent/20 blur-[150px] will-change-transform"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05] mix-blend-screen"
        style={{ backgroundImage: GRAIN }}
      />

      <div className="mx-auto grid max-w-content gap-12 gutter lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="mono-label text-amber">04 — Difference</p>
          {/* CLIENT TO CONFIRM — difference statement */}
          <SplitLines
            as="h2"
            id="difference-heading"
            className="mt-6 max-w-[18ch] font-display text-display-l font-medium leading-[1.03]"
          >
            Anyone can bind a policy. We&rsquo;re the number you call when a load
            is on its side at 2 a.m.
          </SplitLines>
        </div>

        <Link
          href="/our-difference"
          className="group inline-flex items-center gap-3 self-start whitespace-nowrap text-body-l text-night-fg lg:self-end"
        >
          <span className="relative">
            Our Difference
            <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-amber transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100" />
          </span>
          <ArrowRight
            className="size-5 transition-transform duration-300 group-hover:translate-x-1"
            strokeWidth={1.5}
          />
        </Link>
      </div>
    </section>
  );
}
