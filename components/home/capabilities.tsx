"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, registerGsap } from "@/components/motion/gsap";
import { useMotionAllowed } from "@/components/motion/use-motion-allowed";
import { EASE } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";
import { CapabilityPanel, type Capability } from "./capability-panel";

// CLIENT TO CONFIRM — capability content
const CAPS: Capability[] = [
  {
    n: "01",
    label: "Fluency",
    body: "We come from freight. Operating ratios, CSA scores, radius filings, reefer breakdowns — we speak the language your business runs on, so nothing gets lost in translation.",
    img: "/media/cap-01.jpg",
  },
  {
    n: "02",
    label: "Strategy",
    body: "No two fleets carry the same risk, so no two programs should look alike. We structure limits, deductibles and endorsements around your lanes, your equipment and your loss history.",
    img: "/media/cap-02.jpg",
  },
  {
    n: "03",
    label: "The extra mile",
    body: "Certificates in minutes, not days. Claims advocacy that pushes back. Help fixing violations that shouldn't be on your record. The work continues long after the policy binds.",
    img: "/media/cap-03.jpg",
  },
];

function ProgressRail({ active }: { active: number }) {
  return (
    <div
      aria-hidden
      className="absolute left-[clamp(1.25rem,6vw,6rem)] top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3 lg:flex"
    >
      {CAPS.map((_, i) => (
        <span
          key={i}
          className={cn(
            "block w-px bg-hairline transition-all duration-300",
            i === active ? "h-10 bg-accent" : "h-5",
          )}
        />
      ))}
    </div>
  );
}

export function Capabilities() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { ready } = useMotionAllowed();

  useGSAP(
    () => {
      if (!root.current || !stage.current || !track.current || !ready) return;
      registerGsap();

      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop:
            "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          flow: "(max-width: 1023px), (prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { desktop } = ctx.conditions as { desktop: boolean };
          const panels = gsap.utils.toArray<HTMLElement>(
            ".cap-panel",
            track.current!,
          );
          const images = panels.map((p) =>
            p.querySelector<HTMLElement>(".cap-image img"),
          );
          const steps = panels.length - 1;

          if (desktop && steps > 0) {
            const tween = gsap.to(track.current, {
              yPercent: -100 * (steps / panels.length),
              ease: "none",
              scrollTrigger: {
                trigger: stage.current,
                start: "top top",
                end: () => `+=${window.innerHeight * steps}`,
                pin: true,
                scrub: 0.5,
                onUpdate: (self) =>
                  setActive(Math.round(self.progress * steps)),
              },
            });

            // gentle counter-parallax on each panel image
            images.forEach((img) => {
              if (!img) return;
              gsap.fromTo(
                img,
                { yPercent: -6, scale: 1.06 },
                {
                  yPercent: 6,
                  scale: 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: stage.current,
                    start: "top top",
                    end: () => `+=${window.innerHeight * steps}`,
                    scrub: true,
                  },
                },
              );
            });

            return () => {
              tween.scrollTrigger?.kill();
              tween.kill();
            };
          }

          // reduced motion: leave everything in its static, fully-visible state
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
          }

          // mobile (motion ok): reveal each panel as it enters
          panels.forEach((p, i) => {
            gsap.from(p, {
              autoAlpha: 0,
              y: 28,
              duration: 0.7,
              ease: EASE.out,
              scrollTrigger: { trigger: p, start: "top 82%", once: true },
            });
            const img = images[i];
            if (img)
              gsap.fromTo(
                img,
                { clipPath: "inset(0 0 100% 0)" },
                {
                  clipPath: "inset(0 0 0% 0)",
                  duration: 0.85,
                  ease: EASE.out,
                  scrollTrigger: { trigger: p, start: "top 82%", once: true },
                },
              );
          });
        },
      );

      return () => mm.revert();
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <section
      ref={root}
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="relative bg-paper"
    >
      <h2 id="capabilities-heading" className="sr-only">
        How we work
      </h2>

      <div
        ref={stage}
        className="relative motion-safe:overflow-hidden motion-safe:lg:h-screen"
      >
        <ProgressRail active={active} />
        <div ref={track} className="motion-safe:lg:will-change-transform">
          {CAPS.map((c) => (
            <div
              key={c.n}
              className="cap-panel mx-auto flex w-full max-w-content items-center gutter py-24 motion-safe:lg:h-screen motion-safe:lg:py-0"
            >
              <CapabilityPanel {...c} className="w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
