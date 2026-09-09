import { getResend } from "@/lib/resend";
import { env } from "@/lib/env";
import type { InlineQuoteInput } from "@/lib/validations/quote";

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Escape user-supplied strings before putting them in the email HTML. */
export function escapeHtml(input: string): string {
  return input.replace(/[&<>"']/g, (c) => HTML_ESCAPES[c] ?? c);
}

export type UploadFile = { field: string; file: File };

/**
 * Send the inline quote submission to the client inbox. `files` is unused by the
 * short Home form but kept so the Phase 2 upload form can reuse this function.
 */
export async function sendQuoteEmail(
  data: InlineQuoteInput,
  files: UploadFile[] = [],
): Promise<void> {
  const rows: Array<[string, string]> = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Company / DOT", data.company?.trim() || "—"],
    ["State", data.state?.trim() || "—"],
    ["Coverage interest", data.coverageInterest],
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

  const attachments =
    env.UPLOAD_STRATEGY === "attach" && files.length
      ? await Promise.all(
          files.map(async ({ field, file }) => ({
            filename: `${field}__${file.name}`,
            content: Buffer.from(await file.arrayBuffer()),
          })),
        )
      : undefined;

  const { error } = await getResend().emails.send({
    from: env.EMAIL_FROM,
    to: env.QUOTE_INBOX,
    replyTo: data.email,
    subject: `New quote request — ${data.name}${
      data.company ? ` (${data.company})` : ""
    }`,
    html: `<h2 style="font-family:system-ui,-apple-system,sans-serif;font-size:18px">New quote request</h2><table style="border-collapse:collapse;font-family:system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.5">${table}</table>`,
    attachments,
  });

  if (error) {
    throw new Error(`Resend: ${error.name} — ${error.message}`);
  }
}
