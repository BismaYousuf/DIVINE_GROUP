"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";
import { Input, Textarea, Select, Checkbox } from "@/components/ui/field";
import { MagneticButton } from "@/components/motion/magnetic-button";

const SUBJECTS = ["General", "Claims", "Certificate request", "Billing"];

export function ContactForm() {
  const [done, setDone] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      consent: false,
      company_website: "",
    },
  });

  async function onSubmit(values: ContactInput) {
    const fd = new FormData();
    for (const [k, v] of Object.entries(values)) {
      fd.set(k, typeof v === "boolean" ? String(v) : (v ?? ""));
    }

    const request = fetch("/api/contact", { method: "POST", body: fd }).then(
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
      loading: "Sending your message…",
      success: "Sent — we'll be in touch.",
      error: (e: Error) =>
        e.message || "Couldn't send. Please try again or email us.",
    });

    try {
      await request;
      setDone(values.name.split(" ")[0] || "");
    } catch {
      /* toast surfaced it */
    }
  }

  if (done !== null) {
    return (
      <div className="border-t border-hairline pt-10">
        <p className="mono-label text-accent">Sent</p>
        <p className="mt-4 max-w-[40ch] text-body-l text-ink">
          Thanks{done ? `, ${done}` : ""}. We&rsquo;ll reply to the email you
          gave us shortly.
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
        <Controller
          control={control}
          name="subject"
          render={({ field }) => (
            <Select
              label="Reason"
              placeholder="Select a reason"
              options={SUBJECTS.map((s) => ({ value: s, label: s }))}
              error={errors.subject?.message}
              value={field.value}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
            />
          )}
        />
      </div>

      <Textarea
        label="Message"
        required
        rows={5}
        error={errors.message?.message}
        {...register("message")}
      />

      <Checkbox
        error={errors.consent?.message}
        label={
          <>
            I agree to be contacted about my enquiry. See our{" "}
            <a href="/privacy-policy" className="underline hover:text-ink">
              Privacy Policy
            </a>
            .
          </>
        }
        {...register("consent")}
      />

      <div>
        <MagneticButton
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "Sending…" : "Send message"}
        </MagneticButton>
      </div>
    </form>
  );
}
