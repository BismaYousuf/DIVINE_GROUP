# Technical Specification — Divine Group Inc Website

Companion to `REQUIREMENTS.md` and the `reliance_clone/` layout blueprints.
This document is for **developers**. It defines the stack, folder structure, conventions,
the form → email pipeline, and a complete guide to **Resend** (testing now + wiring the real
business email later).

---

## 1. What this site actually is

- **~95% static marketing frontend.** 5–6 pages: Home, Our Difference, Services
  (+ Trucking Insurance sub-page), Get a Quote, Contact Us.
- **1 piece of real logic:** the **Get a Quote** form (and a smaller Contact form).
  Submit → validate → **email everything (fields + uploaded documents) to the client's
  inbox** via Resend.
- **No database. No admin panel. No user accounts. No CMS.** If it's not "render a page" or
  "send an email", it's out of scope.

Because of that, the whole backend is **two API route handlers** (`/api/quote`,
`/api/contact`) and one Resend call each.

---

## 2. Stack

| Concern | Choice | Notes |
|--------|--------|-------|
| Framework | **Next.js (App Router)** | React Server Components by default; `"use client"` only where needed (forms, nav toggle) |
| Language | **TypeScript** | strict mode |
| Styling | **Tailwind CSS** | v3; design tokens in `tailwind.config.ts` |
| UI components | **shadcn/ui** | Radix primitives, copied into `components/ui/` (not a dependency) |
| Client state | **Zustand** | tiny; only for UI state (mobile nav, toasts) + optional quote-form draft |
| Forms | **React Hook Form + Zod** | RHF for state/validation wiring, Zod for the schema (shared client + server) |
| Email | **Resend** | transactional send from route handlers; optional `react-email` for templates |
| Hosting | **Vercel** | Free/Hobby plan is enough |
| Spam protection | **Honeypot + Cloudflare Turnstile** | Turnstile has a free tier; keep secret key server-side |
| Package manager | **pnpm** (or npm) | pick one, commit the lockfile |

### Install

```bash
# scaffold
npx create-next-app@latest divinegroupinc --typescript --tailwind --app --eslint --src-dir=false --import-alias "@/*"

cd divinegroupinc

# core deps
pnpm add resend react-hook-form zod @hookform/resolvers zustand
pnpm add class-variance-authority clsx tailwind-merge lucide-react
# optional but recommended for email templates
pnpm add react-email @react-email/components
# optional spam
pnpm add @marsidev/react-turnstile

# shadcn
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button input textarea select label form checkbox sonner dialog alert-dialog drawer card accordion navigation-menu sheet
```

> `sheet` = mobile nav drawer. `sonner` = toast. `form` = shadcn's RHF wrapper.
> `dialog` / `alert-dialog` = custom modals. `drawer` = mobile bottom-sheet (optional polish).
>
> **This site is fully mobile-responsive, and every page carries Sonner toasts + Radix
> modals — see section 5.**

---

## 3. Folder structure

