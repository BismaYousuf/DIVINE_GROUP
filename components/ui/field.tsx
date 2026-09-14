"use client";

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type ReactNode,
} from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
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
    <label htmlFor={htmlFor} className="mono-label font-semibold text-graphite">
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

type SelectOption = { value: string; label: ReactNode };

type SelectProps = {
  label: ReactNode;
  error?: ReactNode;
  required?: boolean;
  className?: string;
  id?: string;
  name?: string;
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
};

/**
 * A native <select>'s popup (the <option> list) is rendered by the OS/browser
 * and can't be styled — it always breaks from the rest of the form's look.
 * Built on Radix Select instead so the open panel matches the site.
 */
export function Select({
  label,
  error,
  required,
  className,
  id,
  name,
  options,
  placeholder = "Select…",
  value,
  onValueChange,
  onBlur,
  disabled,
}: SelectProps) {
  const auto = useId();
  const fieldId = id ?? auto;
  const errId = `${fieldId}-error`;
  return (
    <div className="flex flex-col">
      <Label htmlFor={fieldId} required={required}>
        {label}
      </Label>
      <SelectPrimitive.Root
        value={value || undefined}
        onValueChange={onValueChange}
        name={name}
        disabled={disabled}
      >
        <SelectPrimitive.Trigger
          id={fieldId}
          onBlur={onBlur}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errId : undefined}
          className={cn(
            controlBase,
            "mt-2 flex items-center justify-between gap-2 text-left",
            !value && "text-graphite/60",
            className,
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon>
            <ChevronDown
              aria-hidden
              strokeWidth={1.5}
              className="size-4 shrink-0 text-graphite"
            />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={8}
            className="z-50 max-h-72 w-[var(--radix-select-trigger-width)] overflow-hidden border border-hairline bg-paper shadow-[0_12px_32px_rgba(11,11,12,0.12)]"
          >
            <SelectPrimitive.Viewport className="p-1">
              {options.map((opt) => (
                <SelectPrimitive.Item
                  key={opt.value}
                  value={opt.value}
                  className="relative flex cursor-pointer select-none items-center justify-between gap-2 px-3 py-2.5 font-sans text-body text-ink outline-none data-[highlighted]:bg-ink/[0.04] data-[highlighted]:outline-none data-[state=checked]:text-accent"
                >
                  <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator>
                    <Check aria-hidden strokeWidth={1.5} className="size-4" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      <Error id={errId}>{error}</Error>
    </div>
  );
}

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
