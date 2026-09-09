import { z } from "zod";

/**
 * Contact form. Same email pipeline as the quote form, no uploads.
 * Imported by both the client form and `app/api/contact/route.ts`.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(120),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Enter a valid email").max(160)),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(30),
  subject: z.string().trim().max(120).optional(),
  message: z.string().trim().min(10, "Add a short message").max(3000),
  consent: z
    .boolean()
    .refine((v) => v === true, { message: "Please agree to be contacted" }),
  /** Honeypot — real users leave this empty. */
  company_website: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
