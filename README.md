# gitfolio
### [Live demo](https://amide-init.github.io/gitfolio/)

A polished, static GitHub profile site you can fork and make your own in minutes. Add your own blogs, videos, projects, and posts through the in-browser admin panel — no local setup required.

- **Built with**: Vite + React + TypeScript
- **Data**: stored in `data/*.json` files on your `web` branch, edited via `/admin`
- **Deployed**: GitHub Pages, triggered automatically on every change
- **License**: MIT (see `LICENSE`)

---

## Branch strategy

This repo uses two branches so forking gives you a **clean template** with no personal data baked in:

| Branch | Purpose |
|--------|---------|
| `main` | Clean template — empty data files, safe to fork |
| `web` | Your personal branch — holds your data, gets deployed |

All admin panel writes go to `web`. The deploy workflow triggers on `web`. `main` never contains personal data.

---

## Quick start (fork & deploy)

### Step 1 — Fork the repo

Fork to your GitHub account. Optionally rename the fork to `yourusername.github.io` for a root URL:

- `Settings → General → Repository name`

You’ll get a live site at:
- `https://yourusername.github.io/` (if repo is named `yourusername.github.io`)
- `https://yourusername.github.io/gitfolio/` (if repo is named `gitfolio`)

### Step 2 — Create your `web` branch

Go to **Actions → Setup web branch (first-time) → Run workflow**.

This creates a `web` branch from your `main`. GitHub Pages will deploy from `web` going forward.

### Step 3 — Enable GitHub Pages

In your fork: **Settings → Pages → Source → Deploy from a branch → `web` / `/ (root)`**.

> If you see a `github-pages` environment already deploying, it may have already been configured by the workflow — check before changing.

### Step 4 — Set up the admin panel

The `/admin` route lets you edit your site’s content from the browser. It needs a GitHub OAuth App to authenticate you.

#### 4a. Create a GitHub OAuth App

1. Go to [github.com/settings/developers](https://github.com/settings/developers) → **New OAuth App**
2. Set:
   - **Homepage URL**: your site URL (e.g. `https://yourusername.github.io/gitfolio`)
   - **Authorization callback URL**: same as Homepage
3. Click **Register application** and copy the **Client ID**

#### 4b. Add the Client ID as a repo secret

Repo → **Settings → Secrets and variables → Actions → New repository secret**

- Name: `VITE_GITHUB_CLIENT_ID`
- Value: your OAuth App Client ID

#### 4c. Set up the OAuth CORS proxy (required for browser login)

GitHub blocks OAuth token exchange from the browser. You need a small proxy. The easiest option is the included Cloudflare Worker:

```bash
cd workers/github-oauth-proxy
npx wrangler deploy
```

Then add a **repository variable** (not secret):

- Name: `VITE_GITHUB_OAUTH_PROXY_URL`
- Value: `https://YOUR-WORKER.workers.dev` (no trailing slash)

### Step 5 — Add your content

1. Visit `https://yourusername.github.io/gitfolio/admin`
2. Click **Login with GitHub** and complete the device flow
3. Edit your config, add blogs, videos, projects, posts
4. Save → the admin panel commits directly to your `web` branch → GitHub Actions rebuilds → your site updates

---

## How pushes flow

```
You push code to main
        ↓
sync-to-web.yml runs automatically
        ↓
merges main → web (your data files are always preserved)
        ↓
deploy.yml triggers on web → site rebuilds
```

```
You save data via /admin
        ↓
admin panel commits directly to web branch
        ↓
deploy.yml triggers on web → site rebuilds
```

You never need to touch the `web` branch manually.

---

## Local development

```bash
git clone https://github.com/amide-init/gitfolio.git
cd gitfolio
pnpm install
pnpm dev
```

To build and preview a production bundle:

```bash
pnpm build
pnpm preview
```

---

## Admin panel (local development)

To run the admin panel locally:

### 1. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```bash
VITE_GITHUB_CLIENT_ID=your_oauth_app_client_id_here
VITE_GITHUB_OWNER=your-github-username-or-org
VITE_GITHUB_REPO=gitfolio
VITE_DATA_BRANCH=web   # branch where data is read/written
```

### 2. Run the dev server

```bash
pnpm dev
```

- **Main site**: `http://localhost:5173/`
- **Admin panel**: `http://localhost:5173/admin`

Click **Login with GitHub**, complete the device flow in the new tab, then edit and save. Only users with **admin** permission on the repo can save; others see “Unauthorized”.

> In dev, OAuth requests are proxied through Vite (`/api/github/login/*`) to avoid CORS — no worker needed locally.

---

## Project structure

Key files:

- `src/api/github.ts` — GitHub API client; all reads/writes target the `web` branch
- `src/App.tsx` — main React app
- `data/` — content files (`blogs.json`, `posts.json`, `projects.json`, `videos.json`); empty on `main`, populated on `web`
- `gitforge.config.json` — site config; read/written by the admin panel
- `.github/workflows/deploy.yml` — builds and deploys from the `web` branch
- `.github/workflows/sync-to-web.yml` — syncs code changes from `main` → `web`
- `.github/workflows/setup-web.yml` — one-time setup to create the `web` branch

---

## Roadmap

- Additional themes (minimal, dev-focused)
- Multi-profile / team pages

Open an issue or PR for feature requests.
