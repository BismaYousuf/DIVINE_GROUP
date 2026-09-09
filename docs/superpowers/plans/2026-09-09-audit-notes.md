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