```
divinegroupinc/
├─ app/
│  ├─ layout.tsx                  # <html>, fonts, <SiteHeader/> <SiteFooter/>, <Toaster/>
│  ├─ page.tsx                    # Home
│  ├─ globals.css                 # tailwind layers + CSS vars (shadcn theme)
│  ├─ not-found.tsx
│  ├─ our-difference/
│  │  └─ page.tsx
│  ├─ services/
│  │  ├─ page.tsx
│  │  └─ trucking-insurance/
│  │     └─ page.tsx
│  ├─ get-a-quote/
│  │  └─ page.tsx                 # renders <QuoteForm/> (client component)
│  ├─ contact-us/
│  │  └─ page.tsx                 # renders <ContactForm/> (client component)
│  ├─ (legal)/
│  │  ├─ privacy-policy/page.tsx
│  │  └─ terms/page.tsx
│  ├─ sitemap.ts
│  ├─ robots.ts
│  └─ api/
│     ├─ quote/route.ts           # POST -> validate -> Resend
│     └─ contact/route.ts         # POST -> validate -> Resend
│
├─ components/
│  ├─ ui/                         # shadcn generated (button.tsx, input.tsx, ...)
│  ├─ layout/
│  │  ├─ site-header.tsx          # logo + 4 nav links + "Get a Quote" button
│  │  ├─ site-footer.tsx
│  │  └─ mobile-nav.tsx           # <Sheet/>, reads/writes zustand nav store
│  ├─ sections/                   # dumb, reusable page sections (from reliance_clone/*.md)
│  │  ├─ hero.tsx
│  │  ├─ value-card.tsx
│  │  ├─ split-feature.tsx
│  │  ├─ cta-band.tsx
│  │  ├─ service-card.tsx
│  │  ├─ badge-strip.tsx
│  │  └─ article-card.tsx
│  └─ forms/
│     ├─ quote-form.tsx           # the BIG custom form (VINs + uploads)
│     ├─ contact-form.tsx         # small form
│     ├─ quote-form-inline.tsx    # 7-field short form used on the Home page
│     └─ fields/
│        ├─ text-field.tsx
│        ├─ numeric-field.tsx     # DOT number: digits only
│        ├─ file-upload-row.tsx   # label + <input type=file> + selected list + size check
│        ├─ vin-repeater.tsx      # 5 VIN inputs + "add another vehicle"
│        └─ consent-checkbox.tsx
│
├─ lib/
│  ├─ resend.ts                   # `export const resend = new Resend(env.RESEND_API_KEY)`
│  ├─ env.ts                      # zod-validated process.env (fail fast on boot)
│  ├─ site-config.ts              # nav items, company name/phone/email, office(s), socials
│  ├─ utils.ts                    # cn(), formatBytes(), etc.
│  ├─ validations/
│  │  ├─ quote.ts                 # quoteSchema (Zod) — imported by client AND route
│  │  └─ contact.ts               # contactSchema (Zod)
│  └─ email/
│     ├─ send-quote-email.ts      # builds subject + html + attachments, calls resend
│     ├─ send-contact-email.ts
│     └─ templates/               # (optional) react-email components
│        ├─ quote-email.tsx
│        └─ contact-email.tsx
│
├─ stores/
│  └─ ui-store.ts                 # zustand: { mobileNavOpen, setMobileNavOpen }
│
├─ hooks/
│  └─ use-file-list.ts            # optional helper for file-upload-row
│
├─ public/
│  └─ images/                     # hero images, icons, badges, headshots
│
├─ emails/                        # `react-email dev` preview root (if using react-email)
├─ .env.local                     # NOT committed
├─ .env.example                   # committed, no secrets
├─ components.json                # shadcn config
├─ next.config.mjs
├─ tailwind.config.ts
├─ tsconfig.json
└─ package.json
```

### Conventions

- **Server Components by default.** Only `quote-form.tsx`, `contact-form.tsx`,
  `quote-form-inline.tsx`, `mobile-nav.tsx`, and anything using hooks gets `"use client"`.
- **One source of truth for content:** page copy lives in the page file or `site-config.ts`,
  not scattered. Nav items in `site-config.ts` so header + footer + sitemap agree.
- **Zod schemas are shared.** `lib/validations/quote.ts` is imported by both the form and the
  route handler. Client validation is UX; **server validation is the real gate.**
- **Never** put `RESEND_API_KEY` (or any secret) in a `NEXT_PUBLIC_` var or import it into a
  client component. Secrets are only touched inside `app/api/**` and `lib/email/**`.
- Route handlers that send email run on the **Node.js runtime**, not Edge:
  ```ts
  export const runtime = "nodejs";
  ```

---

## 4. Environment variables

`.env.example` (commit this):

```bash
# --- Resend ---
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx

# FROM address. During testing use the Resend shared domain:
#   "Divine Group <onboarding@resend.dev>"
# After the real domain is verified, switch to e.g.:
#   "Divine Group Quotes <quotes@send.divinegroupstore.com>"
EMAIL_FROM="Divine Group <onboarding@resend.dev>"

# Where form submissions are delivered.
# During testing this MUST equal the email you used to sign up for Resend.
# Later: the Hostinger business mailbox, e.g. info@divinegroupstore.com
QUOTE_INBOX="manees7865@gmail.com"
CONTACT_INBOX="manees7865@gmail.com"

# --- Site ---
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# --- Spam (optional; leave blank to disable Turnstile) ---
NEXT_PUBLIC_TURNSTILE_SITE_KEY=""
TURNSTILE_SECRET_KEY=""

# --- File upload strategy (see section 7) ---
# "attach"  -> attach files directly to the email (only safe when total < ~4MB)
# "blob"    -> upload to Vercel Blob, email download links (recommended for 6x3MB)
UPLOAD_STRATEGY="attach"
BLOB_READ_WRITE_TOKEN=""          # only if UPLOAD_STRATEGY=blob
```

