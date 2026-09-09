"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  inlineQuoteSchema,
  type InlineQuoteInput,
} from "@/lib/validations/quote";
import { Input, Textarea, Select, Checkbox } from "@/components/ui/field";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { US_STATES, siteConfig } from "@/lib/site-config";

export function InlineQuoteForm() {
  const [done, setDone] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InlineQuoteInput>({
    resolver: zodResolver(inlineQuoteSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      state: "",
      coverageInterest: "",
      consent: false,
      company_website: "",
    },
  });

  async function onSubmit(values: InlineQuoteInput) {
    const fd = new FormData();
    for (const [k, v] of Object.entries(values)) {
      fd.set(k, typeof v === "boolean" ? String(v) : (v ?? ""));
    }

    const request = fetch("/api/quote", { method: "POST", body: fd }).then(
      async (res) => {
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(body.error || "Request failed.");
        }
        return res.json();
      },
    );

    toast.promise(request, {
      loading: "Sending your request…",
      success: "Sent — a specialist will be in touch.",
      error: (e: Error) =>
        e.message || "Couldn't send. Please try again or email us.",
    });

    try {
      await request;
      setDone(values.name.split(" ")[0] || "");
    } catch {
      /* toast already surfaced the error; keep the form populated */
    }
  }

  if (done !== null) {
    return (
      <div className="border-t border-hairline pt-10">
        <p className="mono-label text-accent">Received</p>
        <p className="mt-4 max-w-[40ch] text-body-l text-ink">
          Thanks{done ? `, ${done}` : ""}. A Divine Group specialist will review
          your operation and reach out within one business day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-7"
    >
      {/* honeypot — real users never see or fill this */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
        {...register("company_website")}
      />

      <div className="grid gap-7 sm:grid-cols-2">
        <Input
          label="Name"
          required
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Email"
          required
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Phone"
          required
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <Input
          label="Company / DOT #"
          autoComplete="organization"
          error={errors.company?.message}
          {...register("company")}
        />
      </div>

      <Select label="State" error={errors.state?.message} {...register("state")}>
        <option value="">Select a state</option>
        {US_STATES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </Select>

      <Textarea
        label="What coverage are you looking for?"
        required
        rows={4}
        placeholder="e.g. auto liability + cargo for 8 power units, effective next month"
        error={errors.coverageInterest?.message}
        {...register("coverageInterest")}
      />

      <Checkbox
        error={errors.consent?.message}
        label={
          <>
            I agree to be contacted about my quote. See our{" "}
            <a href="/privacy-policy" className="underline hover:text-ink">
              Privacy Policy
            </a>
            .
          </>
        }
        {...register("consent")}
      />

      <div className="flex flex-wrap items-center gap-4">
        <MagneticButton type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? "Sending…" : "Request my quote"}
        </MagneticButton>
        <a
          href={siteConfig.phoneHref}
          className="mono-label text-graphite transition-colors hover:text-ink"
        >
          or call {siteConfig.phone}
        </a>
      </div>
    </form>
  );
}
