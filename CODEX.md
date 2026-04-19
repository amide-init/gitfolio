# Codex Instructions for Gitfolio

## Goal
Contribute safely to Gitfolio with small, correct changes that preserve branch/data architecture and static-site behavior.

## Understand first
- Read `CLAUDE.md`, `README.md`, and relevant workflow files before structural changes.
- Prefer minimal edits in existing patterns over broad rewrites.

## Critical repository constraints
- Two-branch model:
  - `main`: template/dev branch, `data/*.json` must remain empty (`[]`).
  - `web`: deployment branch with real personal data.
- `sync-to-web.yml` preserves `web` data and dispatches deploy.
- `deploy.yml` deploys from `web`.

## Data and generation rules
- Do not hand-edit generated outputs:
  - `src/generated/githubData.ts`
  - `src/siteContent.json`
- Use existing generator script when needed: `scripts/generate-github-data.js`.

## Security rules
- Never commit secrets or local credentials:
  - `.env`, PAT tokens, OAuth secrets, private keys
  - `gitforge.config.json` when it contains private token values
- Follow `SECURITY.md` guidance for safe commits.

## Implementation style
- React: functional components + TypeScript.
- UI: Tailwind-first, clean and minimal style.
- Keep browser behavior static/deterministic (no runtime GitHub API access in frontend).
- Reuse existing utilities/components and avoid unnecessary dependencies.

## Validation
- Install dependencies: `pnpm install`
- Lint: `pnpm lint`
- Build: `pnpm build`
- Report pre-existing failures separately from new issues introduced by your changes.

## Scope discipline
- Only change what the task requires.
- If touching workflows or branching logic, ensure behavior still protects `web` data and `main` cleanliness.