`lib/env.ts` validates these on boot so a missing/misspelled var fails loudly instead of at
2am when a customer submits:

```ts
import { z } from "zod";

const schema = z.object({
  RESEND_API_KEY: z.string().min(1),
  EMAIL_FROM: z.string().min(3),
  QUOTE_INBOX: z.string().email(),
  CONTACT_INBOX: z.string().email(),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  UPLOAD_STRATEGY: z.enum(["attach", "blob"]).default("attach"),
  TURNSTILE_SECRET_KEY: z.string().optional(),
});

export const env = schema.parse(process.env);
```

On **Vercel**: add every non-`NEXT_PUBLIC_` var under Project → Settings → Environment
Variables (Production + Preview). `NEXT_PUBLIC_*` ones too. Redeploy after changes.

---

## 5. Client behaviour — forms, toasts, modals, responsive

Full field list & rules are in `reliance_clone/get-a-quote.md`. Implementation shape:

```
quote-form.tsx  ("use client")
 ├─ useForm({ resolver: zodResolver(quoteSchema), defaultValues })
 ├─ useFieldArray for VINs  (starts with 5 rows)
 ├─ local state for files: Record<DocType, File[]>
 ├─ onSubmit(values):
 │    1. build FormData()
 │    2. append all scalar fields
 │    3. append vins as JSON string
 │    4. append each file: fd.append(`file_${docType}`, file, file.name)
 │    5. append turnstile token (if enabled) + honeypot
 │    6. fetch("/api/quote", { method: "POST", body: fd })   // no Content-Type header!
 │    7. on ok -> show success panel; on error -> toast + keep data
 └─ file-upload-row enforces: <= 3 MB/file, allowed extensions, shows name+size+remove
```

Key details:

- **DOT number:** `<NumericField>` — `inputMode="numeric"`, `onKeyDown` blocks non-digits,
  `onPaste` strips non-digits, Zod `.regex(/^\d{1,8}$/)`.
