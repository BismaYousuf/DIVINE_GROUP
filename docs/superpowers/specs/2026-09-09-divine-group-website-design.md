# Divine Group Inc — Website Design Spec

**Date:** 2026-09-09
**Status:** Approved direction → implementation
**Companion docs:** `docs/REQUIREMENTS.MD`, `docs/TECHNICAL.md`, `docs/reliance_clone/*.md`
**Design lineage:** Precision Instrument (primary) + Editorial Freight (typography, warmth) + Nocturne Logistics (dark cinematic moments)

---

## 1. Overview

Marketing website for **Divine Group** — a freight & commercial insurance brokerage. The site
must read as a **premium technology / engineering brand**, not a traditional insurance site:
oversized editorial typography, a warm black / off-white foundation with one signal-ember
accent, precise visible grid systems, editorial asymmetry, cinematic photography, and
extensive but purposeful GSAP motion. Benchmark: Awwwards / GSAP-Showcase quality, while
staying professional, fast, accessible, responsive, and conversion-focused (one primary CTA:
**Get a Quote**).

Functional structure comes from `docs/reliance_clone/*.md`. Visual design is elevated well
beyond a clone.

### Goals
- Home page that feels award-winning and unmistakably not templated / not "AI slop".
- A reusable design-token + motion system the remaining pages inherit.
- The lead pipeline working end to end: inline quote form → `/api/quote` → Resend.
- 60fps scroll, LCP < 2.5s, CLS ≈ 0, Lighthouse ≥ 95 for a11y & SEO.
- Full keyboard access; `prefers-reduced-motion` fully honoured.

### Non-goals (this pass)
- Designing/animating the other pages (Phase 2).
- The full VIN + document-upload quote form (Phase 2).
- The hero scroll-driven frame sequence (Phase 3).
- CMS, auth, database, admin — permanently out of scope per `TECHNICAL.md`.

---

## 2. Scope

### In — Phase 1 (this implementation)
- Next.js App Router + TypeScript + Tailwind v4 project scaffold.
- Design tokens (color, type, space, motion) as CSS-first `@theme` in `globals.css`.
- Self-hosted fonts via `next/font/local`.
- GSAP + Lenis motion system: `<SmoothScrollProvider>`, `useGSAP` scoped setup, reduced-motion
  + mobile `matchMedia` gates, motion primitives (`<Reveal>`, `<SplitLines>`, `<Parallax>`,
  `<MagneticButton>`, `<CountUp>`, `<Pinned>`).
- Global layout: `<SiteHeader>` (scroll-aware, colour-inverting), `<SiteFooter>`, `<MobileNav>`.
- **Complete, fully-animated Home page** (§6).
- Inline quote form (short, 7-field) wired to `/api/quote`.
- `/api/quote` + `/api/contact` route handlers + `lib/email/*` + Resend client + `.env.example`
  (implementation exactly as specified in `docs/TECHNICAL.md` §4–§7; not re-specified here).
- Sonner `<Toaster>`, base Radix/shadcn primitives actually used (button, input, textarea,
  label, sheet, dialog, sonner).
- SEO baseline: `metadata` API, Open Graph, `sitemap.ts`, `robots.ts`, JSON-LD
  `InsuranceAgency` on Home.
- `stores/ui-store.ts` (Zustand — mobile nav open state only).

### Stubbed — routes exist, nav works, not yet designed
`/our-difference`, `/services`, `/services/trucking-insurance`, `/get-a-quote` (full form),
`/contact-us`, `/(legal)/privacy-policy`, `/(legal)/terms`. Each renders a minimal placeholder
with correct `<title>`/metadata and a link back Home.

### Phase 2 (next pass)
Design + animate the five stubbed pages; build the full Get-a-Quote form (VIN repeater,
file-upload rows, Excel-list, consent, `/api/quote` full payload) per `docs/reliance_clone/get-a-quote.md`.

### Phase 3 (future — user's stated inspiration)
Hero **scroll-driven image sequence**: 60–130 frames of a highway truck, scrubbed by scroll
(Apple-style `<canvas>` frame animation). Research + approach captured in §11; not built until
the user has reacted to the Phase 1 hero.

