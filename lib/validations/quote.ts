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

/**
 * Full quote form (the /get-a-quote page): DOT, company + contact, vehicle VINs,
 * coverages needed, and document uploads (handled separately as multipart files).
 * Reference: docs/reliance_clone/get-a-quote.md.
 */
export const quoteSchema = z.object({
  dotNumber: z
    .string()
    .trim()
    .regex(/^\d{1,8}$/, "Enter your DOT number — digits only"),
  companyName: z.string().trim().min(2, "Enter your company name").max(160),
  garagingAddress: z
    .string()
    .trim()
    .min(5, "Enter your garaging address")
    .max(240),
  ownerName: z.string().trim().min(2, "Enter the company owner's name").max(160),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Enter a valid email").max(160)),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(30),
  coveragesNeeded: z
    .string()
    .trim()
    .min(4, "Tell us what coverage you need")
    .max(2000),
  vins: z
    .array(
      z
        .string()
        .trim()
        .toUpperCase()
        .regex(
          /^[A-HJ-NPR-Z0-9]{0,17}$/i,
          "Check this VIN — up to 17 characters, no I, O or Q",
        ),
    )
    .max(60, "That's a lot of vehicles — attach an Excel list instead"),
  consent: z
    .boolean()
    .refine((v) => v === true, { message: "Please agree to be contacted" }),
  company_website: z.string().optional(),
});

export type QuoteInput = z.infer<typeof quoteSchema>;
