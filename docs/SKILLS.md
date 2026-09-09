# Installed project skills

50 skills were downloaded from public GitHub repos into **`.claude/skills/`** at the repo
root (i.e. `../.claude/skills/` relative to this `docs/` folder; project-local,
~3.7 MB). They load automatically in Claude Code sessions run from this repo. Grouped by the
categories from the request:

## 🚀 Scroll & cinematic

| Skill | From | What it does |
|-------|------|--------------|
| `lets-scroll` | AIwithhassan/lets-scroll | 3D/cinematic scroll camera flights, isometric landings, frame-accurate scroll-video scrubbing |
| `scroll-experience` | sickn33/antigravity-awesome-skills | GSAP ScrollTrigger + Framer Motion scroll narratives, parallax, pinned sections, 60fps, `prefers-reduced-motion` |

## 🌟 Design taste, styling & visual architecture

| Skill | From | What it does |
|-------|------|--------------|
| `taste-skill`, `taste-skill-v1` | Leonxlnx/taste-skill | High-craft UI/UX standards, spatial hierarchy, anti-AI-slop, typography/contrast discipline |
| `gpt-tasteskill` | Leonxlnx/taste-skill | Prompt-engineering + taste calibration for generated UI |
| `minimalist-skill` | Leonxlnx/taste-skill | Decluttered, high-focus, typography-driven layouts |
| `soft-skill` | Leonxlnx/taste-skill | Premium SaaS aesthetic — depth, borders, glass navbars, dark surfaces |
| `brutalist-skill` | Leonxlnx/taste-skill | Brutalist layout system |
| `brandkit` | Leonxlnx/taste-skill | Brand token alignment, colour theme enforcement |
| `output-skill` | Leonxlnx/taste-skill | Enforce complete, production-ready output (no `// TODO` truncation) |
| `frontend-design` | anthropics/skills | High-quality frontend architecture & component structure |
| `impeccable` | pbakaus/impeccable | Craft precision, design-token polish, consistent spacing, anti-sloppiness |
| `apple-design` | emilkowalski/skills | Apple HIG principles, sleek transitions, tactile feedback |
| `emil-design-eng` | emilkowalski/skills | Bridges Figma design tokens → Next.js/React implementation |
| `better-colors` | jakubkrehel/skills | Palette generation, WCAG contrast tokens, semantic status badges |
| `better-typography` | jakubkrehel/skills | Type scale, rhythm, pairing |
| `better-layout` | jakubkrehel/skills | Layout structure & spacing |
| `better-interface`, `better-ui` | jakubkrehel/skills | Interface composition & component quality |
| `better-accessibility` | jakubkrehel/skills | a11y patterns |
| `better-writing` | jakubkrehel/skills | UX copy |
| `explain-interface`, `interface-review`, `variant`, `break` | jakubkrehel/skills | Review / critique / variant-generation helpers |
| `redesign-skill` | Leonxlnx/taste-skill | Refactor rough UI screens into modern components |
| `image-to-code-skill` | Leonxlnx/taste-skill | Screenshot / mockup → React + Tailwind |
| `stitch-skill` | Leonxlnx/taste-skill | Compose multi-section pages |
| `imagegen-frontend-web`, `imagegen-frontend-mobile` | Leonxlnx/taste-skill | Generate web assets/icons at web + mobile ratios |

## ⚡ Animations & micro-interactions (Emil Kowalski suite)

| Skill | What it does |
|-------|--------------|
| `animate` | Physics-based UI animation, easing, layout transitions, spring dynamics |
| `improve-animations` | Optimise existing animations, kill jank, hardware-accelerate |
| `find-animation-opportunities` | Audit screens for where motion adds value |
| `review-animations` | Inspect transitions for duration, pacing, conflicts |
| `animation-vocabulary` | Standard motion terminology (orchestration, stagger, enter/exit) |
| `animate-expo` | Mobile / React Native motion patterns |

## 🧩 Components, toasts & prototyping

| Skill | What it does |
|-------|--------------|
| `ask-sonner` | Sonner toasts — action toasts, promise banners, custom patterns |
| `pick-ui-library` | Composing Radix primitives + shadcn/ui, choosing libraries |
| `prototype` | Rapid interactive sandbox / flow mockups |
| `shadcn` | shadcn/ui component scaffolding |

## ⚙️ Backend, engineering foundations

| Skill | From | What it does |
|-------|------|--------------|
| `supabase` | supabase/agent-skills | Auth, storage, DB client, realtime (**not used in v1** — kept for future) |
| `supabase-postgres-best-practices` | supabase/agent-skills | Postgres indexing, RLS, pooling, migrations |
| `karpathy-guidelines` | multica-ai/andrej-karpathy-skills | Minimal accidental complexity, readability, clean engineering |
| `write-swift` | emilkowalski/skills | Swift / iOS native patterns (future mobile) |

## 🛠️ Stack skills (Next.js / Tailwind / Zustand)

| Skill | What it does |
|-------|--------------|
| `nextjs-best-practices` | Next.js App Router, Server/Client components, SSR, API routes |
| `nextjs-app-router-patterns` | Deeper App Router routing / layout / data patterns |
| `nextjs-seo-indexing` | SEO + indexing for Next.js (useful for this marketing site) |
| `tailwind-patterns` | Tailwind utility compositions |
| `tailwind-design-system` | Tailwind design-token architecture |
| `zustand-store-ts` | Type-safe Zustand stores + middleware |

---

## Notes

- **Source repos** (shallow-cloned, then only the needed skill folders copied; `.git` and
  `node_modules` stripped):
  `sickn33/antigravity-awesome-skills`, `AIwithhassan/lets-scroll`, `Leonxlnx/taste-skill`,
  `pbakaus/impeccable`, `jakubkrehel/skills`, `emilkowalski/skills`, `supabase/agent-skills`,
  `multica-ai/andrej-karpathy-skills`, `anthropics/skills`.
  `sickn33/antigravity-awesome-skills` is a huge aggregator catalog — **only 6 named skills
  were taken from it**, not the whole thing.
- **`anthropics/claude-code`** in the request is the CLI repo, not a skills repo — the
  "high-quality frontend architecture" skill it refers to is `frontend-design` from
  `anthropics/skills`, which is what was installed.
- **Name overlap with global skills:** `frontend-design` and `impeccable` also exist as
  global skills on this machine. The project-local copies here are independent and take
  precedence for work in this repo.
- **Trust / supply chain:** these are third-party skills — their `SKILL.md` files contain
  instructions that get loaded into the model's context. They were copied verbatim and only
  spot-checked for valid frontmatter, not audited line by line. Review any skill before
  relying on it for something sensitive, and pin/commit this folder so the set is
  reproducible.
- **To update a skill:** re-clone its source repo and re-copy its folder. There's no
  package manager wiring these — they're plain files.
- **To drop a skill:** delete its folder under `.claude/skills/` at the repo root.
