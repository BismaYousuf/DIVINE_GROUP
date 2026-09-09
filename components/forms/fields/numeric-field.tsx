"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { Input } from "@/components/ui/field";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: ReactNode;
  error?: ReactNode;
  required?: boolean;
};

/** Text input that only allows digits (typing, paste and drop all filtered). */
export const NumericField = forwardRef<HTMLInputElement, Props>(
  function NumericField({ maxLength = 8, ...props }, ref) {
    return (
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={maxLength}
        onBeforeInput={(e) => {
          const data = (e.nativeEvent as InputEvent).data;
          if (data && /\D/.test(data)) e.preventDefault();
        }}
        {...props}
      />
    );
  },
);
