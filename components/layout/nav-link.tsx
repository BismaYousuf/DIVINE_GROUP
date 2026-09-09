import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Text link with a left-anchored underline wipe on hover / focus. */
export function NavLink({
  href,
  children,
  className,
  onClick,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "relative inline-block py-1 font-sans text-[0.9375rem] tracking-tight transition-opacity",
        "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:after:scale-x-100 focus-visible:after:scale-x-100 focus-visible:outline-none",
        className,
      )}
    >
      {children}
    </Link>
  );
}