---

## 3. Architecture

### Stack
Per `docs/TECHNICAL.md` §2, with these deltas:
- **Tailwind v4** (CSS-first `@theme`, no `tailwind.config.ts`) — supersedes the v3 mention in
  `TECHNICAL.md`. `create-next-app@latest` ships v4.
- **Motion:** `gsap` (incl. ScrollTrigger, SplitText, Flip, Observer — all free in GSAP ≥ 3.13),
  `@gsap/react` (`useGSAP`), `lenis` (smooth scroll).
- No `framer-motion` — GSAP owns all motion to keep one timeline model and one perf budget.

### Rendering model
- **Server Components by default.** They render semantic HTML + all copy. The page is complete
  and usable with JavaScript disabled.
- Motion is added by thin `"use client"` wrappers that receive the server-rendered children and
  animate them in place. No content lives only inside a client component.
- `useGSAP(() => { ... }, { scope })` per animated section → automatic context cleanup on
  unmount / route change.

### Smooth scroll
- `<SmoothScrollProvider>` (client, mounted once in `app/layout.tsx` around `{children}`):
  creates a Lenis instance, drives it from `gsap.ticker`, calls `ScrollTrigger.update` on
  Lenis scroll, sets `ScrollTrigger.scrollerProxy` if needed. `lenis.destroy()` on unmount.
- Disabled entirely when `prefers-reduced-motion: reduce` → native scroll, no GSAP scroll
  animations (triggers still set final state immediately via `gsap.set`).

### Responsive / reduced-motion gate
Single helper `motionAllowed()` + `gsap.matchMedia()`:
- `(prefers-reduced-motion: no-preference)` **and** `(min-width: 1024px)` → full treatment
  (pins, horizontal scroll, SplitText, parallax).
- `< 1024px` → pins and horizontal scroll replaced by vertical staggered reveals; parallax
  reduced to ≤ 8px; SplitText still allowed (cheap) but simpler.
- `prefers-reduced-motion: reduce` → everything renders in final state; no scrubbing, no
  autoplay, no parallax. Content and layout identical.

### Performance budget
- Animate only `transform`, `opacity`, `clip-path`. Never animate layout properties.
- `will-change` added on trigger enter, removed on complete.
- `SplitText` instance `.revert()`ed after its reveal finishes.
- Images: `next/image`, AVIF/WebP, explicit `sizes`, `priority` only on the hero image.
- Below-the-fold ScrollTriggers lazy-created (`ScrollTrigger.batch` / `once` where possible).
- Hero image ≤ 220KB at 1x; total Home JS (excl. fonts) target < 190KB gzip.
- No web font blocks first paint — `next/font` with `display: "swap"` and sensible fallbacks.

### Folder structure (delta over `TECHNICAL.md` §3)
```
app/
  layout.tsx            # fonts, <SmoothScrollProvider>, <SiteHeader/>, <SiteFooter/>, <Toaster/>
  page.tsx              # Home (server) — composes section components
  globals.css           # Tailwind v4 @theme tokens + base layer
components/
  layout/  site-header.tsx  site-footer.tsx  mobile-nav.tsx  grid-lines.tsx
  motion/  smooth-scroll-provider.tsx  reveal.tsx  split-lines.tsx  parallax.tsx
           magnetic-button.tsx  count-up.tsx  pinned-sequence.tsx  horizontal-scroll.tsx
           use-motion-allowed.ts
  home/    hero.tsx  positioning-statement.tsx  capabilities.tsx  coverage-band.tsx
           inline-quote.tsx  divine-difference.tsx  numbers.tsx  cta-band.tsx
  forms/   inline-quote-form.tsx  fields/*        # short form only this pass
  ui/      button.tsx input.tsx textarea.tsx label.tsx sheet.tsx dialog.tsx sonner.tsx
lib/
  site-config.ts  utils.ts  env.ts  resend.ts
  validations/quote.ts  validations/contact.ts
  email/send-quote-email.ts  email/send-contact-email.ts  turnstile.ts
  motion/tokens.ts       # easing + duration constants shared JS-side
stores/ ui-store.ts
app/api/quote/route.ts   app/api/contact/route.ts
app/sitemap.ts  app/robots.ts  app/not-found.tsx
public/media/            # cinematic photography, og image
```

