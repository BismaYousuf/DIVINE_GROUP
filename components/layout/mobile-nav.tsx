"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import { NavLink } from "./nav-link";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { useUIStore } from "@/stores/ui-store";
import { siteConfig } from "@/lib/site-config";

export function MobileNav({ tone }: { tone: "light" | "dark" }) {
  const open = useUIStore((s) => s.mobileNavOpen);
  const setOpen = useUIStore((s) => s.setMobileNavOpen);
  const pathname = usePathname();

  // Close on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={`grid size-11 place-items-center rounded-[3px] lg:hidden ${
          tone === "light" ? "text-paper-hi" : "text-ink"
        }`}
      >
        <Menu className="size-6" strokeWidth={1.5} />
      </button>

      <SheetContent title="Divine Group">
        <nav
          aria-label="Primary"
          className="flex flex-1 flex-col justify-center gutter"
        >
          <ul className="flex flex-col gap-2">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <SheetClose asChild>
                  <NavLink
                    href={item.href}
                    className="text-display-m text-ink after:h-0.5"
                  >
                    {item.label}
                  </NavLink>
                </SheetClose>
              </li>
            ))}
          </ul>

          <div className="mt-12">
            <MagneticButton href={siteConfig.cta.href} className="w-full">
              {siteConfig.cta.label}
            </MagneticButton>
          </div>

          <p className="mono-label mt-10 text-graphite">
            <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>
          </p>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
