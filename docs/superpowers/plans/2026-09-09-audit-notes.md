# Phase 1 audit notes — 2026-09-09

Findings and fixes from Task 15 of the implementation plan.

## Reduced motion (`prefers-reduced-motion: reduce`)

**Bug found & fixed:** `coverage-band.tsx` used `gsap.utils.toArray("> *", el)` — `"> *"` is not a
valid `querySelectorAll` selector and threw a runtime `SyntaxError`, which crashed the
component effect and collapsed page height in the reduced-motion / mobile branch. Replaced
with `Array.from(el.children)`.

**Structural bug found & fixed:** the pinned sections (`Capabilities`, `CoverageBand`) kept
their `lg:h-screen` + `overflow-hidden` layout classes even when the pin/translate animation
was disabled (reduced motion, or `<lg` handled by JS). Result on a wide screen with reduced
motion: panels 2–3 and coverage slabs 2+ were clipped and unreachable.
Fix: gated every pin-related layout class behind Tailwind's `motion-safe:` variant
(`motion-safe:lg:h-screen`, `motion-safe:lg:flex-row`, `motion-safe:overflow-hidden`, …) in
`capabilities.tsx`, `coverage-band.tsx`, `coverage-slab.tsx`. Added an explicit
`prefers-reduced-motion: reduce` early-return inside the JS "flow" branches so no `gsap.from`
reveal runs — content is served static and visible.

**Verified:** full-page render at 1440×900 with reduced motion emulated — page height 9090px
(was 900px pre-fix), no horizontal overflow, every section present and readable, no motion,
Lenis disabled, 0 console errors.

## Mobile (390 × 844)

- `document.documentElement.scrollWidth` ≤ viewport — **no horizontal page scroll.**
- Elements flagged as internally wider than the viewport are all `overflow-hidden` full-bleed
  containers (hero media, Nocturne blooms, footer wordmark watermark) — contained, not
  page-scrolling. Acceptable.
- Capabilities → vertical stack of 3 panels (numeral, label, body, image) — clean.
- Coverage band → vertical list of slabs with hairline dividers — clean.
- Quote form → single column.
- Pins and horizontal scroll correctly disabled below `lg`.

## Accessibility structure

- Exactly **one `<h1>`** ("Freight coverage, engineered for the long haul.").
- Heading order valid: H1 → H2 → H3 (coverage slabs) → H2… — no skipped levels.
- Landmarks: 1 `<header>`, 1 `<main id="content">`, 1 `<footer>`, `nav[aria-label="Primary"]`
  + `nav[aria-label="Footer"]`.
- Skip-to-content link present (`a[href="#content"]`, visible on focus).
- **0 `<img>` without an `alt` attribute** — every decorative image uses `alt=""`.
- Focus ring: 2px ember, `:focus-visible`, applied globally in `globals.css`.
- Form: real `<label for>`, `aria-invalid`, `aria-describedby` on errors, RHF focuses the
  first invalid field on submit (verified — empty submit surfaced 5 inline errors).
- Coverage horizontal band: `tabIndex={0}` + `aria-label`, ArrowLeft/Right scroll handler,
  not a keyboard trap.

## Animation review (arrival / emphasis / transition / continuity)

Every animation maps to a purpose:

| Section | Animation | Purpose |
|---|---|---|
| Hero | clip-wipe media in, parallax scale, SplitText line rise | arrival + spatial continuity |
| Positioning | pinned word ink→ember on scrub | emphasis |
| Capabilities | pinned 3-panel track translate + progress rail | transition + continuity |
| Coverage band | pinned horizontal translate + progress hairline | transition |
| Quote form | staggered field reveal, magnetic submit | arrival + affordance |
| Nocturne | light-bloom depth parallax, grain, header inversion | spatial depth + continuity |
| Numbers | count-up on enter | emphasis |
| CTA | SplitText headline rise, subtle content parallax | arrival |

No decorative loops, floating shapes, or entrance animation on every element. The hero scroll
cue is a small persistent affordance (hidden under reduced motion).

## Known cosmetic follow-ups (not blockers)

- **Capabilities panels carry generous vertical whitespace** on the pinned desktop view and
  when stacked on mobile (short copy in tall `h-screen` panels). Reads as intentional
  editorial spacing; tighten `py`/vertical centering in a polish pass if the client wants it
  denser.
- Footer wordmark watermark ("Divine Group") runs off the right edge rather than being
  visually centered under the columns — clipped by `overflow-hidden`, so it's an effect, not
  a bug, but could be balanced.