---

## 4. Design system

### 4.1 Typography
Self-hosted via `next/font/local` (all free for commercial use; downloaded to `app/fonts/`):

| Token | Face | Use |
|---|---|---|
| `--font-display` | **Clash Display** (Fontshare) | Oversized headlines, section titles. Tight tracking (`-0.02em`+), weights 500/600. |
| `--font-sans` | **General Sans** (Fontshare) | Body, UI, buttons, form text. Weights 400/500/600. **Not Inter.** |
| `--font-mono` | **JetBrains Mono** | Kicker labels (`01 — OVERVIEW`), stat numerals, form labels, instrument readouts. Tabular figures. Weight 400/500. |
| `--font-serif` | **Instrument Serif** *italic* (Google) | Rare — one pull quote per page max. |

**Type scale** (fluid, `clamp()`; desktop → min):
- `display-xl` hero: `clamp(3rem, 9vw, 8.5rem)` / line-height 0.95 / tracking -0.03em
- `display-l`: `clamp(2.5rem, 5.5vw, 5rem)` / 1.0 / -0.025em
- `display-m` section title: `clamp(2rem, 3.5vw, 3.25rem)` / 1.05 / -0.02em
- `heading`: `1.5rem` / 1.15
- `body-l`: `1.25rem` / 1.5
- `body`: `1.0625rem` / 1.6
- `label` (mono): `0.75rem` / 1.4 / tracking 0.14em / uppercase
- `caption`: `0.875rem` / 1.45

Rules: single `<h1>` per page. One editorial measure (~62–70ch) for prose. Headlines may set
2–4 words per line deliberately (no orphan/widow control off — use `text-wrap: balance` on
headings, `pretty` on paragraphs). Tabular numerals everywhere numbers align.

### 4.2 Color (`@theme` tokens)
```
--color-ink:        #0B0B0C;   /* primary text, ink surfaces */
--color-paper:      #F4F2ED;   /* primary background (warm, not #fff) */
--color-paper-hi:   #FBFAF7;
--color-graphite:   #6B6B66;   /* secondary text */
--color-hairline:   #0b0b0c24; /* visible grid lines, rules (14% ink) */
--color-fog:        #E4E1D8;   /* subtle fills, hover grounds */
--color-accent:     #D64222;   /* signal ember — display words, rules, focus ring, CTA */
--color-accent-press:#B5331A;
--color-night:      #0E1113;   /* Nocturne band background */
--color-night-fg:   #E8E6E1;
--color-amber:      #F2A83B;   /* micro-highlights on dark surfaces ONLY */
```
- Body text is always `--color-ink` on `--color-paper` (≈ 17:1). Never set body copy in ember.
- Ember is for: large display words, hairline rules/underlines, focus states, the primary
  button, tiny mono labels on paper (large enough to pass AA). Every placement contrast-checked
  with the `better-colors` skill; ember-on-paper (~4.0:1) is used only ≥ 24px or bold, or for
  non-text UI.
- Dark bands use `--color-night` / `--color-night-fg`; ember still the accent; `--color-amber`
  only for hairlines/hover glints on dark.
- Focus ring: 2px `--color-accent` offset 2px, always visible on keyboard.

### 4.3 Grid & spacing
- 12-column grid, outer margin `clamp(20px, 6vw, 96px)`, column gap 24px, content max-width
  1440px, full-bleed permitted for media/bands.
- **Visible grid** motif: `<GridLines>` overlay draws faint vertical `--color-hairline` rules
  at column boundaries on `lg+` (decorative, `aria-hidden`, `pointer-events-none`).
- 8px baseline. Space scale (px): `4 8 12 16 24 32 48 64 96 128 160`.
- Section rhythm: `padding-block: clamp(96px, 14vh, 200px)`. Dividers are rules / colour
  changes / whitespace — **no bordered cards, no rounded-corner grids.** Border-radius budget:
  0 for layout, 2–4px only for form inputs / small controls.
