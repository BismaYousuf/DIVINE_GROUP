# Divine Group Website — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Phase 1 of the Divine Group website — a Next.js App Router foundation, a Precision-Instrument design-token + GSAP motion system, global layout, and a complete award-quality animated Home page with a working inline quote form wired to Resend.

**Architecture:** Server Components render semantic HTML + all copy (site works with JS off). Thin `"use client"` wrappers add GSAP motion via `useGSAP` scoped contexts. A root `<SmoothScrollProvider>` runs Lenis driven by the GSAP ticker. A single `motionAllowed()` + `gsap.matchMedia()` gate disables pins / horizontal scroll / parallax on `< lg` and for `prefers-reduced-motion`. Email is the only backend: two Node-runtime route handlers call Resend.

**Tech Stack:** Next.js (App Router, TS), Tailwind v4 (CSS-first `@theme`), GSAP + ScrollTrigger + SplitText + Observer + `@gsap/react`, Lenis, React Hook Form + Zod, Resend, Zustand (tiny), shadcn/Radix primitives, Sonner, Vitest (unit tests for validations + API).

**Spec:** `docs/superpowers/specs/2026-09-09-divine-group-website-design.md`

## Global Constraints

- Next.js App Router, TypeScript strict, **Tailwind v4** (CSS-first `@theme`, no `tailwind.config.ts`). Supersedes the v3 mention in `docs/TECHNICAL.md`.
- Server Components by default; `"use client"` only for motion wrappers, forms, mobile nav, header. No content rendered only inside a client component.
- Animate only `transform`, `opacity`, `clip-path`. `will-change` on enter, off on complete. `SplitText.revert()` after reveal.
- `prefers-reduced-motion: reduce` → all elements render in final state, Lenis off, no scrub/parallax/autoplay. `< 1024px` → no pins, no horizontal scroll, parallax ≤ 8px.
- Colour tokens exact: `--color-ink #0B0B0C`, `--color-paper #F4F2ED`, `--color-paper-hi #FBFAF7`, `--color-graphite #6B6B66`, `--color-hairline #0b0b0c24`, `--color-fog #E4E1D8`, `--color-accent #D64222`, `--color-accent-press #B5331A`, `--color-night #0E1113`, `--color-night-fg #E8E6E1`, `--color-amber #F2A83B`.
- Fonts self-hosted via `next/font/local`: display = Clash Display, sans = General Sans, mono = JetBrains Mono, serif = Instrument Serif italic. `display: "swap"`.
- Motion tokens: `EASE.out="power3.out"`, `EASE.outStrong="power4.out"`, `EASE.expo="expo.out"`, `EASE.inOut="power2.inOut"`, `EASE.micro="power2.out"`; `DUR={micro:.3,enter:.8,cinematic:1.3}`; `STAGGER={tight:.06,base:.08}`.
- Body copy always `--color-ink` on `--color-paper`. Ember only for large display type, hairline rules, focus rings, primary CTA, mono labels ≥ 24px/bold.
- No bordered/rounded-corner card grids. Border-radius: 0 for layout, 2–4px for form controls only.
- Every page: one `<h1>`, ordered headings, landmarks (`header`/`main`/`footer`/`nav[aria-label]`), skip-to-content link, visible ember focus ring, target size ≥ 44px for buttons.
- All marketing copy, stats, phone/email/address are placeholders — mark each block `{/* CLIENT TO CONFIRM */}`.
- `RESEND_API_KEY` and secrets never in `NEXT_PUBLIC_*` or client components. Route handlers: `export const runtime = "nodejs"; export const dynamic = "force-dynamic";`.
- Commit after every task. Run `npx tsc --noEmit` and `npm run lint` before each commit; both must pass clean.

---

### Task 1: Project scaffold, tokens, fonts

**Files:**
- Create: whole Next.js project at repo root (`app/`, `package.json`, `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs`)
- Create: `app/globals.css`, `app/fonts/` (font files), `lib/fonts.ts`
- Create: `.env.example`, `.gitignore` (from create-next-app), `.nvmrc`
- Create: `vitest.config.ts`, `vitest.setup.ts`

