# Project: Gitfolio

## Overview

This repo is both:
- A **Vite + React + TS** template for a GitHub profile site.
- An **npm CLI package** named `gitforge` that generates static data from the GitHub API.

## Branch Architecture

Two-branch setup:

| Branch | Purpose |
|--------|---------|
| `main` | Development — code only. `data/*.json` files are always empty `[]`. |
| `web`  | Deployment — code + personal data. `data/` files hold real content. |

- `validate-main.yml` enforces that `data/*.json` stay empty on `main`.
- When a user forks the repo they get `main` with empty data, then create their own `web` branch for personal data.
- `sync-to-web.yml` merges code from `main` → `web` on every push, but always restores `web`'s `data/` and `gitforge.config.json` so personal data is never overwritten.
- `deploy.yml` always checks out the `web` branch (explicit `ref: web`) for all trigger types (push, schedule, workflow_dispatch).
- Because `GITHUB_TOKEN` pushes don't trigger other workflows, `sync-to-web.yml` explicitly dispatches `deploy.yml` via the GitHub API after pushing to `web`.

## CLI & Config

- Config source of truth: `gitforge.config.json` (git-ignored). Only `gitforge.config.example.json` is tracked.
- Generator script: `scripts/generate-github-data.js`, exposed as the `gitforge` binary via `package.json`.
- Usage: `gitforge [owner] [--type user|org]` — or reads `gitforge.config.json` when no CLI args given.

## Generated Files

Do not hand-edit or rely on these for long-term docs — they are regenerated:
- `src/generated/githubData.ts`
- `src/siteContent.json`

When editing site content, work against `src/siteContent.json` (keeping in mind it gets regenerated).

## App Constraints

- Functional React components, TypeScript, Tailwind CSS.
- Single-page app (React Router for internal nav), clean/dark/minimal/developer-focused.
- Deterministic and static — no runtime GitHub API calls from the browser.

## Tech Stack

- React + Vite + TypeScript
- Tailwind CSS
- pnpm
- Rich text editor: `luxe-edit` (v0.2.0)
  - Save content as JSON via `getEditorJSON(editorState)` in `onChange`
  - Render saved JSON as HTML via `getDOMFromJSON(savedJson)`

## Key Files

- `scripts/generate-github-data.js` — CLI / data generator
- `gitforge.config.example.json` — tracked config template
- `src/generated/githubData.ts` — generated GitHub data (do not hand-edit)
- `src/siteContent.json` — generated site content (do not hand-edit)
- `src/admin/pages/AdminBlogsPage.tsx` — blog editor (uses LuxeEditor)
- `src/pages/BlogPage.tsx` — blog display (renders JSON via `getDOMFromJSON`)
- `src/types/contentTypes.ts` — shared content types (`Blog`, `Project`, `Post`, `Video`)
- `.github/workflows/` — CI/CD workflows