- Editorial asymmetry: headline blocks and media intentionally break the grid and bleed one
  edge; text columns offset from centre.

### 4.4 Motion tokens (`lib/motion/tokens.ts`)
```
EASE = {
  out:  "power3.out",     // standard entrance
  outStrong: "power4.out",
  expo: "expo.out",       // large positional moves
  inOut:"power2.inOut",   // pinned scrub segments
  micro:"power2.out",
}
DUR = { micro: .3, enter: .8, cinematic: 1.3 }
STAGGER = { tight: .06, base: .08 }
```
Reduced-motion: `DUR` → 0, all triggers `gsap.set` to final state.

---

## 5. Motion system — patterns

| Pattern | Where | Technique | Mobile / reduced |
|---|---|---|---|
| **Line-mask headline reveal** | hero, section titles | SplitText lines → `y:110%` in clip mask → stagger rise, `EASE.outStrong`, `DUR.enter` | still runs (cheap), no stagger under reduced-motion |
| **Clip-path media wipe** | hero image, capability images | `clip-path: inset(0 0 100% 0)` → `inset(0)` on enter, `EASE.expo` | fade-only |
| **Word-ignite statement** | positioning statement | pinned ~120vh, SplitText words, colour ink→ember tied to `scrub` | static ink text, ember on final word only |
| **Pinned step sequence** | capabilities 01/02/03 | section `pin: true`, timeline with 3 segments; panels cross-fade + slight x / clip | unpinned → 3 stacked `<Reveal>` blocks |
| **Horizontal pinned scroll** | coverage band | pin wrapper, `x: -(scrollWidth - vw)` on `scrub`, Observer for drag | vertical list, staggered `<Reveal>` |
| **Layered parallax** | all cinematic photos | 2–3 layers `y` at different rates, ≤ 60px desktop / ≤ 8px mobile | off |
| **Count-up** | numbers section | `ScrollTrigger.batch`, `gsap.to({val})` + `snap`, tabular mono | set final value |
| **Sticky section label** | every major section | mono `01 — LABEL` `position: sticky` top gutter | static |
| **Magnetic CTA** | primary buttons | pointer-follow translate (max 6px) + scale 1.02, springy `EASE.micro`; disabled on touch | static |
| **Link underline wipe** | nav + text links | ember underline scaleX 0→1 from left on hover/focus | instant |
| **Scroll-aware nav** | header | hide on scroll-down past 120px, show on scroll-up; invert to night palette while over dark bands (ScrollTrigger `toggleClass`) | show/hide only, no magnet |
| **Page transition** | route changes (Phase 2 mainly) | ember panel wipe out/in, 0.5s; Phase 1: just a fast fade | instant |

Every animation must answer: arrival, emphasis, transition, or spatial continuity. If it's
none of those, it doesn't ship. Post-build audit with `review-animations` +
`find-animation-opportunities` + `improve-animations`.

---

## 6. Home page — section spec

Reference structure: `docs/reliance_clone/home.md`. Copy = fresh placeholder, every block
tagged `{/* CLIENT TO CONFIRM */}`. All claims (numbers, tenure, carriers) are placeholders.

### 6.0 Header (`site-header.tsx`, client)
- Left: `DIVINE GROUP` mono logotype (letter-spaced). Right: 4 links (Our Difference,
  Services, Contact — plus the Get a Quote button) + ember `Get a Quote` pill.
- Transparent over hero; gains `--color-paper` bg + bottom hairline after 120px.
- Hide on scroll-down / reveal on scroll-up. Invert to night palette over §6.6.
- `< lg`: logotype + hamburger → `<Sheet>` full-height nav (mono link list, large, staggered
  in). Focus-trapped (Radix). State in `ui-store`.

### 6.1 Hero (`hero.tsx`)
- Full viewport (`100svh`). Layout: headline occupies left 8 cols, breaks grid right edge.
- Mono eyebrow: `FREIGHT & COMMERCIAL INSURANCE`.
- `<h1>` display-xl, 3 lines, e.g. *"Coverage engineered / for the road / ahead."* — line-mask
  reveal on load (SplitText).
