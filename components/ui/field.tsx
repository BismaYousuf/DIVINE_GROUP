"use client";

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type SelectHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/* ---------- shared bits ---------------------------------------------------- */

function Label({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="mono-label text-graphite">
      {children}
      {required ? <span className="text-accent"> *</span> : null}
    </label>
  );
}

function Error({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="mono-label mt-2 text-accent normal-case tracking-normal">
      {children}
    </p>
  );
}

const controlBase =
  "w-full rounded-none border-0 border-b border-hairline bg-transparent px-0 py-3 font-sans text-body text-ink placeholder:text-graphite/60 transition-colors duration-200 focus:border-accent focus:outline-none aria-[invalid=true]:border-accent";

/* ---------- Input -------------------------------------------------------- */

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: ReactNode;
  error?: ReactNode;
  required?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, required, className, id, ...props },
  ref,
) {
  const auto = useId();
  const fieldId = id ?? auto;
  const errId = `${fieldId}-error`;
  return (
    <div className="flex flex-col">
      <Label htmlFor={fieldId} required={required}>
        {label}
      </Label>
      <input
        ref={ref}
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : undefined}
        className={cn(controlBase, "mt-2", className)}
        {...props}
      />
      <Error id={errId}>{error}</Error>
    </div>
  );
});

/* ---------- Textarea --------------------------------------------------- */

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: ReactNode;
  error?: ReactNode;
  required?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { label, error, required, className, id, rows = 4, ...props },
    ref,
  ) {
    const auto = useId();
    const fieldId = id ?? auto;
    const errId = `${fieldId}-error`;
    return (
      <div className="flex flex-col">
        <Label htmlFor={fieldId} required={required}>
          {label}
        </Label>
        <textarea
          ref={ref}
          id={fieldId}
          rows={rows}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errId : undefined}
          className={cn(controlBase, "mt-2 resize-y", className)}
          {...props}
        />
        <Error id={errId}>{error}</Error>
      </div>
    );
  },
);

/* ---------- Select --------------------------------------------------- */

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: ReactNode;
  error?: ReactNode;
  required?: boolean;
  children: ReactNode;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, required, className, id, children, ...props },
  ref,
) {
  const auto = useId();
  const fieldId = id ?? auto;
  const errId = `${fieldId}-error`;
  return (
    <div className="flex flex-col">
      <Label htmlFor={fieldId} required={required}>
        {label}
      </Label>
      <select
        ref={ref}
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : undefined}
        className={cn(controlBase, "mt-2 appearance-none", className)}
        {...props}
      >
        {children}
      </select>
      <Error id={errId}>{error}</Error>
    </div>
  );
});

/* ---------- Checkbox ------------------------------------------------- */

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: ReactNode;
  error?: ReactNode;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ label, error, className, id, ...props }, ref) {
    const auto = useId();
    const fieldId = id ?? auto;
    const errId = `${fieldId}-error`;
    return (
      <div className="flex flex-col">
        <label htmlFor={fieldId} className="flex items-start gap-3 text-caption text-graphite">
          <input
            ref={ref}
            id={fieldId}
            type="checkbox"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errId : undefined}
            className={cn(
              "mt-0.5 size-4 shrink-0 rounded-none border border-ink/40 text-accent accent-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              className,
            )}
            {...props}
          />
          <span>{label}</span>
        </label>
        <Error id={errId}>{error}</Error>
      </div>
    );
  },
);