- **VINs:** 5 rows by default, "+ Add another vehicle" appends. Zod: each VIN optional,
  `.regex(/^[A-HJ-NPR-Z0-9]{11,17}$/i)` (soft — warn, don't hard-block on length).
  If `vins.length > 5` → show the "attach your Excel vehicle list" callout and make the
  Excel upload required.
- **Files:** never send as base64 in JSON — use `multipart/form-data`. Let the browser set
  the boundary; do **not** manually set `Content-Type`.
- **Zustand is not needed for this form** — RHF owns the form state. Optionally persist a
  draft to `localStorage` (see `stores/` note) so a half-filled form survives a refresh.

### Zustand usage (kept deliberately tiny)

```ts
// stores/ui-store.ts
import { create } from "zustand";

interface UIState {
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
}
export const useUIStore = create<UIState>((set) => ({
  mobileNavOpen: false,
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
}));
```

That's the whole store. If the client wants the quote form to remember a draft, add a
`persist`-wrapped store for that later — not required for v1.

### 5.1 Toasts (Sonner) — on every page

- One `<Toaster />` mounted once in `app/layout.tsx`, so all pages get it.
- `import { toast } from "sonner"`:
  - success → `toast.success("Quote request sent — we'll be in touch.")`
  - error → `toast.error("Couldn't send. Try again or email us directly.")`
  - validation short-circuit → `toast.warning("Please fix the highlighted fields.")`
  - long submit with files → `toast.promise(sendPromise, { loading, success, error })`
- Config: `richColors`, `closeButton`, `duration={5000}`; `position="bottom-right"` on
  desktop, `"bottom-center"` + near-full-width on mobile.
- Toasts are transient feedback only. Anything the user must act on → inline error or a
  modal, never a toast.

### 5.2 Custom modals (Radix Dialog via shadcn `dialog` + `alert-dialog`)

- Base primitives wrapped once in `components/ui/`; app modals live in `components/modals/`.

  | Modal | Trigger | Purpose |
  |-------|---------|---------|
  | `SuccessModal` | after quote submit (alt. to inline success panel) | confirmation + "what happens next" |
  | `ConfirmLeaveModal` (`alert-dialog`) | navigating away from a dirty quote form | "You have unsaved changes" |
  | `RemoveFileModal` (`alert-dialog`) | remove an uploaded file | confirm delete |
  | `FilePreviewModal` | click an attached-file chip | preview image / filename before submit |
  | `PrivacyModal` / `TermsModal` | footer links + consent-checkbox links | read legal text without leaving the form |
  | `OfficeMapModal` | Contact page location card | enlarge the map |

- Radix handles focus trap, `Esc` to close, focus return, scroll lock, `aria-*`. **Don't
  hand-roll a modal.**
- Modal open state stays local (`useState`). Only promote to the Zustand `ui-store` if a
  modal is opened from several unrelated places.
- On small screens, render modals as near-full-screen or use `drawer` (bottom sheet).

### 5.3 Mobile responsiveness — YES, every page

The whole site is **mobile-first responsive**:

- Tailwind mobile-first: base = phone, layer up with `sm`(640) `md`(768) `lg`(1024) `xl`(1280).
- **Header:** full nav at `lg+`; below `lg` → hamburger opening the `<Sheet>` drawer
  (state in `ui-store`). Logo + "Get a Quote" button stay visible at all sizes.
- **Every multi-column section** in the `reliance_clone/*.md` diagrams collapses to one
  column on mobile: 3-up value cards → stacked; split features → image on top then text;
  service-card grid → 1-up; footer columns → stacked.
- **Get a Quote form:** paired fields (Email | Phone) → single column; VIN grid 2-up →
  1-up; Submit full-width; file rows full-width with a wrapping selected-files list.
- **Contact page:** location cards 3-up → 1-up; map full-width; form single column.
- Tap targets ≥ 44px; base font 16px (stops iOS focus-zoom); no fixed widths; body never
  scrolls horizontally; `next/image` with `sizes`. Test at 360 / 390 / 768 / 1024 / 1440 px.

---

## 6. The API route handler (`app/api/quote/route.ts`)

```ts
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { quoteSchema } from "@/lib/validations/quote";
import { sendQuoteEmail } from "@/lib/email/send-quote-email";
import { verifyTurnstile } from "@/lib/turnstile";

export const runtime = "nodejs";        // needs Buffer + larger body than Edge allows
export const dynamic = "force-dynamic"; // never cache a POST endpoint

const MAX_FILE_BYTES = Math.round(1.5 * 1024 * 1024); // 1.5 MB/file (client confirmed every doc is < 1.5 MB)
const MAX_TOTAL_BYTES = 4 * 1024 * 1024;              // stay under Vercel's ~4.5MB request cap
const ALLOWED = new Set([
  "application/pdf", "image/png", "image/jpeg",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
]);

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    // 1. honeypot — bots fill hidden fields
    if (form.get("company_website")) return NextResponse.json({ ok: true }); // silently drop

    // 2. Turnstile (skip if not configured)
    if (env.TURNSTILE_SECRET_KEY) {
      const ok = await verifyTurnstile(form.get("cf-turnstile-response"));
      if (!ok) return NextResponse.json({ error: "Failed spam check." }, { status: 400 });
    }

    // 3. validate scalar fields
    const parsed = quoteSchema.safeParse({
      dotNumber: form.get("dotNumber"),
      companyName: form.get("companyName"),
      garagingAddress: form.get("garagingAddress"),
      ownerName: form.get("ownerName"),
      email: form.get("email"),
      phone: form.get("phone"),
      coveragesNeeded: form.get("coveragesNeeded"),
      vins: JSON.parse((form.get("vins") as string) || "[]"),
      consent: form.get("consent") === "true",
    });
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 });
    }

    // 4. collect + check files
    const files: { field: string; file: File }[] = [];
    for (const [key, value] of form.entries()) {
      if (key.startsWith("file_") && value instanceof File && value.size > 0) {
        if (value.size > MAX_FILE_BYTES)
          return NextResponse.json({ error: `${value.name} is over 1.5 MB.` }, { status: 400 });
        if (!ALLOWED.has(value.type))
          return NextResponse.json({ error: `${value.name}: file type not allowed.` }, { status: 400 });
        files.push({ field: key.replace("file_", ""), file: value });
      }
    }
    const total = files.reduce((n, f) => n + f.file.size, 0);
    if (env.UPLOAD_STRATEGY === "attach" && total > MAX_TOTAL_BYTES) {
      return NextResponse.json({
        error: "Attachments are too large to email at once. Please send fewer/smaller files; our team will collect the rest.",
      }, { status: 413 });
    }

    // 5. send
    await sendQuoteEmail(parsed.data, files);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("quote route error", err);
    return NextResponse.json({ error: "Something went wrong. Please try again or email us directly." }, { status: 500 });
  }
}
```

`lib/email/send-quote-email.ts`:

```ts
import { resend } from "@/lib/resend";
import { env } from "@/lib/env";
import type { QuoteInput } from "@/lib/validations/quote";

export async function sendQuoteEmail(
  data: QuoteInput,
  files: { field: string; file: File }[],
) {
  // build a readable HTML table of every field
  const rows = [
    ["DOT Number", data.dotNumber],
    ["Company Name", data.companyName],
    ["Garaging Address", data.garagingAddress],
    ["Company Owner", data.ownerName],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Coverages Needed", data.coveragesNeeded],
    ["VINs", data.vins.filter(Boolean).join(", ") || "—"],
  ]
    .map(([k, v]) => `<tr><td style="padding:6px 12px;font-weight:600">${k}</td><td style="padding:6px 12px">${escapeHtml(String(v))}</td></tr>`)
    .join("");

  // turn each uploaded File into a Resend attachment
  const attachments = env.UPLOAD_STRATEGY === "attach"
    ? await Promise.all(files.map(async ({ field, file }) => ({
        filename: `${field}__${file.name}`,
        content: Buffer.from(await file.arrayBuffer()), // Buffer or base64 string
      })))
    : undefined; // in "blob" mode you'd upload here and inject links into `rows`

  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,                       // must be a verified sender
    to: env.QUOTE_INBOX,                        // the client's inbox
    replyTo: data.email,                        // client hits "reply" -> goes to the customer
    subject: `New Quote Request — ${data.companyName} (DOT ${data.dotNumber})`,
    html: `<h2>New quote request</h2><table style="border-collapse:collapse">${rows}</table>`,
    attachments,
  });

  if (error) throw new Error(`Resend: ${error.name} — ${error.message}`);
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]!));
}
```

`app/api/contact/route.ts` is the same shape but **no files**, `contactSchema`, and
`to: env.CONTACT_INBOX`.

---

## 7. File-size math (updated — client confirmed all docs < 1.5 MB)

Three limits to keep in mind:

| Limit | Value | Who imposes it |
|-------|-------|----------------|
| Per-file cap | **1.5 MB** | Client confirmed every document (CDLs, MVRs, IFTAs, loss runs, Excel list) is under this |
| Serverless request body | **~4.5 MB total** | Vercel (all plans) — a POST bigger than this fails *before your code runs* |
| Resend message size | ~40 MB total | Resend |

With the 1.5 MB/file cap, a **typical** submission (owner CDL + owner MVR + a few driver
docs + one IFTA set) lands well under 4.5 MB and attaches directly — **no extra
infrastructure needed.** The only edge case is one submission with many large files at once
(e.g. 6 rows all near 1.5 MB ≈ 9 MB). Handle that with a **combined-size guard**, not a
redesign:

### Option A — Direct attach + total guard (DEFAULT — ship this)
- `UPLOAD_STRATEGY="attach"`.
- Per-file limit 1.5 MB, checked on client **and** server.
- If the **combined** size of all files exceeds ~4 MB, the form asks the user to send the
  larger documents in a short follow-up and a rep collects the rest — exactly how the
  reference site handles IFTAs / loss runs. In practice this branch is rarely hit.
- Zero extra services. No database, no storage bucket, no admin panel.

### Option B — Vercel Blob + email links (only if big multi-file submissions turn out common)
- `pnpm add @vercel/blob`, set `UPLOAD_STRATEGY="blob"`, add `BLOB_READ_WRITE_TOKEN`
  (Vercel dashboard → Storage → Blob).
- Files upload straight from the browser to Blob via a short-lived token from
  `/api/upload-token`, so the bytes never pass through the serverless function and the
  4.5 MB ceiling stops mattering.
- `/api/quote` then carries only the fields + Blob URLs; the email to the client has the
  field table + download links. Still no database / admin panel — just object storage with
  a delete-after-N-days cleanup.

**Recommendation:** ship **Option A**. Build `file-upload-row` + `send-quote-email` so a
later switch to **Option B** is a config flip, not a rewrite. Given the confirmed 1.5 MB
cap, Option A is very likely all this project ever needs.

---

## 8. How Resend actually works (the part you're worried about)

### 8.1 Mental model

Resend is a **transactional email API**. Your server makes one HTTPS call:

```
POST https://api.resend.com/emails
Authorization: Bearer re_xxx
{ "from": "...", "to": "...", "subject": "...", "html": "...", "attachments": [...] }
```

…and Resend takes responsibility for actually delivering that message to the recipient's
mailbox. You are **not** running a mail server, not touching SMTP, not managing IP
reputation. The SDK (`resend.emails.send(...)`) is just a wrapper around that POST.

### 8.2 Step by step, what happens on send

1. **Auth.** Resend checks your `RESEND_API_KEY`. Bad key → `401`, nothing sent.
2. **`from` check.** Resend looks at the domain in `from`:
   - `onboarding@resend.dev` → Resend's own shared, pre-verified domain. Works instantly
     with **zero DNS setup**, but with a big restriction (see 8.4): you can only send to
     **your own account email address**.
   - `anything@yourdomain.com` → that domain must be **added and verified** in the Resend
     dashboard first (DNS records). If it isn't verified, the send is rejected.
3. **Message assembly.** Resend builds the MIME message: your HTML, a generated plaintext
   part, headers, and any attachments (decoded from the base64/Buffer you passed).
4. **Signing & routing.** Resend's sending infrastructure (they run their own MTA, with
   providers such as AWS SES behind it):
   - adds a **DKIM signature** using the private key that pairs with the DKIM record in your
     DNS — this cryptographically proves the message wasn't altered and really came from a
     sender authorised for your domain;
   - sets the **Return-Path** (envelope sender / bounce address) to a Resend-controlled
     subdomain of *your* domain (that's what the `MX` + `SPF` records on the `send.`
     subdomain are for) so **SPF** passes and is *aligned* with your `from` domain;
   - hands the message to the receiving mail server over SMTP.