- One ember `body-l` sentence beneath.
- CTAs: primary `Get a Quote` (magnetic) + ghost `See how we work` (scrolls to §6.3).
- Media: full-bleed duotone (ink/paper) cinematic freight photograph, right/behind headline;
  clip-path wipe-in on load then slow parallax scale (`scale 1.08 → 1` over first viewport).
- Instrument readout (bottom, mono, tabular, `aria-hidden`): e.g. `LINES OF COVERAGE 14 ·
  AVG. RESPONSE 2H · US / MX / CA`. Purely textural.
- Scroll cue (thin ember line drawing down, loops subtly; hidden reduced-motion).
- Reduced-motion: image static, headline static, no cue.

### 6.2 Positioning statement (`positioning-statement.tsx`)
- Pinned ~120vh. One `display-l` sentence, ~12–16 words, centred to editorial measure.
- Words shift ink → ember as the pin scrubs; last word stays ember.
- Mono label `01 — POSITION` sticky in gutter.
- Reduced-motion / mobile: not pinned; renders as a normal `<Reveal>` block, ember on the
  final phrase only.

### 6.3 Capabilities (`capabilities.tsx`)
- Reframe of the reference's three value props. Content: `01 Fluency` (we speak your
  operational language), `02 Strategy` (coverage built to your risk, not a template),
  `03 The extra mile` (claims, compliance, certificates — handled).
- Desktop: section pins for ~300vh; three panels advance on scrub — big index numeral
  (display-xl, ember outline), mono label, `body-l` paragraph (≤ 60ch), a thin vertical
  image that clip-reveals per panel. Transitions: outgoing panel `y:-40 / opacity`, incoming
  `clip` + `y:40→0`.
- Progress rail (3 ticks) on the left, current tick ember.
- Mobile / reduced-motion: unpinned; three stacked blocks, each a `<Reveal>` (image wipe +
  line reveal), full width.

### 6.4 Coverage band (`coverage-band.tsx`)
- Horizontal pinned scroll. Intro slab (`display-m` "What we place") then one tall slab per
  coverage line: Auto Liability · Motor Truck Cargo · Physical Damage · General Liability ·
  Cargo · Workers' Comp · Excess / Umbrella · Non-Trucking Liability · Occupational Accident,
  then a final ember slab `View all services →` (→ `/services`).
- Slab: mono index `C-01`, `display-m` name, one-line `caption` description, hairline top
  rule; hover → name shifts ember + underline wipe + slab ground `--color-fog`.
- Scrollbar-progress hairline under the pinned area.
- Mobile / reduced-motion: vertical list, each row a `<Reveal>`, same hover/press styling,
  divided by hairlines.

### 6.5 Inline quote form (`inline-quote.tsx` + `forms/inline-quote-form.tsx`)
- Two columns (`lg`): left sticky editorial pitch (`display-m` "Start with a quote.", short
  paragraph, phone `tel:` link mono), right the form. Stacks on mobile.
- Fields (short form, per `home.md`): Name*, Email*, Phone*, Company / DOT (optional), State
  (native `<select>` styled), Coverage interest (short `<textarea>`), consent checkbox.
  Honeypot `company_website`. Optional Turnstile slot.
- Styling: **instrument panel** — no field boxes; each input is a baseline with a hairline
  bottom border that becomes ember on focus; mono `label` above; error text mono ember below;
  layout on the 8px baseline; numerals tabular.
- Behaviour: React Hook Form + Zod (`lib/validations/quote.ts`, short variant), submit →
  `FormData` → `POST /api/quote` → Sonner `toast.promise` → inline success panel replaces the
  form ("We've got it. A specialist will reach out within one business day."). Errors keep
  data + toast + `mailto:` fallback. Exactly the pipeline in `TECHNICAL.md` §5–§7.
