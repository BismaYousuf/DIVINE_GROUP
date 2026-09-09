import { z } from "zod";

/**
 * Server environment. Validated lazily on first access so importing this module
 * never throws at build time — only a real request that needs a value will fail
 * loudly if the environment is misconfigured. See docs/TECHNICAL.md section 4.
 */
const schema = z.object({
  RESEND_API_KEY: z.string().min(1),
  EMAIL_FROM: z.string().min(3),
  QUOTE_INBOX: z.email(),
  CONTACT_INBOX: z.email(),
  NEXT_PUBLIC_SITE_URL: z.url(),
  UPLOAD_STRATEGY: z.enum(["attach", "blob"]).default("attach"),
  TURNSTILE_SECRET_KEY: z.string().optional(),
});

type Env = z.infer<typeof schema>;

let cached: Env | null = null;

function load(): Env {
  if (cached) return cached;
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((i) => `  ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid environment variables:\n${details}`);
  }
  cached = parsed.data;
  return cached;
}

export const env: Env = new Proxy({} as Env, {
  get: (_target, key: string) => load()[key as keyof Env],
});