5. **Receiver decides.** Gmail / Outlook / the Hostinger mailbox checks **SPF**, **DKIM**,
   and **DMARC** alignment, plus content and IP reputation, then files it in Inbox or Spam.
6. **Events.** Resend records `sent → delivered → opened / bounced / complained` and shows
   them in **Dashboard → Logs** (and via webhooks if you set them up).

### 8.3 Why deliverability is usually fine here

- Low volume (well under 100/day).
- Recipient is a **known business inbox** the client controls — not cold outreach.
- With a **verified domain**: SPF pass + DKIM pass + DMARC alignment = the three checks
  inbox filters care most about.
- `reply_to` set to the customer's address, real subject line, no link-farm body.

The failure modes that actually bite:
- Sending from an **unverified** domain → hard reject. (Fix: verify, or use `resend.dev`.)
- Using `onboarding@resend.dev` and expecting it to reach the client's inbox → it won't
  (only reaches *your* account email). (Fix: verify the real domain.)
- Attachments too big → Vercel rejects the request before Resend is even called (section 7).
- Missing DMARC while a strict receiver expects one → occasional spam-foldering.
  (Fix: add `_dmarc` TXT `v=DMARC1; p=none;`.)

### 8.4 Free plan limits (Resend)

| | Free |
|---|---|
| Emails / month | 3,000 |
| Emails / day | 100 |
| Verified domains | 1 |
| API rate limit | ~2 requests/sec |
| Shared-domain (`resend.dev`) sending | only to **your own account email** |

