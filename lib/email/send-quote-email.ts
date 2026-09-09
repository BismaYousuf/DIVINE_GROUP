import { getResend } from "@/lib/resend";
import { env } from "@/lib/env";
import type { InlineQuoteInput, QuoteInput } from "@/lib/validations/quote";

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

function renderTable(rows: Array<[string, string]>): string {
  const body = rows
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
  return `<table style="border-collapse:collapse;font-family:system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.5">${body}</table>`;
}

async function buildAttachments(files: UploadFile[]) {
  if (env.UPLOAD_STRATEGY !== "attach" || files.length === 0) return undefined;
  return Promise.all(
    files.map(async ({ field, file }) => ({
      filename: `${field}__${file.name}`,
      content: Buffer.from(await file.arrayBuffer()),
    })),
  );
}

async function send(opts: {
  subject: string;
  replyTo: string;
  html: string;
  files: UploadFile[];
}) {
  const { error } = await getResend().emails.send({
    from: env.EMAIL_FROM,
    to: env.QUOTE_INBOX,
    replyTo: opts.replyTo,
    subject: opts.subject,
    html: opts.html,
    attachments: await buildAttachments(opts.files),
  });
  if (error) throw new Error(`Resend: ${error.name} — ${error.message}`);
}

/** Short inline form (Home page). `files` kept for signature parity; unused here. */
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
  await send({
    subject: `New quote request — ${data.name}${
      data.company ? ` (${data.company})` : ""
    }`,
    replyTo: data.email,
    html: `<h2 style="font-family:system-ui,-apple-system,sans-serif;font-size:18px">New quote request (short form)</h2>${renderTable(
      rows,
    )}`,
    files,
  });
}

/** Full quote form (/get-a-quote): company + contact + VINs + document uploads. */
export async function sendFullQuoteEmail(
  data: QuoteInput,
  files: UploadFile[] = [],
): Promise<void> {
  const vins = data.vins.map((v) => v.trim()).filter(Boolean);
  const rows: Array<[string, string]> = [
    ["DOT Number", data.dotNumber],
    ["Company Name", data.companyName],
    ["Garaging Address", data.garagingAddress],
    ["Company Owner", data.ownerName],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Coverages Needed", data.coveragesNeeded],
    ["Vehicle count", String(vins.length)],
    ["Vehicle VINs", vins.length ? vins.join(", ") : "—"],
    ["Attachments", files.length ? `${files.length} file(s)` : "none"],
  ];
  await send({
    subject: `New quote request — ${data.companyName} (DOT ${data.dotNumber})`,
    replyTo: data.email,
    html: `<h2 style="font-family:system-ui,-apple-system,sans-serif;font-size:18px">New quote request</h2>${renderTable(
      rows,
    )}`,
    files,
  });
}
