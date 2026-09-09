import { contactSchema } from "@/lib/validations/contact";
import { sendContactEmail } from "@/lib/email/send-contact-email";
import { verifyTurnstile } from "@/lib/turnstile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function emptyToUndefined(v: FormDataEntryValue | null): string | undefined {
  const s = typeof v === "string" ? v.trim() : "";
  return s.length ? s : undefined;
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

    const parsed = contactSchema.safeParse({
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      subject: emptyToUndefined(form.get("subject")),
      message: form.get("message"),
      consent: form.get("consent") === "true" || form.get("consent") === "on",
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        fieldErrors[key] ??= issue.message;
      }
      return Response.json(
        { error: "Please check the highlighted fields.", fieldErrors },
        { status: 400 },
      );
    }

    await sendContactEmail(parsed.data);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[/api/contact] error", err);
    return Response.json(
      {
        error:
          "Something went wrong sending your message. Please try again, or email us directly.",
      },
      { status: 500 },
    );
  }
}