All comfortably inside this project. Upgrade path if quote volume explodes: Pro at
$20/month (50k emails) — the proposal already anticipates this.

---

## 9. Testing Resend **now** (no domain, no business email yet)

### Phase 0 — local machine

1. Create a Resend account at **resend.com** using **manees7865@gmail.com**.
   (Whatever email you sign up with becomes the *only* address you can send to until a
   domain is verified — so use an inbox you can actually check.)
2. Dashboard → **API Keys** → *Create API Key* → "Sending access" is enough. Copy `re_...`.
3. `.env.local`:
   ```bash
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
   EMAIL_FROM="Divine Group <onboarding@resend.dev>"
   QUOTE_INBOX="manees7865@gmail.com"     # MUST match your Resend account email
   CONTACT_INBOX="manees7865@gmail.com"
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   UPLOAD_STRATEGY="attach"
   ```
4. `pnpm dev`, open `/get-a-quote`, submit a real fill-out with 1–2 small PDFs.
5. Check: **Gmail inbox** for the message, **Resend → Logs** for the event, the email body
   for the field table, the attachments open correctly.

### Things to deliberately test

| Test | How | Expect |
|------|-----|--------|
| Happy path | normal submit | email in Gmail, `delivered` in Logs |
| Wrong API key | break the key, submit | route returns 500, Logs show nothing, server console logs `401` |
| File > 3 MB | attach a 5 MB PDF | client blocks it; if forced, route returns 400 "over 3 MB" |
| Total > ~4 MB | attach several files | route returns 413 with the "send fewer files" message |
| Bad email field | `foo@bar` | Zod fails client-side; if bypassed, route returns 400 |
| DOT non-numeric | type letters | input rejects them; Zod regex fails as backstop |
| Reply routing | hit "Reply" in Gmail | To: = the customer's email (from `replyTo`) |
| Spam/bounce simulation | set `QUOTE_INBOX` to `delivered@resend.dev`, `bounced@resend.dev`, `complained@resend.dev` temporarily | Logs show `delivered` / `bounced` / `complained` — lets you see event handling without real bounces |