- OG image uses a Georgia stand-in for the Clash Display wordmark (sharp/librsvg has no
  access to the self-hosted font). Replace with a proper render before launch if it matters.

## Gate status

`npm run typecheck` ✓ · `npm run lint` ✓ · `npm run test` (18 tests) ✓ · `npm run build`
(13 routes) ✓ · 0 browser console errors on the production build.

---

# Phase 2 + 3 audit — 2026-09-09

## Reduced motion (all new pages, 1440×900, emulated)

| Page | height | h-scroll | h1 | hidden text |
|---|---|---|---|---|
| /our-difference | 3661px | none | 1 | 0 |
| /services | 3544px | none | 1 | 0 |
| /services/trucking-insurance | 4093px | none | 1 | 0 |
| /get-a-quote | 3362px | none | 1 | 0 |
| /contact-us | 2651px | none | 1 | 0 |
| /privacy-policy | 2204px | none | 1 | 0 |
| /terms | 2149px | none | 1 | 0 |

All pages render full, static, one `<h1>` each, nothing stuck invisible.

**Note:** a `fullPage` screenshot with motion *on* shows below-fold `Reveal`/`SplitLines`
content as blank — that is a screenshot artifact (Playwright doesn't fire scroll triggers for
a full-page capture). Verified by wheel-scrolling: every section reveals correctly, and the
reduced-motion `hiddenText=0` check proves nothing is genuinely hidden.

## Forms not gated behind scroll animation

Removed the `<Reveal>` wrapper from `QuoteForm`, `ContactForm` and the Home `InlineQuoteForm`
so a form can never be left invisible if a ScrollTrigger fails to fire. Forms now render
immediately; only decorative sections use `Reveal`.

## Mobile (390 × 844, motion on)

All five content pages: `scrollWidth` 375 ≤ viewport, zero elements breaking out of the
viewport, forms single-column, no pins.

## Full quote form (`/get-a-quote`)

- DOT field blocks non-digits on type/paste/drop (`onBeforeInput`), backed by the Zod regex.
- VIN repeater: 5 rows default, "Add another vehicle" / "Remove", `> 5` shows the Excel-list
  callout. Fixed a stale-closure bug — increment/decrement now use the updater form.
- 7 upload rows enforce 1.5 MB/file + type allowlist client-side; the route re-checks size,
  MIME, and a ~4 MB combined guard, returning 400/413. Covered by 5 new route tests.
- Verified: empty submit surfaces 8 inline errors; valid submit reaches `/api/quote?mode=full`
  (500 on the dummy Resend key = wiring proven).

## Links / SEO

Every nav, footer and inter-page link resolves (200). `/sitemap.xml` lists all 8 real routes;
`/robots.txt` serves. `not-found` still branded.

## Phase 3 (hero frame sequence)

`HERO_FRAME_COUNT = 0` → `heroFramesEnabled` false → `HeroMedia` renders the Phase 1 static
image path unchanged (verified: hero screenshot identical, 0 console errors). Setting the
count ≥ 2 mounts `HeroFrameSequence` on desktop-with-motion only. Frame export + switch
instructions in `public/media/hero-frames/README.md`.

## Gate status

`npm run typecheck` ✓ · `npm run lint` ✓ · `npm run test` (28 tests) ✓ · `npm run build`
(13 routes) ✓.

## Known cosmetic follow-ups (carried forward)

- Generous vertical whitespace on interior pages (SplitFeature gaps, section paddings) and
  capabilities panels. Reads as editorial but could be denser — tighten in a polish pass.
- Placeholder office address renders as `—` on /contact-us until real data is supplied.
- OG image wordmark uses a Georgia stand-in for Clash Display.

---

# Assets + Phase 3 activation — 2026-09-09

Client supplied 8 generated stills + one 4s video. Processed with `sharp` / `ffmpeg`;
originals moved to `_source-media/` (gitignored) so they don't ship in the bundle.

| File | Source | Treatment |
|---|---|---|
| `hero.jpg` | Semi truck on highway (2752×1536) | 2400w JPEG q64 — poster + non-desktop hero |
| `night.jpg` | Highway at night, windshield POV | 2200w — new base layer in the Nocturne band under the amber blooms |
| `cap-01/02/03.jpg` | dispatch office / desk+map / parked truck at night | 900×1125 `cover` (attention crop) q66 |
| `feature-01/02.jpg` | service bay / two people reviewing paperwork | 1600×1200 q66 |
| `og.jpg` | dry-van truck on wet asphalt | cropped 1200×630, ink gradient + composited "Divine Group" (Georgia) wordmark |
| `hero-frames/frame_0001…0096.webp` | the 4s / 24fps / 1080p clip | `ffmpeg` every frame → 1600w WebP q72, ~25 KB each, 2.4 MB total |

