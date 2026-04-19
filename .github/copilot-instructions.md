# GitHub Copilot Instructions for Gitfolio

## Project context
- This repo is both a Vite + React + TypeScript portfolio app and an npm CLI (`gitforge`).
- Keep the app deterministic and static: do not add runtime GitHub API calls in browser code.
- Use functional React components with TypeScript and Tailwind CSS.

## Branch and data rules
- `main` is template code only: `data/*.json` must stay empty (`[]`).
- `web` is deployment + personal data branch.
- Never propose changes that put personal content into `main`.

## Generated files
- Do not hand-edit generated files:
  - `src/generated/githubData.ts`
  - `src/siteContent.json`
- If content generation is needed, use existing generator workflows/scripts.

## Config and secrets
- Source-of-truth config is `gitforge.config.json` (git-ignored).
- Only template config (`gitforge.config.example.json`) is tracked.
- Never commit secrets (`.env`, tokens, client secrets, PATs).

## Editing guidance
- Make minimal, surgical changes tied to the request.
- Reuse existing patterns and libraries before introducing new ones.
- Avoid unrelated refactors.
- Keep routing/template patterns consistent across pages.

## Validation commands
- Install: `pnpm install`
- Lint: `pnpm lint`
- Build: `pnpm build`

## Documentation consistency
- Keep `CLAUDE.md`, `README.md`, and workflow behavior in sync when changing architecture expectations.
