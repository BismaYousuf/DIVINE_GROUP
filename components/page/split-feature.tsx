"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, registerGsap } from "@/components/motion/gsap";
import { useMotionAllowed } from "@/components/motion/use-motion-allowed";
import { Reveal } from "@/components/motion/reveal";
import { EASE } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";

export function SplitFeature({
  label,
  title,
  body,
  img,
  imageSide = "right",
  cta,
}: {
  label?: string;
  title: string;
  body: string;
  img: string;
  imageSide?: "left" | "right";
  cta?: { label: string; href: string };
}) {
  const imgRef = useRef<HTMLDivElement>(null);
  const { reduced, ready } = useMotionAllowed();

  useGSAP(
    () => {
      if (!imgRef.current || !ready || reduced) return;
      registerGsap();
      gsap.fromTo(
        imgRef.current,
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 0.9,
          ease: EASE.out,
          scrollTrigger: { trigger: imgRef.current, start: "top 82%", once: true },
        },
      );
    },
    { scope: imgRef, dependencies: [ready, reduced] },
  );

  return (
    <div className="mx-auto grid max-w-content items-center gap-10 gutter lg:grid-cols-2 lg:gap-16">
      <div className={cn(imageSide === "left" && "lg:order-2")}>
        {label ? <p className="mono-label text-graphite">{label}</p> : null}
        <Reveal>
          <h2 className="mt-4 max-w-[16ch] font-display text-display-m font-medium leading-[1.05]">
            {title}
          </h2>
          <p className="mt-5 max-w-[52ch] text-body-l text-graphite">{body}</p>
          {cta ? (
            <p className="mt-7">
              <a
                href={cta.href}
                className="group inline-flex items-center gap-2 text-[0.9375rem] text-ink"
              >
                {cta.label}
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
            </p>
          ) : null}
        </Reveal>
      </div>

      <div
        ref={imgRef}
        className={cn(
          "relative aspect-[4/3] w-full overflow-hidden",
          imageSide === "left" && "lg:order-1",
        )}
      >
        <Image
          src={img}
          alt=""
          fill
          sizes="(min-width: 1024px) 45vw, 90vw"
          className="object-cover [filter:grayscale(1)_contrast(1.05)]"
        />
      </div>
    </div>
  );
}
