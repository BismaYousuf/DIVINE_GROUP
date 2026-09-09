"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { NavLink } from "./nav-link";
import { MobileNav } from "./mobile-nav";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { useUIStore } from "@/stores/ui-store";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const ref = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const invert = useUIStore((s) => s.headerInverted);

  // Scroll position + direction (works with Lenis, which updates native scroll).
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        setHidden(y > 160 && y > last + 4);
        if (Math.abs(y - last) > 4) last = y;
        raf = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const onDark = !scrolled || invert;
  const tone: "light" | "dark" = onDark ? "light" : "dark";

  return (
    <header
      ref={ref}
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[transform,background-color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        hidden ? "-translate-y-full" : "translate-y-0",
        scrolled && !invert && "border-b border-hairline bg-paper/80 backdrop-blur-md",
        scrolled && invert && "border-b border-white/10 bg-night/80 backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-16 max-w-content items-center justify-between gutter">
        <Link
          href="/"
          className={cn(
            "font-mono text-[0.8125rem] font-medium uppercase tracking-[0.2em] transition-colors",
            onDark ? "text-paper-hi" : "text-ink",
          )}
        >
          {siteConfig.name}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-10 lg:flex">
          <ul
            className={cn(
              "flex items-center gap-9 transition-colors",
              onDark ? "text-paper-hi" : "text-ink",
            )}
          >
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
          <MagneticButton href={siteConfig.cta.href} className="h-10 px-6 text-[0.875rem]">
            {siteConfig.cta.label}
          </MagneticButton>
        </nav>

        <MobileNav tone={tone} />
      </div>
    </header>
  );
}
