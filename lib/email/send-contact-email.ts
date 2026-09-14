import { getResend } from "@/lib/resend";
import { env } from "@/lib/env";
import type { ContactInput } from "@/lib/validations/contact";
import { renderEmailShell } from "./send-quote-email";

export async function sendContactEmail(data: ContactInput): Promise<void> {
  const rows: Array<[string, string]> = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Subject", data.subject?.trim() || "—"],
    ["Message", data.message],
  ];

  const { error } = await getResend().emails.send({
    from: env.EMAIL_FROM,
    to: env.CONTACT_INBOX,
    replyTo: data.email,
    subject: `Contact form — ${data.subject?.trim() || data.name}`,
    html: renderEmailShell({
      eyebrow: "New submission",
      heading: "Contact message",
      rows,
      footerNote: `Sent from the Divine Group website's contact form. Reply-to is set to ${data.email}.`,
    }),
  });

  if (error) {
    throw new Error(`Resend: ${error.name} — ${error.message}`);
  }
}
