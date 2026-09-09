"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "./gsap";
import { useMotionAllowed } from "./use-motion-allowed";
import { EASE } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "paper";

const base =
  "group relative inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-[3px] px-7 font-sans text-[0.9375rem] font-medium tracking-tight transition-colors duration-200 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-paper-hi hover:bg-accent-press",
  ghost:
    "border border-ink/25 text-ink hover:border-ink hover:bg-ink/[0.04]",
  paper:
    "bg-paper-hi text-ink hover:bg-paper",
};

type MagneticButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: Variant;
  className?: string;
  "aria-label"?: string;
};

export function MagneticButton({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  className,
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const { reduced, ready, finePointer } = useMotionAllowed();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !ready || reduced || !finePointer) return;

      const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: EASE.micro });
      const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: EASE.micro });

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo(gsap.utils.clamp(-6, 6, (e.clientX - (r.left + r.width / 2)) * 0.3));
        yTo(gsap.utils.clamp(-6, 6, (e.clientY - (r.top + r.height / 2)) * 0.3));
      };
      const reset = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", reset);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", reset);
      };
    },
    { dependencies: [ready, reduced, finePointer] },
  );

  const cls = cn(base, variants[variant], className);

  if (href) {
    return (
      <Link ref={ref} href={href} onClick={onClick} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <button ref={ref} type={type} onClick={onClick} className={cls} {...rest}>
      {children}
    </button>
  );
}
