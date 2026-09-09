"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { quoteSchema, type QuoteInput } from "@/lib/validations/quote";
import { Input, Textarea, Checkbox } from "@/components/ui/field";
import { NumericField } from "@/components/forms/fields/numeric-field";
import { VinRepeater } from "@/components/forms/fields/vin-repeater";
import { FileUploadRow } from "@/components/forms/fields/file-upload-row";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { Reveal } from "@/components/motion/reveal";
import { SectionLabel } from "@/components/page/section-label";
import { ACCEPT_DOCS, ACCEPT_SHEET } from "@/lib/files";
import { siteConfig } from "@/lib/site-config";

const DOC_ROWS = [
  { key: "driverCdls", label: "Driver CDLs", accept: ACCEPT_DOCS, multiple: true },
  { key: "driverMvrs", label: "Driver MVRs", accept: ACCEPT_DOCS, multiple: true },
  { key: "ownerCdl", label: "Owner CDL", accept: ACCEPT_DOCS, multiple: false },
  { key: "ownerMvr", label: "Owner MVR", accept: ACCEPT_DOCS, multiple: false },
  {
    key: "iftas",
    label: "IFTAs — last 4 quarters",
    accept: ACCEPT_DOCS,
    multiple: true,
  },
  {
    key: "lossRuns",
    label: "Loss runs — prior years",
    accept: ACCEPT_DOCS,
    multiple: true,
  },
  {
    key: "vehicleExcel",
    label: "Vehicle list (Excel)",
    accept: ACCEPT_SHEET,
    multiple: false,
    note: "only if more than 5 vehicles",
  },
] as const;

export function QuoteForm() {
  const [done, setDone] = useState<string | null>(null);
  const [vinCount, setVinCount] = useState(5);
  const [docs, setDocs] = useState<Record<string, File[]>>({});

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      dotNumber: "",
      companyName: "",
      garagingAddress: "",
      ownerName: "",
      email: "",
      phone: "",
      coveragesNeeded: "",
      vins: Array.from({ length: 5 }, () => ""),
      consent: false,
      company_website: "",
    },
  });

  const vinErrors = useMemo(
    () =>
      Array.isArray(errors.vins)
        ? errors.vins.map((e) => (e && "message" in e ? e.message : undefined))
        : undefined,
    [errors.vins],
  );

  async function onSubmit(values: QuoteInput) {
    const fd = new FormData();
    fd.set("mode", "full");
    fd.set("dotNumber", values.dotNumber);
    fd.set("companyName", values.companyName);
    fd.set("garagingAddress", values.garagingAddress);
    fd.set("ownerName", values.ownerName);
    fd.set("email", values.email);
    fd.set("phone", values.phone);
    fd.set("coveragesNeeded", values.coveragesNeeded);
    fd.set(
      "vins",
      JSON.stringify(
        (values.vins ?? []).map((v) => (v ?? "").trim()).filter(Boolean),
      ),
    );
    fd.set("consent", String(values.consent));
    fd.set("company_website", values.company_website ?? "");
    for (const [docType, list] of Object.entries(docs)) {
      for (const file of list) fd.append(`file_${docType}`, file, file.name);
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
      loading: "Sending your quote request…",
      success: "Sent — a specialist will be in touch.",
      error: (e: Error) =>
        e.message || "Couldn't send. Please try again or email us.",
    });

    try {
      await request;
      setDone(values.ownerName.split(" ")[0] || "");
    } catch {
      /* toast surfaced it; keep the form populated */
    }
  }

  if (done !== null) {
    return (
      <div className="border-t border-hairline pt-10">
        <p className="mono-label text-accent">Received</p>
        <p className="mt-4 max-w-[44ch] text-body-l text-ink">
          Thanks{done ? `, ${done}` : ""}. A Divine Group specialist will review
          your submission and reach out within one business day. If anything is
          missing, we&rsquo;ll follow up for it directly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-16"
    >
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
        {...register("company_website")}
      />

      {/* A — Company & contact */}
      <Reveal className="flex flex-col gap-7">
        <SectionLabel sticky={false}>A — Company &amp; contact</SectionLabel>
        <div className="grid gap-7 sm:grid-cols-2">
          <NumericField
            label="DOT Number"
            required
            autoComplete="off"
            error={errors.dotNumber?.message}
            {...register("dotNumber")}
          />
          <Input
            label="Company name"
            required
            autoComplete="organization"
            error={errors.companyName?.message}
            {...register("companyName")}
          />
          <Input
            label="Garaging address"
            required
            autoComplete="street-address"
            className="sm:col-span-2"
            error={errors.garagingAddress?.message}
            {...register("garagingAddress")}
          />
          <Input
            label="Company owner name"
            required
            autoComplete="name"
            error={errors.ownerName?.message}
            {...register("ownerName")}
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
        </div>
      </Reveal>

      {/* B — Vehicles */}
      <Reveal className="flex flex-col gap-7">
        <SectionLabel sticky={false}>B — Vehicle VINs</SectionLabel>
        <VinRepeater
          register={register}
          count={vinCount}
          setCount={setVinCount}
          errors={vinErrors}
        />
      </Reveal>

      {/* C — Coverages */}
      <Reveal className="flex flex-col gap-7">
        <SectionLabel sticky={false}>C — Coverages needed</SectionLabel>
        <Textarea
          label="What coverage are you looking for?"
          required
          rows={5}
          placeholder="Lines, limits, effective date, anything unusual about your operation…"
          error={errors.coveragesNeeded?.message}
          {...register("coveragesNeeded")}
        />
      </Reveal>

      {/* D — Attachments */}
      <Reveal className="flex flex-col gap-2">
        <SectionLabel sticky={false} className="mb-4">
          D — Attachments
        </SectionLabel>
        {DOC_ROWS.map((row) => (
          <FileUploadRow
            key={row.key}
            label={row.label}
            accept={[...row.accept]}
            multiple={row.multiple}
            note={"note" in row ? row.note : undefined}
            onChange={(files) =>
              setDocs((d) => ({ ...d, [row.key]: files }))
            }
          />
        ))}
      </Reveal>

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
        <MagneticButton
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "Sending…" : "Submit quote request"}
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
