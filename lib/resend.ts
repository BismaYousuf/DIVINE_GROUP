import { Resend } from "resend";
import { env } from "./env";

let client: Resend | null = null;

/** Lazily constructed so importing this module never touches env at build time. */
export function getResend(): Resend {
  if (!client) client = new Resend(env.RESEND_API_KEY);
  return client;
}