- Motion: fields `<Reveal>` stagger on enter; submit button magnetic; success panel line-reveal.
- a11y: real `<label for>`, `aria-describedby` errors, `aria-invalid`, focus first invalid on
  submit, `<Toaster>` polite.

### 6.6 The Divine difference (`divine-difference.tsx`) — Nocturne band
- Full-bleed `--color-night`. Faint film-grain (CSS/SVG, `aria-hidden`, static).
- `display-l` statement (night-fg) + `Our Difference →` (→ `/our-difference`), amber underline
  wipe on hover.
- Cinematic headlights-at-night image, 2–3 parallax layers (depth), clip-reveal on enter.
- Mono label `04 — DIFFERENCE` sticky, amber.
- Reduced-motion: static image, no grain motion, no parallax.

### 6.7 Numbers (`numbers.tsx`)
- 3–4 figures on a hairline-separated row (no cards): e.g. `US / MX / CA` reach, `14` lines of
  coverage, `24h` response target, `$XXM` limits placed. Mono display numerals, count-up on
  scroll, `caption` beneath. All `{/* CLIENT TO CONFIRM */}`.
- Mobile: 2×2. Reduced-motion: final values shown.

### 6.8 CTA band (`cta-band.tsx`)
- Full-bleed `--color-accent`. `display-l` on paper-hi: *"Let's build your coverage."* +
  magnetic `Get a Quote` (paper button, ink text) + secondary `Talk to a specialist` (`tel:`).
- Headline line-mask reveal; subtle parallax on the band's inner content.

### 6.9 Footer (`site-footer.tsx`)
- `--color-ink` ground, paper text. Columns: logotype + one-line descriptor · nav (the 4) ·
  contact (phone, email, address — from `site-config.ts`, placeholder) · social icons.
- Legal row: © 2026 Divine Group · Privacy Policy · Terms · short insurance disclaimer
  (from `reliance_clone/README.md` global-elements note).
- Oversized `DIVINE GROUP` wordmark watermark clipped by the viewport bottom; very subtle
  parallax. Reduced-motion: static.

---

## 7. Forms, API, email
Implement exactly per `docs/TECHNICAL.md` §4 (env), §5 (client shape), §6 (route handlers +
`send-quote-email` / `send-contact-email`), §7 (1.5MB/file, ~4MB total guard — not relevant to
the short inline form, which has no uploads). `.env.example` committed; `EMAIL_FROM` defaults
to `onboarding@resend.dev`; user follows §9 to test. `/api/contact` built now even though the
Contact page is Phase 2, so the pipeline is proven on the smallest surface first.

---

## 8. SEO & metadata
- Root `metadata` + per-route `metadata`; `metadataBase` from `NEXT_PUBLIC_SITE_URL`.
- Open Graph + Twitter card; one designed `public/media/og.jpg` (1200×630, ember + wordmark).
- `app/sitemap.ts` (all real routes), `app/robots.ts` (allow all, point to sitemap).
- JSON-LD `InsuranceAgency` on Home (name, url, telephone, areaServed, sameAs) — values from
  `site-config.ts`, placeholder-flagged.
- Semantic landmarks: one `<header>`, `<main>`, `<footer>`, `<nav aria-label>`; headings in
  order; all Home sections are `<section aria-labelledby>`.
- Static rendering for all pages (no dynamic data); route handlers `runtime = "nodejs"`,
  `dynamic = "force-dynamic"`.

## 9. Accessibility
- WCAG 2.2 AA. Keyboard path through every interactive element; visible ember focus ring.
- `prefers-reduced-motion` honoured globally (§3).
- Colour never the only signal; ember pairs with weight/underline/position.
- Forms per §6.5. `<Toaster>` `aria-live="polite"`.
- Horizontal-scroll section: operable by keyboard (arrow/tab moves focus through slabs and
  scrolls them into view); not a keyboard trap; has a visible "scroll horizontally" affordance.
- Pinned sections never hide content from AT — DOM order = reading order; pins are visual only.
- Target size ≥ 24×24 (buttons ≥ 44). `lang="en"`. Skip-to-content link.

