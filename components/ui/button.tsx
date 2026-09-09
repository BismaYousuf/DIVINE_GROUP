import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const button = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[3px] font-sans font-medium tracking-tight transition-colors duration-200 select-none disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  {
    variants: {
      variant: {
        primary: "bg-accent text-paper-hi hover:bg-accent-press",
        outline:
          "border border-ink/25 text-ink hover:border-ink hover:bg-ink/[0.04]",
        ghost: "text-ink hover:bg-ink/[0.05]",
        paper: "bg-paper-hi text-ink hover:bg-paper",
      },
      size: {
        md: "h-12 px-7 text-[0.9375rem]",
        sm: "h-10 px-5 text-[0.875rem]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(button({ variant, size }), className)} {...props} />
  );
}

export { button as buttonVariants };
