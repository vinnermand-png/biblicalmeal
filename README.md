# BiblicalMeal

Premium international website about the foods, ingredients, recipes, history, and culinary traditions of the biblical world.

**Production URL:** https://biblicalmeal.com

## Tech Stack

| Concern       | Technology                                                  |
| ------------- | ----------------------------------------------------------- |
| Framework     | [Astro](https://astro.build) (static-first, content-driven) |
| UI islands    | React 19                                                    |
| Styling       | Tailwind CSS v4                                             |
| Language      | TypeScript (strict)                                         |
| Content       | Astro Content Collections (Markdown/MDX + Zod schemas)      |
| Site search   | Pagefind                                                    |
| Testing       | Vitest                                                      |
| Lint / format | ESLint 9 + Prettier                                         |
| Git hooks     | Husky + lint-staged                                         |
| CI            | GitHub Actions                                              |

## Project Structure

```
├── .github/workflows/    # CI pipeline
├── public/               # static files served as-is
├── src/
│   ├── assets/           # processed images
│   ├── components/
│   │   ├── common/       # shared presentational components (.astro)
│   │   └── islands/      # interactive React islands
│   ├── content/
│   │   ├── recipes/      # recipe entries (MDX)
│   │   ├── ingredients/  # ingredient encyclopedia entries
│   │   ├── articles/     # editorial / history articles
│   │   └── config.ts     # collection schemas (planned)
│   ├── i18n/             # translation strings & locale helpers
│   ├── layouts/          # BaseLayout.astro and page layouts
│   ├── lib/              # pure helper functions
│   ├── pages/            # file-based routes
│   └── styles/           # global.css (Tailwind v4 entrypoint)
├── astro.config.mjs      # framework config (site URL, i18n, integrations)
└── src/config.ts         # site metadata & navigation source of truth
```

## Getting Started

Requirements: Node.js >= 22.12, npm >= 10.

```bash
npm install        # one-time setup
npm run dev        # dev server at http://localhost:4321
```

### Available Scripts

| Command                | Description                                  |
| ---------------------- | -------------------------------------------- |
| `npm run dev`          | Start dev server with hot reload             |
| `npm run build`        | Production build to `dist/` + Pagefind index |
| `npm run preview`      | Serve the production build locally           |
| `npm run lint`         | ESLint check                                 |
| `npm run lint:fix`     | ESLint autofix                               |
| `npm run format`       | Prettier write                               |
| `npm run format:check` | Prettier check (CI mode)                     |
| `npm run typecheck`    | `astro check` type checking                  |
| `npm test`             | Vitest                                       |

Pre-commit hook runs Prettier + ESLint on staged files automatically.

## Conventions

- Conventional Commits (`feat:`, `fix:`, `chore:`, …).
- Branches: `feature/<name>`, `fix/<name>`.
- All content lives in `src/content/**` behind validated schemas.
- Site metadata and navigation are defined once in `src/config.ts`.
