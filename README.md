# BiblicalMeal

Premium international website about the foods, ingredients, recipes, history, and culinary traditions of the biblical world.

**Production URL:** https://biblicalmeal.com

## Tech Stack

| Concern       | Technology                                             |
| ------------- | ------------------------------------------------------ |
| Framework     | Astro (static-first, content-driven)                   |
| UI islands    | React 19                                               |
| Styling       | Tailwind CSS v4                                        |
| Language      | TypeScript (strict)                                    |
| Content       | Astro Content Collections (Markdown/MDX + Zod schemas) |
| Site search   | Pagefind                                               |
| Testing       | Vitest                                                 |
| Lint / format | ESLint 9 + Prettier                                    |
| CI            | GitHub Actions                                         |

## Project Structure

```text
├── .github/workflows/    # CI pipeline
├── public/               # static files served as-is
│   └── assets/editorial/ # generated editorial image output
├── scripts/              # explicit development-time maintenance scripts
├── src/
│   ├── assets/           # processed images
│   ├── components/
│   │   ├── common/       # shared presentational components (.astro)
│   │   └── islands/      # interactive React islands
│   ├── content/          # validated publication content
│   ├── data/             # data manifests, including editorial-images.json
│   ├── layouts/          # BaseLayout.astro and page layouts
│   ├── lib/              # pure helper functions
│   ├── pages/            # file-based routes
│   └── styles/           # global.css (Tailwind v4 entrypoint)
├── astro.config.mjs
└── src/config.ts         # site metadata & navigation source of truth
```

## Getting Started

Requirements: Node.js >= 22.12, npm >= 10.

```bash
npm install
npm run dev
```

## V3D.4 Editorial Image Generation

Editorial images are generated manually during local development. The public website never calls the OpenAI API and does not require `OPENAI_API_KEY` to build or render generated assets.

1. Create a local `.env.local` file from `.env.example`.
2. Add a real `OPENAI_API_KEY` only to `.env.local`.
3. Run the small pilot first:

```bash
npm run images:generate -- --pilot
```

Generate one asset by deterministic manifest id:

```bash
npm run images:generate -- --id journal-ancient-table
```

Generate the complete curated manifest without overwriting existing output:

```bash
npm run images:generate -- --all
```

Regeneration is explicit:

```bash
npm run images:generate -- --all --force
```

The script reads `src/data/editorial-images.json`, applies the canonical BiblicalMeal master art direction plus each asset's subject direction, calls the OpenAI Images API, and writes deterministic WebP files under `public/assets/editorial/`. Existing files are skipped unless `--force` is passed. `.env*` files are ignored except the keyless `.env.example`.

## Available Scripts

| Command                              | Description                                  |
| ------------------------------------ | -------------------------------------------- |
| `npm run dev`                        | Start dev server with hot reload             |
| `npm run build`                      | Production build to `dist/` + Pagefind index |
| `npm run preview`                    | Serve the production build locally           |
| `npm run lint`                       | ESLint check                                 |
| `npm run lint:fix`                   | ESLint autofix                               |
| `npm run format`                     | Prettier write                               |
| `npm run format:check`               | Prettier check (CI mode)                     |
| `npm run typecheck`                  | `astro check` type checking                  |
| `npm test`                           | Vitest                                       |
| `npm run images:generate -- --pilot` | Generate the V3D.4 pilot set locally         |

Pre-commit hook runs Prettier + ESLint on staged files automatically.

## Conventions

- Conventional Commits (`feat:`, `fix:`, `chore:`, …).
- All content lives in `src/content/**` behind validated schemas.
- Site metadata and navigation are defined once in `src/config.ts`.
- Editorial image generation is a manual development-time pipeline only; generated files are ordinary static assets after creation.