## 10. Performance targets & acceptance
- Lighthouse (mobile, throttled): Perf ≥ 90, A11y ≥ 95, Best-practices ≥ 95, SEO ≥ 95.
- LCP < 2.5s, CLS < 0.02, INP < 200ms, TBT < 200ms.
- 60fps during hero load, pinned scrub, and horizontal band on a mid-tier laptop.
- Build passes `tsc --noEmit` and `next lint` clean.
- Works with JS disabled: all content readable, nav usable, form degrades to a normal POST
  (progressive-enhancement acceptable = form still submits or shows `mailto:` fallback).
- `prefers-reduced-motion` screencap review: no motion, nothing missing.

## 11. Phase 3 research — hero scroll frame sequence (NOT this pass)
User's inspiration: highway-truck image sequence scrubbed by scroll (Apple AirPods/MacBook
style). Captured now so Phase 1's hero is built to accommodate it later.

**How these work:**
- N frames (60–130) exported from a 3D/stock drive shot, sequential `truck_0001.webp …`.
- A `<canvas>` fixed in the hero; a `{frame: 0}` object tweened `0 → N-1` on a `ScrollTrigger`
  with `scrub` + `pin` over ~1–2 viewport heights; `onUpdate` draws
  `ctx.drawImage(images[Math.round(frame)], …)` with cover-fit math.
- **Preload:** all frames `new Image()` before enabling scrub; show a lightweight progress
  state / first-frame poster until decoded. Optionally decode in chunks.
- **Asset weight:** target ≤ 1600px wide, WebP/AVIF, ~15–35KB/frame → ~2–4MB for 120 frames;
  lazy-load only when hero is near. Consider a `<video>` + `currentTime` scrub alternative
  (smaller, but seeking is less frame-accurate on some browsers) — decide after a spike.
- **Mobile / reduced-motion:** don't ship 120 frames to phones — fall back to the Phase 1
  static duotone hero image (or a short muted autoplay loop). Gate via `matchMedia`.
- **Integration point:** Phase 1 `hero.tsx` isolates the media layer behind a `<HeroMedia>`
  component so swapping the static image for `<HeroFrameSequence>` is a one-component change,
  no layout/copy churn.
- Reference patterns to study before building: GSAP ScrollTrigger image-sequence demo, Apple
  product pages, and 2–3 GSAP-Showcase sites using canvas sequences (collect during Phase 3).

## 12. Open items / client to confirm
- All body/marketing copy, headline wording, statistics, tenure, coverage-line list.
- Real company phone, email, office address(es), social URLs → `site-config.ts`.
- Cinematic photography: source (licensed stock vs commissioned) and art direction; duotone
  treatment applied in-build.
- Logo: currently a mono logotype (`DIVINE GROUP`). Replace if a real mark exists.
- Domain / brand spelling final (`divinegroup…` vs `devinegroup…`).
- Whether the multilingual dropdown (EN/ES/RU) from the reference is wanted (currently omitted).
- Accent ember `#D64222` — confirm as the brand accent or adjust hue.

## 13. Skills applied
Heavy: `scroll-experience`, `gpt-tasteskill`, `frontend-design`, `taste-skill`,
`emil-design-eng`, `animate`, `apple-design`, `better-colors`, `better-typography`,
`better-layout`, `better-ui`, `tailwind-patterns`, `tailwind-design-system`,
`nextjs-best-practices`, `nextjs-app-router-patterns`, `nextjs-seo-indexing`, `shadcn`,
`pick-ui-library`, `ask-sonner`, `zustand-store-ts`, `karpathy-guidelines`, `output-skill`,
`impeccable`, `better-accessibility`, `animation-vocabulary`.
Audit pass: `review-animations`, `find-animation-opportunities`, `improve-animations`.
Explicitly not used: `lets-scroll`, `redesign-skill`, `image-to-code-skill`, `stitch-skill`,
`brandkit`, `imagegen-frontend-web`, `imagegen-frontend-mobile`, `brutalist-skill`,
`minimalist-skill`, `soft-skill`, `taste-skill-v1`, `supabase`,
`supabase-postgres-best-practices`, `write-swift`, `animate-expo`.
