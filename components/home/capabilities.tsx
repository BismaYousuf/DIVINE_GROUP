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
            stage.current!,
          );
          const images = panels.map((p) =>
            p.querySelector<HTMLElement>(".cap-image img"),
          );
          const steps = panels.length - 1;

          if (desktop && steps > 0) {
            // Stacked cards. Every panel is absolutely layered inside the pinned
            // stage (see the `motion-safe:lg:` classes on `.cap-panel`), panel 1
            // on top via z-index. One scrubbed timeline: each panel except the
            // last holds readable for ~66% of its segment, then slides up and
            // fades. The next panel is revealed with a cross-dissolve timed to
            // the outgoing one clearing — it's held hidden until then so the
            // transparent panels never let the waiting copy bleed through.
            gsap.set(panels, {
              yPercent: 0,
              transformOrigin: "50% 50%",
            });
            panels.forEach((p, i) =>
              gsap.set(p, {
                autoAlpha: i === 0 ? 1 : 0,
                scale: i === 0 ? 1 : 0.94,
              }),
            );

            const tl = gsap.timeline({
              defaults: { ease: EASE.out },
              scrollTrigger: {
                trigger: stage.current,
                start: "top top",
                end: () => `+=${window.innerHeight * steps}`,
                pin: true,
                scrub: 0.5,
                invalidateOnRefresh: true,
                onUpdate: (self) =>
                  setActive(Math.round(self.progress * steps)),
              },
            });

            panels.forEach((p, i) => {
              const img = images[i];
              if (img) {
                // counter-parallax across the whole pinned range
                tl.fromTo(
                  img,
                  { yPercent: -6, scale: 1.06 },
                  { yPercent: 6, scale: 1, ease: "none", duration: steps },
                  0,
                );
              }
              if (i > 0) {
                // fade + settle in — lands exactly as the panel above clears
                tl.to(
                  p,
                  {
                    autoAlpha: 1,
                    scale: 1,
                    duration: 0.3,
                    immediateRender: false,
                  },
                  i - 0.3,
                );
              }
              if (i < steps) {
                // travel up and off, fading, near the end of this segment
                tl.to(
                  p,
                  {
                    yPercent: -100,
                    autoAlpha: 0,
                    scale: 0.96,
                    duration: 0.34,
                    immediateRender: false,
                  },
                  i + 0.66,
                );
              }
            });

            return () => {
              tl.scrollTrigger?.kill();
              tl.kill();
            };
          }

          // reduced motion: leave everything in its static, fully-visible state
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
          }

          // mobile (motion ok): reveal each panel as it enters normal flow
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
        <div ref={track}>
          {CAPS.map((c, i) => (
            <div
              key={c.n}
              style={{ zIndex: CAPS.length - i }}
              className="cap-panel mx-auto flex w-full max-w-content items-center gutter py-10 md:py-14 motion-safe:lg:absolute motion-safe:lg:inset-0 motion-safe:lg:h-screen motion-safe:lg:py-0 motion-safe:lg:will-change-[transform,opacity]"
            >
              <CapabilityPanel {...c} className="w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