**Phase 3 turned on.** `HERO_FRAME_COUNT = 96`. `HeroFrameSequence` now renders on desktop
with motion allowed.

- **Pin removed.** The first attempt pinned the hero section for ~1.8 viewports; it fought
  the `PositioningStatement` pin right after it and the two sections overlapped. Switched to
  a **no-pin scrub** (`start: "top top"`, `end: "bottom top"`) — frames 0→95 map to the
  hero's natural scroll-out. Verified: no overlap, positioning statement follows cleanly,
  0 console errors.
- Mobile / reduced-motion still get the static poster (component not mounted).
- Next's image optimiser caches by URL — had to `rm -rf .next` once after replacing the
  jpgs in place, since the filenames were unchanged.

## Capabilities — stacked-card rework (2026-09-10)

The vertical-scrolling track was replaced with a **layered stacked-card scroll**.

- **Desktop, motion allowed** (`min-width:1024px` + `no-preference`): all three `.cap-panel`s
  are `position:absolute; inset:0` inside the pinned stage (panel 1 highest z-index → panel 3
  lowest), transparent so `bg-paper` shows through. One scrubbed timeline (`scrub: 0.5`),
  pinned for `innerHeight * (panels - 1)`. Each panel except the last: holds readable for the
  first ~66% of its segment, then `yPercent 0→-100`, `autoAlpha 1→0`, `scale 1→0.96` (exit
  starts at segment `+0.66`, 0.34 long). Incoming panel settles `scale 0.94→1` over
  `[i-0.3, i]` so it lands exactly as the one above clears. Last panel stays; pin releases.
  Counter-parallax on `.cap-image img` (`yPercent -6→6`, `scale 1.06→1`) kept, now a single
  timeline tween across the whole pin. ProgressRail active = `Math.round(progress * steps)`.
- **Positioning is all behind `motion-safe:lg:`** (`absolute inset-0 h-screen`) + the
  `desktop` matchMedia branch — static layout (mobile, reduced-motion, no-JS) is untouched:
  panels stay `position:static` in normal document flow, full-height, fully visible, DOM
  order = reading/focus order.
- **Mobile + motion**: unchanged per-panel enter reveal (`autoAlpha 0→1`, `y 28→0`, image
  `clipPath` wipe). **Reduced-motion**: early return, everything static.
- `capability-panel.tsx` untouched (its root was already transparent — no `bg-*`).
- Cleanup: `tl.scrollTrigger?.kill(); tl.kill()` in the branch, `mm.revert()` outer.
- **Show-through fix.** First cut left all three transparent panels at `autoAlpha: 1` per
  the literal spec — Playwright screenshots showed the waiting panels' copy bleeding
  through the active one ("01/02/03" → mush, three paragraphs superimposed). Waiting panels
  now start `autoAlpha: 0` and the settle-in tween also runs `autoAlpha 0→1`, so the
  handoff is a cross-dissolve timed to the outgoing panel clearing. `bg-paper` still shows
  through (only one panel visible at a time). All other spec'd motion unchanged.
- Verified: typecheck / lint / test (28) / build (13 routes) all green. Playwright
  (`chromium-1217` via the cached `@playwright/mcp` install, driven by `window.__lenis`),
  8-step scrub sweep of the pinned range at 1440×900:
  - progress 0–0.33: panel 01 alone, crisp; 02/03 `opacity 0`, `scale 0.94`, `z` 2/1.
  - progress ~0.375: 01 exiting (`opacity .29`, `ty -637`), 02 fading in (`opacity .51`).
  - progress 0.5: 01 gone (`opacity 0`, `ty -900`), 02 settled (`scale 1`), 03 still hidden.
  - progress 1: 03 alone, `scale 1`; pin releases. Rail index tracks `round(progress·2)`.
  - `reducedMotion: reduce`: stage `position: relative`, `overflow: visible`, no pin; all
    three panels `position: static`, `opacity 1`, full height, DOM order 01→02→03.
  - mobile 390px: panels `position: static`; per-panel enter reveal path intact.
  - 0 console / page errors in all three modes.

## Gate status

`npm run typecheck` ✓ · `npm run lint` ✓ · `npm run test` (28) ✓ · `npm run build` (13 routes) ✓.

## Still outstanding

- `/contact-us` office address is still `—` — needs the real address in `lib/site-config.ts`.
- Everything marked `CLIENT TO CONFIRM` (all body copy, phone, email, domain, stats).
