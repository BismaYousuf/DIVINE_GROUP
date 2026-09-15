# SEO Audit — Divine Group (thedivinegroup.net)

Two-pass technical SEO audit performed on the Next.js App Router site. This
document records what was found, what was fixed in code, and what remains
open pending real business content/decisions.

## Pass 1 — On-page basics

### Fixed

| Issue | Fix |
|---|---|
| `siteConfig.url` was a placeholder (`https://divinegroup.example`), corrupting canonical URLs, Open Graph URLs, the sitemap, and robots.txt sitewide | `lib/site-config.ts` — derives from `NEXT_PUBLIC_SITE_URL` with a hardcoded fallback to `https://thedivinegroup.net` |
| Content-bearing images (capability panels, split-feature photos) had empty `alt=""` | Added descriptive alt text in `components/home/capability-panel.tsx` and `components/page/split-feature.tsx`. Logo icon and full-bleed hero/section background images intentionally kept `alt=""` — they sit beside visible text or are purely decorative, which is the correct a11y pattern |
| Only the Home page had structured data (`InsuranceAgency`); no breadcrumb data anywhere | Added `components/seo/breadcrumb-json-ld.tsx`, wired into every non-home page (Our Difference, Services, Trucking Insurance, Contact, Get a Quote, Privacy Policy, Terms) |
| Every page inherited the root's generic Open Graph title/description, so shared links (LinkedIn, iMessage, etc.) showed the homepage's copy regardless of which page was shared | Added page-specific `openGraph`/`twitter` metadata to the 5 main marketing pages |
| Missing `viewport` export (Next.js 15 requires this separate from `metadata`) | Added `export const viewport` to `app/layout.tsx` with `theme-color` |
| `next.config.ts` had no image format config | Added `images.formats: ["image/avif", "image/webp"]` |

### Confirmed already correct (no action needed)

- Every route has its own unique `title`/`description` + `alternates.canonical` — no duplicate-title problem.
- `app/robots.ts` and `app/sitemap.ts` exist and are wired correctly (dynamic route handlers, not static files).
- Each page has exactly one `<h1>`.
- `InsuranceAgency` is a valid schema.org type — no typo.
- Fonts are self-hosted via `next/font` with `display: "swap"` — no render-blocking Google Fonts `<link>` tags.
- No third-party scripts anywhere (also means: **no analytics installed** — not an SEO defect, but worth knowing).
- `<html lang="en">` is set.
- No accidental `noindex` anywhere in the app.

## Pass 2 — Performance & content depth

### Fixed

| Issue | Fix |
|---|---|
| The "Divine Difference" section's background video reel (3 clips, ~5MB each) loaded eagerly on page mount — 4 sections below the fold, competing with the hero for initial bandwidth | Gated behind an `IntersectionObserver` (600px `rootMargin`) in `components/home/divine-difference.tsx`. Verified: zero video requests on initial load; fetch only starts once the section approaches the viewport |
| Hero's 98-frame scroll-scrub sequence (`components/home/hero-frame-sequence.tsx`) fired all 98 image requests at once with no priority hint, competing with the actual LCP element (the poster image) | Set `fetchPriority = "low"` on each frame image |

### Flagged — needs real business input, not a code fix

1. **Thin content.** Home, Services, and Trucking Insurance pages each carry only ~200–400 words of real sentence-level copy; the site leans heavily on short headlines/labels. For a money page like Trucking Insurance competing on commercial-insurance search terms, ranking competitors typically run 800–1500+ words (coverage specifics, FAQs, state-specific info). Most existing body copy is still marked `// CLIENT TO CONFIRM` in source.
2. **5 of 6 "service categories"** on `/services` (Freight Broker, Borderless, Commercial, Risk Management, Usage-Based) are same-page anchor links back to their own one-paragraph blurb — not real dedicated pages. Only `/services/trucking-insurance` has its own URL. These 5 have no independent topical depth for search engines to rank.
3. **Business address/hours are still placeholder** (`lib/site-config.ts` → `address`, all `"—"`). This blocks adding `address`/`geo`/`openingHours` to the `InsuranceAgency` structured data, which matters for local search and Google Business alignment. Structured data code is already written to include these once real values exist — currently correctly omitted rather than emitting fake data.
4. **Privacy Policy / Terms body copy** is placeholder (`"CLIENT TO CONFIRM"`) and live on the site — a trust/quality-signal risk, not something to fabricate without real legal input.

## Summary

Everything structurally fixable in code — canonical URLs, metadata, structured data, alt text, breadcrumbs, viewport, image formats, and the two real performance bottlenecks (eager video + unprioritized hero frames) — is done and verified. What's left (items 1–4 above) all requires real content or business data from Divine Group before it can be addressed; none of it should be guessed or fabricated.