**Interfaces:**
- Produces: `lib/fonts.ts` exporting `display`, `sans`, `mono`, `serif` (`NextFontWithVariable`); CSS vars `--font-display/-sans/-mono/-serif` on `<html>`.
- Produces: Tailwind v4 theme tokens (colours, `--font-*`, spacing scale, `--ease-*`, container) available as utilities.

- [ ] **Step 1: Scaffold** — run `npx create-next-app@latest . --typescript --tailwind --app --eslint --no-src-dir --import-alias "@/*" --use-npm` in `C:\code\divinegroupinc` (accept overwrite of empty dir; keep `docs/`, `.claude/`). If it refuses due to non-empty dir, scaffold in a temp dir and move files in.
- [ ] **Step 2: Init git** — `git init && git add -A && git commit -m "chore: scaffold next.js app"` (local only; no push).
- [ ] **Step 3: Add deps** — `npm i gsap @gsap/react lenis zustand react-hook-form zod @hookform/resolvers resend class-variance-authority clsx tailwind-merge lucide-react sonner` and `npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom`.
- [ ] **Step 4: Fonts** — download Clash Display + General Sans (Fontshare), JetBrains Mono, Instrument Serif into `app/fonts/` (woff2). Create `lib/fonts.ts` with `localFont({ src, variable, display: "swap", weight })` for each. Wire the four `.variable` classes onto `<html>` in `app/layout.tsx`.
- [ ] **Step 5: Tokens** — replace `app/globals.css` with: Tailwind v4 `@import "tailwindcss"`; `@theme { --color-*: …; --font-display: var(--font-display-src); … --spacing-*; --ease-out/-expo/… }`; a base layer setting `html{color-scheme:light}`, `body{background:var(--color-paper);color:var(--color-ink);font-family:var(--font-sans)}`, `::selection{background:var(--color-accent);color:var(--color-paper-hi)}`, focus-visible ember ring, `@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}`. Define fluid type utilities (`.text-display-xl` … via `@utility` or plain classes) with the `clamp()` values from spec §4.1.
- [ ] **Step 6: Vitest config** — `vitest.config.ts` (jsdom env, react plugin, alias `@`), `vitest.setup.ts`. Add `"test": "vitest run"`, `"test:watch": "vitest"`, `"typecheck": "tsc --noEmit"` to `package.json` scripts.
- [ ] **Step 7: `.env.example`** — copy the block from `docs/TECHNICAL.md` §4 verbatim.
- [ ] **Step 8: Verify** — `npm run dev` renders the default page with `body` on `--color-paper`; `npm run typecheck` and `npm run lint` clean; `npm run test` runs (0 tests OK).
- [ ] **Step 9: Commit** — `git add -A && git commit -m "chore: tailwind v4 tokens, fonts, vitest"`.

---

### Task 2: `lib` foundations — config, utils, env, validations

**Files:**
- Create: `lib/site-config.ts`, `lib/utils.ts`, `lib/env.ts`, `lib/motion/tokens.ts`
- Create: `lib/validations/quote.ts`, `lib/validations/contact.ts`
- Create: `lib/validations/quote.test.ts`, `lib/validations/contact.test.ts`

**Interfaces:**
- Produces: `siteConfig` (`name`, `legalName`, `descriptor`, `url`, `phone`, `phoneHref`, `email`, `address`, `nav: {label,href}[]`, `socials: {label,href}[]`, `coverageLines: {code,name,blurb}[]`, `disclaimer`).
- Produces: `cn(...)`, `formatBytes(n)`.
- Produces: `env` (zod-parsed) per `TECHNICAL.md` §4.
- Produces: `EASE`, `DUR`, `STAGGER` constants (spec §4.4).
- Produces: `inlineQuoteSchema` + `InlineQuoteInput` (short home form: `name`, `email`, `phone`, `company?`, `state?`, `coverageInterest`, `consent:boolean`, `company_website?` honeypot). `contactSchema` + `ContactInput`.

