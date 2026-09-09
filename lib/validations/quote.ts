import { z } from "zod";

/**
 * Short inline quote form used on the Home page (no file uploads).
 * The full VIN + document-upload quote form is Phase 2.
 * Imported by both the client form and `app/api/quote/route.ts`.
 */
export const inlineQuoteSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(120),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Enter a valid email").max(160)),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(30),
  company: z.string().trim().max(160).optional(),
  state: z.string().trim().max(40).optional(),
  coverageInterest: z
    .string()
    .trim()
    .min(4, "Tell us what coverage you need")
    .max(1200),
  consent: z
    .boolean()
    .refine((v) => v === true, { message: "Please agree to be contacted" }),
  /** Honeypot — real users leave this empty. The route drops the request if it is set. */
  company_website: z.string().optional(),
});

export type InlineQuoteInput = z.infer<typeof inlineQuoteSchema>;
