"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;
export const SheetTitle = Dialog.Title;

export function SheetContent({
  children,
  className,
  title = "Menu",
}: {
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40 data-[state=open]:animate-[fade-in_180ms_ease] data-[state=closed]:animate-[fade-out_150ms_ease]" />
      <Dialog.Content
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-paper text-ink shadow-2xl outline-none",
          "data-[state=open]:animate-[slide-in_260ms_cubic-bezier(0.16,1,0.3,1)] data-[state=closed]:animate-[slide-out_200ms_ease]",
          className,
        )}
      >
        <div className="flex items-center justify-between gutter pt-6">
          <SheetTitle className="mono-label text-graphite">{title}</SheetTitle>
          <Dialog.Close
            aria-label="Close menu"
            className="grid size-11 place-items-center rounded-[3px] text-ink transition-colors hover:bg-ink/[0.05] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <X className="size-5" strokeWidth={1.5} />
          </Dialog.Close>
        </div>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