- [ ] **Step 1: Write failing tests** — `quote.test.ts`: valid input passes; missing `name` fails; bad `email` fails; `consent:false` fails; honeypot present still parses (route drops it, schema allows). `contact.test.ts`: analogous.

```ts
import { inlineQuoteSchema } from "./quote";
test("rejects invalid email", () => {
  const r = inlineQuoteSchema.safeParse({ name: "A", email: "x", phone: "5551234567", coverageInterest: "cargo", consent: true });
  expect(r.success).toBe(false);
});
test("accepts a complete submission", () => {
  const r = inlineQuoteSchema.safeParse({ name: "Ada", email: "a@b.com", phone: "5551234567", coverageInterest: "cargo", consent: true });
  expect(r.success).toBe(true);
});
```

- [ ] **Step 2: Run** — `npx vitest run lib/validations` → FAIL (modules missing).
- [ ] **Step 3: Implement** — write `lib/validations/quote.ts` + `contact.ts` with the Zod schemas; `lib/site-config.ts` with placeholder data + `{/* CLIENT TO CONFIRM */}` comments; `lib/utils.ts`; `lib/env.ts` (from `TECHNICAL.md`); `lib/motion/tokens.ts`.
- [ ] **Step 4: Run** — `npx vitest run lib/validations` → PASS.
- [ ] **Step 5: Verify** — `npm run typecheck` clean.
- [ ] **Step 6: Commit** — `git commit -am "feat: lib config, env, motion tokens, validation schemas + tests"`.

---

### Task 3: Email senders + Resend client

**Files:**
- Create: `lib/resend.ts`, `lib/email/send-quote-email.ts`, `lib/email/send-contact-email.ts`, `lib/turnstile.ts`
- Create: `lib/email/send-quote-email.test.ts` (mock `resend`)

**Interfaces:**
- Consumes: `env`, `InlineQuoteInput`, `ContactInput`.
- Produces: `sendQuoteEmail(data: InlineQuoteInput, files?: {field,file}[]): Promise<void>` — builds escaped HTML table, calls `resend.emails.send({from,to:env.QUOTE_INBOX,replyTo:data.email,subject,html,attachments})`, throws on `error`.
- Produces: `sendContactEmail(data: ContactInput): Promise<void>`.
- Produces: `verifyTurnstile(token: FormDataEntryValue|null): Promise<boolean>` (returns `true` when `env.TURNSTILE_SECRET_KEY` unset).
- Produces: `escapeHtml(s: string): string` (exported from send-quote-email).

- [ ] **Step 1: Failing test** — mock `@/lib/resend` so `emails.send` returns `{error:null}`; assert `sendQuoteEmail` calls it once with `to === env.QUOTE_INBOX` and `replyTo === data.email`; a second test where `send` returns `{error:{name:"x",message:"y"}}` asserts `sendQuoteEmail` rejects.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** — code exactly per `docs/TECHNICAL.md` §6 (`send-quote-email.ts`, `escapeHtml`), the contact analogue, `lib/resend.ts` (`export const resend = new Resend(env.RESEND_API_KEY)`), `lib/turnstile.ts`.
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Verify** — `npm run typecheck` clean.
- [ ] **Step 6: Commit** — `git commit -am "feat: resend client + quote/contact email senders + tests"`.

---

### Task 4: API route handlers

**Files:**
- Create: `app/api/quote/route.ts`, `app/api/contact/route.ts`
- Create: `app/api/quote/route.test.ts`

**Interfaces:**
- Consumes: `inlineQuoteSchema`, `contactSchema`, `sendQuoteEmail`, `sendContactEmail`, `verifyTurnstile`.
- Produces: `POST` handlers returning `{ok:true}` (200) or `{error, issues?}` (400/413/500). `runtime="nodejs"`, `dynamic="force-dynamic"`.