> Resend also has a **test mode**: API keys created with the "Testing" permission don't send
> real email but still return success and show in Logs. Handy for CI / e2e tests.

### Phase 1 — deployed on Vercel, still on `resend.dev`

- Add the same env vars in Vercel (Production + Preview), redeploy.
- Submitting from the deployed preview still only delivers to your Resend account email —
  that's expected until Phase 2.
- If you need the **client** to see a live demo before the domain exists: either (a) use the
  client's email as the Resend account email, or (b) just show them the Resend **Logs**
  screen + the email in your own inbox and explain the domain step is next.

---

## 10. Adding the real business email (Hostinger) **later**

Two separate things people conflate. Keep them separate:

| Job | Mechanism | Lives on |
|-----|-----------|----------|
| **Receiving** mail at `info@divinegroupstore.com` (the business mailbox you log into) | **MX** + autoconfig records → **Hostinger** mail servers | the **root** domain `divinegroupstore.com` |
| **Sending** mail *as* the domain via Resend | **SPF + DKIM** (+ a return-path **MX**) → **Resend** | a **subdomain**, e.g. `send.divinegroupstore.com` |

Because Resend's return-path uses a **subdomain**, it does **not** collide with Hostinger's
MX on the root domain. You can have both at once: Hostinger runs the inbox, Resend sends
outbound. This is the recommended setup and it removes the "will Resend break our email"
fear — they don't touch the same records.

### Step by step

1. **Client buys the domain** (GoDaddy / Hostinger / Namecheap — their responsibility per the
   proposal) and gives you either DNS access or the ability to add records.
2. **Set up the Hostinger business mailbox** (Hostinger Email / Titan plan):
   - In Hostinger's panel, add the email plan to the domain, create `info@divinegroupstore.com`.
   - Hostinger tells you to add **MX records** (e.g. `mx1.hostinger.com`, `mx2.hostinger.com`)
     and usually an SPF `include:_spf.mail.hostinger.com` and a DKIM record **for Hostinger's
     own sending**. Add those to the **root** domain's DNS zone.
   - Now you can log into webmail and receive mail. (This alone is enough for the form to
     work in Option A/B, because the form just needs an inbox to deliver *to*.)
