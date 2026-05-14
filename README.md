# Zeustra Astro Website

Production Astro site using a TypeScript-first architecture with React islands for interactive sections.

## Tech Stack

- Astro 6
- React 19 (islands only)
- TypeScript 5.9 (latest compatible with current Astro check toolchain)
- Tailwind CSS 4
- ESLint 10

## Architecture

Current model (implemented):

- `src/pages/` contains Astro route entrypoints and page composition.
- `src/layouts/` contains shared Astro layout primitives.
- `src/components/layout/` contains shared chrome components used across routes.
- `src/components/islands/` contains thin React islands for interactive regions only.
- `src/features/<route>/sections/` contains route-scoped sections (Astro and React).
- `src/features/<route>/data/` contains route-local typed data/constants.
- `src/components/shared/` and `src/components/effects/` contain shared cross-route primitives.
- `src/lib/strapi/` contains the future headless CMS integration layer (typed client and response contracts).
- `src/constants/`, `src/contexts/`, `src/hooks/`, `src/utils/`, `src/seo/`, and `src/styles/` contain framework-agnostic runtime utilities and configuration.

Project structure:

```text
src/
  pages/                # Astro routes
  layouts/              # Astro layouts
  components/
    layout/             # Shared chrome components
    islands/            # Interactive React islands
    shared/             # Shared Astro/React components
    effects/            # Visual effect components
  lib/
    strapi/             # Headless CMS integration layer
  features/
    home/
      sections/
      data/
    about/
      sections/
      data/
    services/
      sections/
      data/
    products/
      sections/
      data/
    marketplace/
      sections/
      data/             # Route-scoped sections and data
  constants/
  contexts/
  hooks/
  seo/
  styles/
  types/
  utils/
```

Path aliases:

- `@/*` -> `src/*`

## Commands

All commands run from project root.

| Command           | Purpose                       |
| ----------------- | ----------------------------- |
| `npm install`     | Install dependencies          |
| `npm run dev`     | Start development server      |
| `npm run lint`    | Run ESLint                    |
| `npm run check`   | Run Astro type checks         |
| `npm run build`   | Build production output       |
| `npm run preview` | Preview production build      |
| `npm run verify`  | Run lint + type-check + build |

## Routing Model

Routes are defined by Astro files in `src/pages/`.
Pages render static sections with Astro components and hydrate only interactive islands.

## Notes

- The codebase is TypeScript-first for source and core configs.
- Legacy `src/app/` migration scaffolding has been removed.
- `postcss.config.cjs` remains in CommonJS format for toolchain compatibility.

## Strapi Readiness

- Strapi environment keys are scaffolded in `.env.example`.
- Strongly typed CMS contracts and a reusable Strapi client live in `src/lib/strapi/`.
- Recommended migration path: replace route-local `src/features/*/data/` progressively with Strapi fetchers while keeping `sections/` ownership stable.