- [ ] **Step 1: Failing test** — build a `Request` with `FormData`; mock the email sender; assert: valid → 200 `{ok:true}`; honeypot `company_website` set → 200 `{ok:true}` and sender **not** called; invalid email → 400 with `issues`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** — `app/api/quote/route.ts` per `TECHNICAL.md` §6 but using `inlineQuoteSchema` fields (no file loop this pass; keep the `file_*` collection + size/type/total guards as dead-safe code, guarded by `UPLOAD_STRATEGY`); `app/api/contact/route.ts` the contact analogue.
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Verify** — `npm run typecheck` + `npm run lint` clean.
- [ ] **Step 6: Commit** — `git commit -am "feat: /api/quote + /api/contact route handlers + tests"`.

---

### Task 5: Motion foundation

**Files:**
- Create: `components/motion/use-motion-allowed.ts`, `components/motion/smooth-scroll-provider.tsx`, `components/motion/gsap.ts` (registers plugins once)
- Create: `components/motion/reveal.tsx`, `split-lines.tsx`, `parallax.tsx`, `magnetic-button.tsx`, `count-up.tsx`
- Modify: `app/layout.tsx` (wrap children in `<SmoothScrollProvider>`)

**Interfaces:**
- Produces: `useMotionAllowed(): { reduced: boolean; desktop: boolean }` (SSR-safe; `false/false` until mounted).
- Produces: `<SmoothScrollProvider>` — Lenis + `gsap.ticker` wiring; no-ops when `reduced`.
- Produces: `registerGsap()` — idempotent `gsap.registerPlugin(ScrollTrigger, SplitText, Observer, useGSAP)`.
- Produces: `<Reveal as? y? delay? stagger? children>` — children rise+fade on enter (`EASE.out`, `DUR.enter`); static when reduced.
- Produces: `<SplitLines as? children>` — line-mask reveal of its text; reverts SplitText after; static when reduced.
- Produces: `<Parallax speed? children>` — `y` translate on scrub; clamps to 8px on non-desktop; off when reduced.
- Produces: `<MagneticButton href? onClick? variant? children>` — anchor/button, pointer-follow ≤ 6px + scale 1.02; plain when reduced or touch.
- Produces: `<CountUp value suffix? prefix? decimals? children?>` — counts on enter; final value when reduced.

- [ ] **Step 1:** Implement `gsap.ts` + `use-motion-allowed.ts` (matchMedia listeners, cleanup).
- [ ] **Step 2:** Implement `smooth-scroll-provider.tsx`; mount in `layout.tsx`.
- [ ] **Step 3:** Implement the five primitives, each with a reduced-motion branch that renders final state.
- [ ] **Step 4: Verify** — temporary demo section on Home using each primitive scrolls at 60fps; toggling OS "reduce motion" removes animation and shows content; `npm run typecheck`/`lint` clean. Remove the demo before commit.
- [ ] **Step 5: Commit** — `git commit -am "feat: GSAP+Lenis motion foundation and primitives"`.

---

### Task 6: UI primitives + global layout

**Files:**
- Create: `components/ui/button.tsx`, `input.tsx`, `textarea.tsx`, `label.tsx`, `sheet.tsx`, `sonner.tsx` (shadcn add, then restyle to tokens — no rounded/gradient defaults)
- Create: `components/layout/site-header.tsx`, `site-footer.tsx`, `mobile-nav.tsx`, `grid-lines.tsx`, `skip-link.tsx`
- Create: `stores/ui-store.ts`
- Modify: `app/layout.tsx` (metadata base, `<SkipLink>`, `<SiteHeader>`, `<main id="content">`, `<SiteFooter>`, `<Toaster>`)

**Interfaces:**
- Consumes: `siteConfig.nav`, `useMotionAllowed`, `<MagneticButton>`.
- Produces: `useUIStore` (`mobileNavOpen`, `setMobileNavOpen`).
- Produces: `<SiteHeader>` — scroll-aware (hide down / show up past 120px via ScrollTrigger or a scroll listener), gains paper bg + hairline after 120px, `data-theme="night"` toggled by a body-level ScrollTrigger set on dark sections; mobile hamburger → `<MobileNav>` `<Sheet>`.
- Produces: `<SiteFooter>` — ink ground, columns, legal row, clipped `DIVINE GROUP` watermark with subtle `<Parallax>`.
- Produces: `<GridLines>` — `aria-hidden` column hairlines, `lg+` only.

