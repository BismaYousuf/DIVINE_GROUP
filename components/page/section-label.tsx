import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionLabel({
  children,
  className,
  sticky = true,
}: {
  children: ReactNode;
  className?: string;
  sticky?: boolean;
}) {
  return (
    <p
      className={cn(
        "mono-label text-graphite",
        sticky && "lg:sticky lg:top-24",
        className,
      )}
    >
      {children}
    </p>
  );
}
