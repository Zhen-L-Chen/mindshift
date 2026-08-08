# MINDSHIFT — 5@8 networking

Invitation landing page for **MINDSHIFT** — a 5@8 networking evening by
**paperminds × Draft & Goal**. September 16, Bar Le Mal Nécessaire, Montréal.
Réservation obligatoire · places limitées · invitation valide pour 4 personnes.

Two screens, one shift: the conference-blue day (flipped SHIFT lockup) scrolls
into a warm cocktail-bar night — the background sunsets through dusk, a slow
amber equalizer swell crosses the dark page, and the bottom MINDSHIFT converges
and locks upright exactly at the end of the scroll.

## Stack

- **Next.js 15** (App Router, TypeScript, static export) + **React 19**
- **Three.js** via @react-three/fiber — the particle field (drift → grid)
- **GSAP + ScrollTrigger** + **Lenis** — scroll choreography
- Designer's official SVG assets (wordmark letters, logos, circle series,
  pixel cursors) from the remise; Fira Code via `next/font/local`
- **Luma** checkout embed for reservations (`data-luma-*` attributes)

## Run

```bash
npm install
npm run dev
```

→ http://localhost:3000

## Deploy

Pushed to `main` → GitHub Actions builds a static export
(`NEXT_PUBLIC_BASE_PATH=/mindshift`) and deploys to GitHub Pages.

## Notes

- FR/EN toggle top right; copy lives in `lib/i18n.tsx`.
- The designer's raw delivery folder (`_REMISE_…`) is git-ignored — only the
  assets the site uses ship from `public/`.
- `prefers-reduced-motion` gets the static brand lockup on blue and a hard
  page-turn to the dark screen.
