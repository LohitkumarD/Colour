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

This app is being built incrementally. The foundation is in place — design tokens,
the full color science engine, state/persistence layer, shared UI kit, and the app
shell with routing, navigation, command palette (⌘K), and theme switching all work
end-to-end. Individual feature modules (color wheel, converter, harmony generator,
gradients, mixer, image extractor, contrast checker, color-blindness simulator,
palette manager, AI assistant, learning hub, settings) are being implemented module
by module; pages not yet built show a placeholder so navigation and layout can be
verified ahead of each module landing.

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