3. **Add the domain in Resend** for sending:
   - Resend Dashboard → **Domains** → *Add Domain* → enter **`send.divinegroupstore.com`**
     (use the subdomain — cleaner, avoids MX conflicts, better isolation).
   - Resend shows a set of DNS records. Add each **exactly as shown** in the domain's DNS
     zone (Hostinger DNS editor, or wherever the nameservers point). Representative shape:

     | Type | Name/Host | Value (use Resend's exact values) | Purpose |
     |------|-----------|-----------------------------------|---------|
     | `MX` | `send` | `feedback-smtp.us-east-1.amazonses.com` (priority 10) | return-path / bounce handling |
     | `TXT` | `send` | `v=spf1 include:amazonses.com ~all` | SPF for the sending subdomain |
     | `TXT` | `resend._domainkey` | `p=MIGfMA0GCSq...` (long key) | DKIM signature key |
     | `TXT` | `_dmarc` | `v=DMARC1; p=none;` | DMARC (recommended, optional) |

   - Wait for propagation (usually minutes, can be up to 24–48h). Click **Verify** in Resend.
     Green = done.
4. **Flip the env vars** (locally and on Vercel):
   ```bash
   EMAIL_FROM="Divine Group Quotes <quotes@send.divinegroupstore.com>"
   QUOTE_INBOX="info@divinegroupstore.com"
   CONTACT_INBOX="info@divinegroupstore.com"
   NEXT_PUBLIC_SITE_URL="https://divinegroupstore.com"
   ```
   Redeploy.
5. **Verify end-to-end:**
   - Submit the form. Confirm it lands in the Hostinger webmail inbox for
     `info@divinegroupstore.com`.
   - Open the received email → "Show original" / headers → check `spf=pass`, `dkim=pass`,
     `dmarc=pass`.
   - Send one to an external Gmail too and confirm Inbox (not Spam).
6. **Optional niceties:**
   - Add a Resend **webhook** → a route that logs delivered/bounced (only if the client wants
     an audit trail; otherwise skip — no DB).
   - Add a plain "we got your request" auto-reply to the customer (`to: data.email`). The
     proposal says none is required, but it's a cheap trust win — ask the client.

### If the client insists on sending from the root domain (`quotes@divinegroupstore.com`)

Possible, but then Resend's return-path MX and Hostinger's inbox MX both want to live on the
root. Resend supports this by using a `send.`-style **Return-Path subdomain** even when the
`from` is the root domain — you still end up adding a subdomain MX. Net: **just use the
subdomain for `from`** and avoid the headache. Recipients don't care that it says
`@send.divinegroupstore.com`; if they do, set the display name to "Divine Group" and it
reads fine.

---

## 11. Security & correctness checklist

- [ ] `RESEND_API_KEY` only referenced in `app/api/**` / `lib/email/**`. Never `NEXT_PUBLIC_`.
- [ ] Server re-validates every field with the same Zod schema the client uses.
- [ ] File type checked by MIME **and** extension; size checked server-side (don't trust the client).
- [ ] `runtime = "nodejs"` and `dynamic = "force-dynamic"` on both API routes.
- [ ] Honeypot field (`company_website`, hidden, `tabindex=-1`, `autocomplete=off`).
- [ ] Turnstile verified server-side when keys are set.
- [ ] `replyTo` = submitter email; `to` = env inbox (never a value from the request body).
- [ ] HTML in the email is escaped (`escapeHtml`) — a customer could paste `<script>` into a field.
- [ ] Rate-limit the routes (e.g. `@upstash/ratelimit` or a simple in-memory/IP guard) — optional but cheap.
- [ ] Success state doesn't leak internal errors; server logs the real error, client sees a generic message + a `mailto:` fallback.
- [ ] `.env.local` in `.gitignore`; `.env.example` committed with no secrets.

---

## 12. Build order (suggested)

1. `create-next-app`, Tailwind, shadcn init, `site-config.ts`, `env.ts`.
2. `layout/site-header`, `layout/site-footer`, `mobile-nav` + `ui-store`.
3. Section components from `reliance_clone/*.md` (`hero`, `value-card`, `split-feature`, `cta-band`, `service-card`).
4. Static pages: Home, Our Difference, Services (+ Trucking Insurance), Contact shell, legal pages.
5. `contact-form` + `/api/contact` + `send-contact-email` — **do the small form first**, it's the whole email pipeline in miniature.
6. Test Resend Phase 0 with the contact form.
7. `quote-form` (fields, `vin-repeater`, `file-upload-row`) + `/api/quote` + `send-quote-email`.
8. `quote-form-inline` on the Home page (reuses fields, no uploads).
9. Test matrix in section 9.
10. Deploy to Vercel, set env vars, Phase 1 test.
11. `sitemap.ts`, `robots.ts`, metadata/OG tags, Lighthouse pass (a11y + perf).
12. When the client delivers the domain → section 10, Phase 2.

---

## 13. Open questions for the client / PM

- File uploads: default is **Option A** (direct attach, 1.5 MB/file, ~4 MB total guard).
  Only revisit if the client expects frequent large multi-file submissions → Option B. (Section 7.)
- Business email address for `QUOTE_INBOX` — one inbox, or separate quote vs. contact inboxes?
- Send `from` a subdomain (`quotes@send.divinegroupstore.com`) — OK? (Strongly recommended.)
- Customer auto-reply email: yes/no?
- Keep the multilingual language dropdown (English/Español/Russian) from the reference, or drop it?
- Real list of services and real office address(es) for `site-config.ts`.
- Confirm domain spelling: `divinegroupstore.com` vs `thedevinegroupstore.com` vs `divinegroupinc` — these differ across the proposal and repo name.
