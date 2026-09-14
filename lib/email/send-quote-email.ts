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

const BRAND = {
  ink: "#0b0b0c",
  paper: "#f4f2ed",
  paperHi: "#fbfaf7",
  accent: "#d64222",
  graphite: "#6b6b66",
  hairline: "#e3e0d8",
};

const FONT_STACK =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

/**
 * Shared branded shell for every notification email — a dark "Divine Group
 * Website Team" header over a flat card with the submitted fields, styled to
 * match the site instead of a bare unstyled table.
 */
export function renderEmailShell(opts: {
  eyebrow: string;
  heading: string;
  rows: Array<[string, string]>;
  footerNote: string;
}): string {
  const { eyebrow, heading, rows, footerNote } = opts;

  const rowsHtml = rows
    .map(
      ([k, v], i) => `
      <tr>
        <td style="padding:14px 0;border-top:${i === 0 ? "none" : `1px solid ${BRAND.hairline}`};font-family:${FONT_STACK};font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${BRAND.graphite};vertical-align:top;white-space:nowrap;width:1%;padding-right:24px">
          ${escapeHtml(k)}
        </td>
        <td style="padding:14px 0;border-top:${i === 0 ? "none" : `1px solid ${BRAND.hairline}`};font-family:${FONT_STACK};font-size:15px;line-height:1.55;color:${BRAND.ink}">
          ${escapeHtml(v).replace(/\n/g, "<br>")}
        </td>
      </tr>`,
    )
    .join("");

  return `
<div style="background:${BRAND.paper};padding:32px 16px;font-family:${FONT_STACK}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto">
    <tr>
      <td style="background:${BRAND.ink};padding:24px 28px;border-radius:4px 4px 0 0">
        <p style="margin:0;font-family:${FONT_STACK};font-size:13px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:${BRAND.paperHi}">
          Divine Group <span style="color:${BRAND.accent}">— Website Team</span>
        </p>
      </td>
    </tr>
    <tr>
      <td style="background:${BRAND.paperHi};padding:28px;border-radius:0 0 4px 4px;border:1px solid ${BRAND.hairline};border-top:none">
        <p style="margin:0 0 6px;font-family:${FONT_STACK};font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.accent}">
          ${escapeHtml(eyebrow)}
        </p>
        <h1 style="margin:0 0 20px;font-family:${FONT_STACK};font-size:20px;font-weight:700;color:${BRAND.ink}">
          ${escapeHtml(heading)}
        </h1>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${rowsHtml}
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:18px 4px 0">
        <p style="margin:0;font-family:${FONT_STACK};font-size:12px;line-height:1.6;color:${BRAND.graphite}">
          ${escapeHtml(footerNote)}
        </p>
      </td>
    </tr>
  </table>
</div>`;
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
    html: renderEmailShell({
      eyebrow: "New submission",
      heading: "Quote request",
      rows,
      footerNote: `Sent from the Divine Group website's quick quote form. Reply-to is set to ${data.email}.`,
    }),
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
    html: renderEmailShell({
      eyebrow: "New submission",
      heading: "Quote request",
      rows,
      footerNote: `Sent from the Divine Group website's full quote form. Reply-to is set to ${data.email}.`,
    }),
    files,
  });
}
