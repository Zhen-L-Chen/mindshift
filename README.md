# MINDSHIFT — 5@8 networking

Invitation landing page for **MINDSHIFT** — a 5@8 networking evening by
**paperminds × Draft & Goal**. September 16, 2026, Bar Le Mal Nécessaire,
Montréal. Reservations run through the embedded **Luma** checkout.

Two screens, one shift: the conference-blue day (flipped SHIFT lockup, retro
boot-up) scrolls into a warm cocktail-bar night. On the dark page the giant
MINDSHIFT letterforms become film — event photography cutting inside the
letters to an editor's rhythm while the copy types itself — and the reversed
SHIFT rights itself through a boot-style flicker (nothing ever visibly
rotates). The bottom lockup closes its word-space and converts once, on entry.

## Stack

- **Next.js 15** (App Router, TypeScript, `output: "export"`) + **React 19**
- **GSAP + ScrollTrigger** and **Lenis** — scroll choreography, flicker relays,
  the cinema cutting engine (`components/Page2.tsx`)
- Designer's official SVG assets (wordmark letterforms, logos, circle series,
  pixel cursors) in `public/assets`; **Fira Code** via `next/font/local`
- **Luma** checkout embed for reservations (`data-luma-*` attributes,
  `lib/i18n.tsx` holds the event id)

## Run

```bash
npm install
npm run dev
```

→ http://localhost:3000

## Build

```bash
npm run build
```

Static export lands in `out/` — serve it from any static host.

## Entry points & copy

- `/` lands in **English**; `/en/` and `/fr/` are language-forced slugs for
  targeted links (each prerendered, each with its own share card).
- All copy lives in `lib/i18n.tsx`; social-share metadata in `lib/share.ts`
  (`public/og.jpg` is the card image).

## Deploy

- **Any static host**: upload `out/`.
- **Vercel**: zero-config (the repo auto-deploys as a static export).
- **GitHub Pages**: the included workflow (`.github/workflows/deploy.yml`)
  builds with `NEXT_PUBLIC_BASE_PATH=/mindshift` for subpath hosting.
- Set `NEXT_PUBLIC_SITE_URL=https://your-domain` at build time to pin the
  absolute URLs in the share cards.

## Notes

- `prefers-reduced-motion` gets the static flipped lockup on blue and a hard
  page-turn to the dark screen — no scroll choreography.
- The designer's raw delivery folder (`_REMISE_…`) and the raw photo archive
  are git-ignored; everything the site uses ships from `public/`.
