# Color Theory Studio

An offline-first, installable color science workbench: an interactive color wheel,
harmony generator, gradient builder, palette manager, contrast checker, color-blindness
simulator, and more — all running entirely client-side as a Progressive Web App.

## Tech stack

- **React 19 + TypeScript** (strict) on **Vite**
- **Tailwind CSS v4** (CSS-first `@theme` tokens) for the dark glassmorphism UI
- **Framer Motion** for spring-based micro-interactions
- **Zustand** (+ `persist`) for app state, **IndexedDB** (`idb`) for bulkier collections
- **React Router v7**, lazy-loaded routes per module
- **TanStack Query** for async data flows
- **vite-plugin-pwa** (Workbox) for the service worker, manifest and offline caching
- **Vitest + Testing Library** for unit tests

All color math (RGB/HSL/HSV/CMYK/XYZ/LAB/LCH/OKLab/OKLCH conversions, WCAG contrast,
color-blindness simulation, harmony rules, paint mixing) is implemented from first
principles in `src/utils/color/` and covered by unit tests.

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build     # type-check and build for production
npm run preview   # preview the production build
npm test          # run the unit test suite
npm run typecheck # type-check only
npm run lint      # lint with oxlint
```

## Project status

Feature-complete. Every module is implemented and wired into the app shell:
color wheel, converter, harmony generator, tints/shades/tones, gradient builder,
paint mixer, artist pigment wheel, image color extractor, contrast checker,
color-blindness simulator, palette manager, AI assistant, learning hub, settings,
global search/command palette (⌘K), onboarding, and the static about/privacy/terms
pages. The app is also a fully installable, offline-capable PWA with SEO metadata
and a production Netlify deployment config — see below.

Deliberately deferred for a later iteration: binary palette export formats
(ASE/ACO), real cloud sync/accounts, a server-backed LLM for the AI assistant
(currently a deterministic on-device heuristic behind a swappable interface),
and full multi-language i18n.

## Architecture

Feature-based structure under `src/`:

```
src/
  components/   shared UI kit (components/ui) and app shell (components/layout)
  pages/        route-level page components, lazy-loaded
  store/        Zustand stores (settings, palettes, UI, learning progress)
  services/     IndexedDB repositories, backup/restore
  utils/color/  color science engine (conversions, harmony, contrast, mixing, …)
  hooks/        shared hooks (focus trap, theme effect)
  styles/       design tokens and global styles
  types/        shared TypeScript types
```

## Installing as a PWA

Color Theory Studio is a fully installable, offline-capable Progressive Web
App. On Chrome/Edge/Android, an install prompt is offered automatically
(triggerable from **Settings → App**); on Safari/iOS use the browser's
**Share → Add to Home Screen**. Once installed, the app runs in its own
window, works fully offline (Workbox precaches the app shell and assets),
and shows an in-app banner with a one-tap reload whenever a new version is
deployed.

## Deployment

The app is a static SPA — `npm run build` outputs a fully static `dist/`
directory that can be hosted anywhere. It's configured for **Netlify** via
[`netlify.toml`](./netlify.toml):

- **Build:** `npm run build`, publishing `dist`
- **Node version:** pinned to 22 via `.nvmrc` / `NODE_VERSION` for
  consistent local, CI and Netlify builds
- **SPA fallback:** a catch-all redirect (`/* → /index.html`, 200) so deep
  links like `/wheel` resolve correctly on a fresh load, while real static
  files (icons, manifest, service worker) continue to be served directly
- **Caching:** hashed `/assets/*` and `/icons/*` are cached immutably for a
  year; `/sw.js` and `/manifest.webmanifest` are sent with `no-cache` so
  update checks never read a stale copy
- **Security headers:** `X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy` and a restrictive `Permissions-Policy` are applied to
  every response

To deploy elsewhere, replicate the same SPA-fallback rewrite and cache
headers on your host of choice — no other server-side logic is required.