- [ ] **Step 1:** `npx shadcn@latest init` + `add button input textarea label sheet sonner`; restyle each to tokens (square, hairline borders, ember focus, mono where labelled).
- [ ] **Step 2:** `ui-store.ts`; `skip-link.tsx`; `grid-lines.tsx`.
- [ ] **Step 3:** `site-header.tsx` + `mobile-nav.tsx` (Radix `Sheet`, focus trap, staggered link reveal, close on route change).
- [ ] **Step 4:** `site-footer.tsx`.
- [ ] **Step 5:** Wire all into `app/layout.tsx` with root `metadata` + `metadataBase`.
- [ ] **Step 6: Verify** — header hides/shows on scroll, inverts over a temporary dark block, mobile sheet traps focus + closes on Esc; keyboard reaches every nav item; `typecheck`/`lint` clean.
- [ ] **Step 7: Commit** — `git commit -am "feat: ui primitives + global header/footer/mobile nav"`.

---

### Task 7: Home — Hero (§6.1)

**Files:**
- Create: `components/home/hero.tsx` (server) + `components/home/hero-media.tsx` (client, isolates the media layer for Phase 3)
- Create: `public/media/hero.jpg` (placeholder duotone freight photo — commit a real optimized stock image ≤ 220KB)
- Modify: `app/page.tsx` (render `<Hero/>`)

**Interfaces:**
- Consumes: `<SplitLines>`, `<Parallax>`, `<MagneticButton>`, `siteConfig`.
- Produces: `<Hero>` section markup; `<HeroMedia>` (`next/image` `priority`, clip-path wipe-in + `scale 1.08→1` scrub on desktop).

- [ ] **Step 1:** Build `hero.tsx` — `100svh`, mono eyebrow, `<h1>` (3 lines, `text-display-xl`) in `<SplitLines>`, ember sentence, `Get a Quote` (magnetic) + ghost `See how we work` anchor to `#capabilities`, mono instrument readout (`aria-hidden`), scroll cue.
- [ ] **Step 2:** Build `hero-media.tsx` — full-bleed `next/image`, `useGSAP` clip-path `inset(0 0 100% 0)→inset(0)` + parallax scale; reduced-motion → static.
- [ ] **Step 3: Verify** — headline reveals on load, image wipes, 60fps; reduced-motion static; mobile: headline wraps cleanly, image `object-cover`, no horizontal scroll; Lighthouse LCP element = hero image, LCP < 2.5s locally.
- [ ] **Step 4: Commit** — `git commit -am "feat(home): hero section"`.

---

### Task 8: Home — Positioning statement (§6.2)

