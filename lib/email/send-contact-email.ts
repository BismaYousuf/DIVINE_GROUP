import { getResend } from "@/lib/resend";
import { env } from "@/lib/env";
import type { ContactInput } from "@/lib/validations/contact";
import { escapeHtml } from "./send-quote-email";

export async function sendContactEmail(data: ContactInput): Promise<void> {
  const rows: Array<[string, string]> = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Subject", data.subject?.trim() || "—"],
    ["Message", data.message],
  ];

  const table = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 14px;font-weight:600;white-space:nowrap;vertical-align:top">${escapeHtml(
          k,
        )}</td><td style="padding:6px 14px">${escapeHtml(v).replace(
          /\n/g,
          "<br>",
        )}</td></tr>`,
    )
    .join("");

  const { error } = await getResend().emails.send({
    from: env.EMAIL_FROM,
    to: env.CONTACT_INBOX,
    replyTo: data.email,
    subject: `Contact form — ${data.subject?.trim() || data.name}`,
    html: `<h2 style="font-family:system-ui,-apple-system,sans-serif;font-size:18px">Contact form message</h2><table style="border-collapse:collapse;font-family:system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.5">${table}</table>`,
  });

  if (error) {
    throw new Error(`Resend: ${error.name} — ${error.message}`);
  }
}
