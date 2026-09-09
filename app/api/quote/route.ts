import { inlineQuoteSchema, quoteSchema } from "@/lib/validations/quote";
import {
  sendQuoteEmail,
  sendFullQuoteEmail,
  type UploadFile,
} from "@/lib/email/send-quote-email";
import { verifyTurnstile } from "@/lib/turnstile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_BYTES = Math.round(1.5 * 1024 * 1024);
const MAX_TOTAL_BYTES = 4 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
]);

function emptyToUndefined(v: FormDataEntryValue | null): string | undefined {
  const s = typeof v === "string" ? v.trim() : "";
  return s.length ? s : undefined;
}

function fieldErrorsFrom(issues: { path: PropertyKey[]; message: string }[]) {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const form = await req.formData();

    if (emptyToUndefined(form.get("company_website"))) {
      return Response.json({ ok: true });
    }

    if (!(await verifyTurnstile(form.get("cf-turnstile-response")))) {
      return Response.json(
        { error: "Failed spam check. Please try again." },
        { status: 400 },
      );
    }

    const consent =
      form.get("consent") === "true" || form.get("consent") === "on";

    // ---- Full quote form (/get-a-quote) --------------------------------------
    if (form.get("mode") === "full") {
      let vins: unknown = [];
      try {
        vins = JSON.parse((form.get("vins") as string) || "[]");
      } catch {
        vins = [];
      }

      const parsed = quoteSchema.safeParse({
        dotNumber: form.get("dotNumber"),
        companyName: form.get("companyName"),
        garagingAddress: form.get("garagingAddress"),
        ownerName: form.get("ownerName"),
        email: form.get("email"),
        phone: form.get("phone"),
        coveragesNeeded: form.get("coveragesNeeded"),
        vins,
        consent,
      });

      if (!parsed.success) {
        return Response.json(
          {
            error: "Please check the highlighted fields.",
            fieldErrors: fieldErrorsFrom(parsed.error.issues),
          },
          { status: 400 },
        );
      }

      const files: UploadFile[] = [];
      let total = 0;
      for (const [key, value] of form.entries()) {
        if (!key.startsWith("file_") || !(value instanceof File)) continue;
        if (value.size === 0) continue;
        if (value.size > MAX_FILE_BYTES) {
          return Response.json(
            { error: `${value.name} is over 1.5 MB. Please attach a smaller file.` },
            { status: 400 },
          );
        }
        if (!ALLOWED_TYPES.has(value.type)) {
          return Response.json(
            { error: `${value.name}: that file type isn't accepted.` },
            { status: 400 },
          );
        }
        total += value.size;
        files.push({ field: key.slice(5), file: value });
      }

      if (total > MAX_TOTAL_BYTES) {
        return Response.json(
          {
            error:
              "Those attachments are too large to send at once. Please submit the biggest ones in a short follow-up — our team will collect the rest.",
          },
          { status: 413 },
        );
      }

      await sendFullQuoteEmail(parsed.data, files);
      return Response.json({ ok: true });
    }

    // ---- Short inline form (Home page) -------------------------------------
    const parsed = inlineQuoteSchema.safeParse({
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      company: emptyToUndefined(form.get("company")),
      state: emptyToUndefined(form.get("state")),
      coverageInterest: form.get("coverageInterest"),
      consent,
    });

    if (!parsed.success) {
      return Response.json(
        {
          error: "Please check the highlighted fields.",
          fieldErrors: fieldErrorsFrom(parsed.error.issues),
        },
        { status: 400 },
      );
    }

    await sendQuoteEmail(parsed.data);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[/api/quote] error", err);
    return Response.json(
      {
        error:
          "Something went wrong sending your request. Please try again, or email us directly.",
      },
      { status: 500 },
    );
  }
}
