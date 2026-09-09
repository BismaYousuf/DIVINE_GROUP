"use client";

import type { Dispatch, SetStateAction } from "react";
import { Plus, Minus } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/field";
import type { QuoteInput } from "@/lib/validations/quote";

export function VinRepeater({
  register,
  count,
  setCount,
  errors,
}: {
  register: UseFormRegister<QuoteInput>;
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
  errors?: Array<string | undefined>;
}) {
  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2">
        {Array.from({ length: count }).map((_, i) => (
          <Input
            key={i}
            label={`VIN ${i + 1}`}
            maxLength={17}
            autoComplete="off"
            className="uppercase"
            error={errors?.[i]}
            {...register(`vins.${i}` as const)}
          />
        ))}
      </div>

      <div className="mt-5 flex items-center gap-6">
        <button
          type="button"
          onClick={() => setCount((c) => c + 1)}
          className="mono-label inline-flex items-center gap-2 text-ink transition-colors hover:text-accent"
        >
          <Plus className="size-4" strokeWidth={1.5} />
          Add another vehicle
        </button>
        {count > 5 ? (
          <button
            type="button"
            onClick={() => setCount((c) => c - 1)}
            className="mono-label inline-flex items-center gap-2 text-graphite transition-colors hover:text-ink"
          >
            <Minus className="size-4" strokeWidth={1.5} />
            Remove
          </button>
        ) : null}
      </div>

      {count > 5 ? (
        <p className="mt-5 max-w-[54ch] border-l-2 border-accent pl-4 text-caption text-ink">
          More than five vehicles? You can leave these blank and attach a full
          vehicle list as an Excel file in the Attachments section below.
        </p>
      ) : null}
    </div>
  );
}
