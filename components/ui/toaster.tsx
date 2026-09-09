"use client";

import { Toaster as Sonner } from "sonner";

/**
 * Toasts are transient feedback only. Styled to the ink/paper system,
 * bottom-right on desktop and effectively full-width bottom-center on mobile
 * (Sonner handles the small-screen layout).
 */
export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      gap={10}
      offset={20}
      toastOptions={{
        classNames: {
          toast:
            "!rounded-[3px] !border !border-hairline !bg-paper-hi !text-ink !font-sans !text-[0.9rem] !shadow-lg",
          title: "!font-medium",
          description: "!text-graphite",
          actionButton: "!bg-accent !text-paper-hi !rounded-[2px]",
          cancelButton: "!bg-transparent !text-graphite",
          error: "!border-accent/40",
          success: "!border-ink/15",
        },
      }}
    />
  );
}