**Files:**
- Create: `components/home/positioning-statement.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `useMotionAllowed`, `registerGsap`, `EASE`.
- Produces: `<PositioningStatement>` — pinned ~120vh on desktop; SplitText words ink→ember on `scrub`; sticky mono `01 — POSITION`; unpinned `<Reveal>` with ember final phrase on mobile/reduced.

- [ ] **Step 1:** Implement with `gsap.matchMedia()` (desktop = pinned scrub; else = Reveal).
- [ ] **Step 2: Verify** — words ignite across the pin; on mobile it's a normal block; reduced-motion shows full static sentence with ember tail; no layout shift entering/leaving the pin.
- [ ] **Step 3: Commit** — `git commit -am "feat(home): positioning statement"`.

---

### Task 9: Home — Capabilities pinned sequence (§6.3)

**Files:**
- Create: `components/home/capabilities.tsx`, `components/home/capability-panel.tsx`
- Create: `public/media/cap-01.jpg`, `cap-02.jpg`, `cap-03.jpg` (thin vertical placeholders)
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `useGSAP`, `gsap.matchMedia`, `<Parallax>`.
- Produces: `<Capabilities id="capabilities">` — desktop: `pin` ~300vh, 3 panels advance on scrub (`clip` + `y`), progress rail; mobile/reduced: 3 stacked `<Reveal>` blocks with image wipe.
- Data: `CAPABILITIES = [{n:"01",label:"Fluency",body,img},{n:"02",label:"Strategy",…},{n:"03",label:"The extra mile",…}]` (placeholder copy).

- [ ] **Step 1:** `capability-panel.tsx` (index numeral, mono label, paragraph ≤ 60ch, clip-revealed image).
- [ ] **Step 2:** `capabilities.tsx` timeline: pin wrapper, 3 segments, rail tick → ember on active.
- [ ] **Step 3: Verify** — scrub advances panels smoothly at 60fps, no content clipped from AT (DOM has all 3 panels in order), keyboard focus on the ghost hero link scrolls here; mobile = 3 stacked blocks; reduced-motion = static 3 blocks.
- [ ] **Step 4: Commit** — `git commit -am "feat(home): capabilities pinned sequence"`.

---

### Task 10: Home — Coverage band horizontal scroll (§6.4)

**Files:**
- Create: `components/home/coverage-band.tsx`, `components/home/coverage-slab.tsx`
- Modify: `app/page.tsx`; add `coverageLines` to `lib/site-config.ts` if not already.

**Interfaces:**
- Consumes: `siteConfig.coverageLines`, `useGSAP`, `gsap.matchMedia`, `Observer`.
- Produces: `<CoverageBand>` — desktop: pin wrapper, `x: -(scrollWidth - innerWidth)` on `scrub`, `Observer` for drag, progress hairline; mobile/reduced: vertical `<Reveal>` list. Final slab = ember `View all services →` → `/services`.
- Produces: `<CoverageSlab code name blurb href?>`.

- [ ] **Step 1:** `coverage-slab.tsx` with hover (name→ember, underline wipe, ground `--color-fog`).
- [ ] **Step 2:** `coverage-band.tsx` horizontal pin; keyboard: Tab through slabs scrolls the focused slab into view (`scrollIntoView({inline:"center"})`); visible "scroll horizontally →" affordance.
- [ ] **Step 3: Verify** — smooth horizontal scrub, drag works, keyboard traversal works and is not trapped, `View all services` navigates; mobile = vertical list; reduced-motion = vertical list.
- [ ] **Step 4: Commit** — `git commit -am "feat(home): horizontal coverage band"`.

---

### Task 11: Home — Inline quote form (§6.5) wired to API

**Files:**
- Create: `components/home/inline-quote.tsx`, `components/forms/inline-quote-form.tsx`, `components/forms/fields/field.tsx` (label + hairline input + error)
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `inlineQuoteSchema`, `<Reveal>`, `<MagneticButton>`, `toast` (sonner), `siteConfig`.
- Produces: `<InlineQuote>` — 2-col (sticky pitch + phone | form), stacks on mobile.
- Produces: `<InlineQuoteForm>` — RHF + `zodResolver(inlineQuoteSchema)`; fields Name*, Email*, Phone*, Company/DOT, State (`<select>`), Coverage interest (`<textarea>`), consent checkbox, honeypot `company_website` (visually hidden, `tabindex=-1`, `autocomplete=off`). Submit → `FormData` → `fetch("/api/quote",{method:"POST",body})` → `toast.promise` → on ok replace form with success panel; on error keep data + `toast.error` + `mailto:` fallback. Focus first invalid on submit.

- [ ] **Step 1:** `field.tsx` instrument-panel field (mono label, hairline underline, ember focus, mono ember error, `aria-invalid`/`aria-describedby`).
- [ ] **Step 2:** `inline-quote-form.tsx` (RHF wiring, submit handler, success panel).
- [ ] **Step 3:** `inline-quote.tsx` layout + `<Reveal>` stagger on fields.
- [ ] **Step 4: Verify** — invalid submit focuses first bad field + shows mono errors; valid submit with `.env.local` pointing at `onboarding@resend.dev` + your Gmail → email arrives, Resend Logs show `delivered`, success panel renders; honeypot filled → 200 and no email; keyboard-only completes the form; `typecheck`/`lint` clean.
- [ ] **Step 5: Commit** — `git commit -am "feat(home): inline quote form wired to /api/quote"`.

---

### Task 12: Home — Divine difference (Nocturne, §6.6)

**Files:**
- Create: `components/home/divine-difference.tsx`
- Create: `public/media/night.jpg` (headlights-at-night placeholder), `public/media/grain.svg`
- Modify: `app/page.tsx`; ensure header night-inversion ScrollTrigger targets this section's id.

**Interfaces:**
- Consumes: `<SplitLines>`, `<Parallax>`, `siteConfig`.
- Produces: `<DivineDifference id="difference">` — full-bleed `--color-night`, static SVG grain overlay (`aria-hidden`), `display-l` statement + `Our Difference →` (amber underline wipe), image with 2–3 `<Parallax>` depth layers + clip-reveal, sticky amber `04 — DIFFERENCE`.

- [ ] **Step 1:** Build the section; verify header flips to `data-theme="night"` while it's in view and back after.
- [ ] **Step 2: Verify** — parallax depth reads on desktop, ≤ 8px on mobile, none on reduced-motion; grain is static; contrast of `night-fg` on `night` ≥ 7:1; link reachable by keyboard.
- [ ] **Step 3: Commit** — `git commit -am "feat(home): nocturne difference band"`.

---

### Task 13: Home — Numbers (§6.7) + CTA band (§6.8) + Footer watermark polish

**Files:**
- Create: `components/home/numbers.tsx`, `components/home/cta-band.tsx`
- Modify: `app/page.tsx` (final section order), `components/layout/site-footer.tsx` (watermark parallax if deferred from Task 6)

**Interfaces:**
- Consumes: `<CountUp>`, `<SplitLines>`, `<MagneticButton>`, `siteConfig`.
- Produces: `<Numbers>` — hairline-separated row (2×2 on mobile), mono display numerals via `<CountUp>`, `caption` labels, all `{/* CLIENT TO CONFIRM */}`.
- Produces: `<CtaBand>` — full-bleed `--color-accent`, `display-l` on `paper-hi`, paper `Get a Quote` (magnetic) + `Talk to a specialist` (`tel:`), headline line-mask reveal.

- [ ] **Step 1:** Build both sections; assemble final `app/page.tsx` order: Hero → PositioningStatement → Capabilities → CoverageBand → InlineQuote → DivineDifference → Numbers → CtaBand.
- [ ] **Step 2: Verify** — count-up runs once on enter, shows final value on reduced-motion; CTA contrast (ink on ember button ground = paper) checked; full-page scroll from top to footer stays 60fps.
- [ ] **Step 3: Commit** — `git commit -am "feat(home): numbers + cta band; assemble home page"`.

---

### Task 14: Stub routes, SEO, not-found

**Files:**
- Create: `app/our-difference/page.tsx`, `app/services/page.tsx`, `app/services/trucking-insurance/page.tsx`, `app/get-a-quote/page.tsx`, `app/contact-us/page.tsx`, `app/(legal)/privacy-policy/page.tsx`, `app/(legal)/terms/page.tsx`
- Create: `app/sitemap.ts`, `app/robots.ts`, `app/not-found.tsx`
- Create: `components/seo/json-ld.tsx`
- Create: `public/media/og.jpg` (1200×630 ember + wordmark)
- Modify: `app/page.tsx` (add `<JsonLd>` `InsuranceAgency`), each stub exports `metadata`.

**Interfaces:**
- Consumes: `siteConfig`.
- Produces: 7 stub pages (correct `<title>`, `<h1>`, one paragraph "In progress", link Home), `sitemap.ts` (all real routes, `lastModified`), `robots.ts` (allow all + sitemap URL), `not-found.tsx` (branded 404), `<JsonLd type>` component.

- [ ] **Step 1:** Create all stub pages with per-route `metadata` (title, description, `alternates.canonical`).
- [ ] **Step 2:** `sitemap.ts`, `robots.ts`, `not-found.tsx`, `json-ld.tsx`; add `InsuranceAgency` JSON-LD to Home.
- [ ] **Step 3: Verify** — every nav link and footer link resolves (no 404s except intentional), `/sitemap.xml` and `/robots.txt` serve, `metadataBase` set so OG URLs are absolute; `npm run build` succeeds.
- [ ] **Step 4: Commit** — `git commit -am "feat: stub routes, sitemap, robots, json-ld, 404"`.

---

### Task 15: Audit pass — reduced-motion, mobile, a11y, performance, animation review

**Files:**
- Modify: any component failing an audit check
- Create: `docs/superpowers/plans/2026-09-09-audit-notes.md` (findings + fixes log)

- [ ] **Step 1: Reduced-motion sweep** — OS "reduce motion" on: walk every Home section; confirm no motion, no missing content, Lenis disabled. Fix violations.
- [ ] **Step 2: Mobile sweep** — 360 / 390 / 768 px: no horizontal page scroll, no pins, tap targets ≥ 44px, hero headline no overflow, coverage band is a vertical list, forms single-column. Fix.
- [ ] **Step 3: Keyboard/a11y sweep** — Tab from skip-link through footer: visible ember focus everywhere, no traps (esp. coverage band + mobile sheet), headings ordered, run `npm run build` + a quick axe check in devtools. Fix.
- [ ] **Step 4: Performance** — production build, Lighthouse mobile: Perf ≥ 90, A11y ≥ 95, BP ≥ 95, SEO ≥ 95; LCP < 2.5s, CLS < 0.02. Compress any image over budget; `will-change` cleanup verified in Performance panel. Fix.
- [ ] **Step 5: Animation review** — apply `review-animations` + `improve-animations` skills to `components/home/*` and `components/motion/*`: every animation maps to arrival / emphasis / transition / continuity; kill any that don't; check easing/duration against `lib/motion/tokens.ts`. Fix.
- [ ] **Step 6: Final** — `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build` all clean. Commit — `git commit -am "chore: phase-1 audit fixes (motion, a11y, perf)"`.

---

## Self-Review

**Spec coverage:**
- §2 scope (in / stubbed) → Tasks 1–14; Phase 2/3 explicitly deferred. ✓
- §3 architecture (RSC, Lenis, motion gate, perf budget, folder structure) → Tasks 1, 5, 6. ✓
- §4 design system (type, colour, grid, motion tokens) → Task 1 (tokens/fonts), Task 6 (`<GridLines>`). ✓
- §5 motion patterns → primitives Task 5; applied per Home section Tasks 7–13; scroll-aware nav Task 6; audit Task 15. ✓
- §6 Home sections 6.0–6.9 → Tasks 6 (header/footer), 7–13. ✓
- §7 forms/API/email → Tasks 3, 4, 11. ✓
- §8 SEO → Task 14. ✓
- §9 accessibility → per-section verify steps + Task 15 sweep. ✓
- §10 performance/acceptance → Task 15. ✓
- §11 Phase 3 → not built; `<HeroMedia>` isolation in Task 7 keeps the door open. ✓
- §12 open items → placeholders + `{/* CLIENT TO CONFIRM */}` throughout. ✓
- §13 skills → applied across; audit skills in Task 15. ✓

**Placeholder scan:** No "TBD/TODO/handle edge cases" left as work items; copy placeholders are intentional and tagged. Test code is concrete where tasks are TDD (2, 3, 4). Visual tasks (5–13) verify by build + reduced-motion + mobile + keyboard + Lighthouse, since GSAP choreography has no meaningful unit test — acceptance criteria are explicit.

**Type consistency:** `inlineQuoteSchema`/`InlineQuoteInput` used identically in Tasks 2 → 3 → 4 → 11. `sendQuoteEmail(data, files?)` signature stable Tasks 3 → 4. `useMotionAllowed()` return shape `{reduced,desktop}` stable Tasks 5 → 7–13. `<HeroMedia>` introduced Task 7, referenced by Phase 3 note only. Motion tokens `EASE/DUR/STAGGER` defined Task 2, consumed Tasks 5–13.
