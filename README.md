# gitfolio
### [live Demo](https://amide-init.github.io/gitfolio/)
Generate a polished, static GitHub profile site from any user or organization — using a simple local generator script.

- **Input**: a GitHub username/org and (optionally) a small config file.
- **Output**: a Vite + React + TypeScript site wired to static data generated from the GitHub API.
- **No runtime API calls**: all data is fetched once at build time and written into JSON/TS files.
- **License**: MIT (see `LICENSE`).

---

## Quick start (fork & deploy)

### 1. Fork & deploy (no local setup)

**Recommended for most users:**

1. Fork this repo to your GitHub account.
2. (Optional but recommended) Rename the fork to `yourusername.github.io` if you want the site at the root:
   - `Settings → General → Repository name`
3. GitHub Actions will:
   - Run the generator using your GitHub username as `GITHUB_OWNER`.
   - Build the site.
   - Deploy to GitHub Pages.

You’ll get a live site at:

- `https://yourusername.github.io/` if the repo is named `yourusername.github.io`
- `https://yourusername.github.io/gitfolio/` if the repo is named `gitfolio`

The scheduled workflow also runs daily to refresh your GitHub data and stats.

### GitHub token (recommended)

By default, the generator uses the built‑in `GITHUB_TOKEN` provided by GitHub Actions:

- This is already wired in the workflow:

  ```yaml
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    GITHUB_OWNER: ${{ github.repository_owner }}
    GITHUB_PROFILE_TYPE: user
  ```

- This is usually enough for:
  - Higher rate limits than anonymous requests.
  - Access to public profile + repos.

If you want to include **private repos** in stats (they are only used for aggregates, never shown as projects), you can:

- Create a **personal access token** with `repo` scope.
- Add it as a secret named `GITHUB_TOKEN` in:
  - **Settings → Secrets and variables → Actions → New repository secret**.
- The workflow will automatically use that instead of the default token.

---

## Local usage (optional)

If you want to run it locally or customize more deeply:

### 1. Clone & install

```bash
git clone https://github.com/usedamru/gitforge.git .
pnpm install   # or: npm install
```

### 2. Generate content from GitHub

You can either pass the owner on the CLI or via config.

#### Option A – CLI only (local script)

```bash
# user profile
pnpm generate:github amide-init --type user

# organization
pnpm generate:github usedamru --type org
```

#### Option B – Config file

1. Copy the example:

```bash
cp gitforge.config.example.json gitforge.config.json
```

2. Edit `gitforge.config.json`:

```jsonc
{
  "githubOwner": "amide-init",         // user or org name
  "profileType": "user",               // "user" | "org"
  "featuredRepos": ["tide-app"],       // optional; list of repo names to always include
  "listedRepo": {
    "count": 4,                        // how many *additional* repos to list
    "sort": "date"                     // "date" | "star" | "date-then-star" | "star-then-date"
  }
}
```

3. Run the generator (no args needed; it reads the config):

```bash
pnpm generate:github
```

> Precedence for owner/type: CLI args → env vars → `gitforge.config.json` → defaults.

---

## What gitforge generates

The CLI calls the GitHub API once and writes:

- `src/generated/githubData.ts` – raw, typed snapshot of the profile + repos.
- `src/siteContent.json` – **editable JSON template** used by the React app.

The React app (`src/App.tsx`) reads **only** from `src/siteContent.json`, so:

- You can fully tweak copy/ordering/layout text without touching TypeScript.
- Regenerating with `gitforge` will overwrite `siteContent.json` with fresh data, so:
  - Either treat JSON as “generated, don’t edit”, or
  - Keep a copy / commit your version and regenerate only when needed.

### How stats are computed

- **Language distribution** (used for the language pie chart):

  - For each repo we read GitHub’s primary `language` field.
  - We count how many repos use each language:

    \[
    \text{count(language)} = \#\{\text{repos with that primary language}\}
    \]

  - We only consider repos that have a language set. Let \(\text{total\_with\_language}\) be the sum of counts over all languages:

    \[
    \text{total\_with\_language} = \sum_{\ell} \text{count}(\ell)
    \]

  - The percentage for each language is:

    \[
    \text{percentage}(\ell) =
      \text{round}\left(
        \frac{\text{count}(\ell)}{\text{total\_with\_language}} \times 100
      \right)
    \]

  - Only the top 8 languages (by `count`) are shown in the chart.

Key sections in `siteContent.json`:

- `hero`: title, subtitle, CTA, caption.
- `snapshot`: list of profile stats (repos, followers, last updated).
- `philosophy`: section title, intro, and cards summarizing repo activity/languages/topics.
- `projects`: section title, intro, and an array of featured repos with:
  - `name`, `description`, `url`, `stars`, `language`, `topics`, `lastUpdated`.
- `footer`: short explanatory text + GitHub link label/URL.

---

## Running the site locally

After generating content:

```bash
pnpm dev        # or: npm run dev
```

Then open the printed URL (usually `http://localhost:5173`).

To build and preview a production bundle:

```bash
pnpm build
pnpm preview
```

The generated site is:

- Dark, minimal, developer‑focused.
- Single‑page (no routing).
- Built with React + TypeScript + Vite.

---

## Admin panel (edit config in the browser)

The `/admin` route lets repository **admins** edit `gitforge.config.json` (hero, featured repos, custom links) from the browser. Changes are committed via the GitHub API; GitHub Actions then rebuilds the site.

### 1. Create a GitHub OAuth App

1. Go to **GitHub → Settings → Developer settings → OAuth Apps**: [github.com/settings/developers](https://github.com/settings/developers).
2. Click **New OAuth App**.
3. Set:
   - **Application name**: e.g. `gitfolio Admin`
   - **Homepage URL**: your site URL  
     - User site: `https://YOUR_USERNAME.github.io`  
     - Project site: `https://YOUR_USERNAME.github.io/gitfolio`
   - **Authorization callback URL**: same as Homepage (or the default shown).
4. Click **Register application**.
5. Copy the **Client ID** (you do **not** need the client secret for the Device Flow used here).

### 2. Configure environment variables

Copy the example env file and set the admin variables:

```bash
cp .env.example .env
```

Edit `.env` and set:

```bash
VITE_GITHUB_CLIENT_ID=your_oauth_app_client_id_here
VITE_GITHUB_OWNER=your-github-username-or-org
VITE_GITHUB_REPO=gitfolio
```

- `VITE_GITHUB_OWNER`: owner of the repo (your username or org).
- `VITE_GITHUB_REPO`: repository name (e.g. `gitfolio` or `yourusername.github.io`).

### 3. Run the app and open the admin panel

```bash
pnpm dev
```

Then open:

- **Main site**: `http://localhost:5173/`
- **Admin panel**: `http://localhost:5173/admin`

Click **Login with GitHub**, complete the device flow in the new tab, then edit and save. Only users with **admin** permission on the repo can save; others see “Unauthorized”.

### Deployed site (GitHub Pages)

1. **Create an OAuth App** at [github.com/settings/developers](https://github.com/settings/developers):
   - Homepage URL: your site URL (e.g. `https://yourusername.github.io/gitfolio`)
   - Authorization callback URL: same as Homepage
   - Copy the **Client ID**

2. **Add GitHub Actions secret**:
   - Repo → **Settings → Secrets and variables → Actions**
   - **New repository secret**
   - Name: `VITE_GITHUB_CLIENT_ID`
   - Value: your OAuth App Client ID

   The workflow already uses `VITE_GITHUB_OWNER` and `VITE_GITHUB_REPO` from the repo (automatic for forks).

3. **Note:** If “Login with GitHub” fails in production (CORS), you’ll need a small serverless proxy for the OAuth token exchange.

---

## CLI usage details

### Command

```bash
gitforge [owner] [--type user|org]
```

- `owner` (optional): GitHub user or org (e.g. `amide-init`, `steipete`, `usedamru`).
- `--type` (optional): `user` or `org`.

If you omit both, `gitforge` falls back to:

1. `GITHUB_OWNER` / `GITHUB_PROFILE_TYPE` env vars.
2. `gitforge.config.json`.
3. Internal defaults (`usedamru` / `org`).

### Examples

```bash
# CLI only (local)
pnpm generate:github steipete --type user

# With config file only
cp gitforge.config.example.json gitforge.config.json
pnpm generate:github
```

---

## Project structure (template)

Key files:

- `scripts/generate-github-data.js` – CLI & GitHub fetcher.
- `src/App.tsx` – main React app wired to `siteContent.json`.
- `src/App.css` – layout & styling (dark, minimal, responsive).
- `src/siteContent.json` – generated + editable content JSON.
- `gitforge.config.example.json` – config template for users.
- `gitforge.config.json` – user-local config (ignored by git).

---

## Ignored / local files

`.gitignore` is set up to ignore:

- `node_modules`, `dist`, Vite/TS build artefacts.
- Logs (`*.log`, `logs/`, `npm-debug.log*`, etc.).
- Editor files (`.vscode`, `.idea`, `.DS_Store`, etc.).
- Generated content: `src/generated/`, `src/siteContent.json`.
- Local config: `gitforge.config.json`.

This keeps the repo clean while allowing each user to have their own profile config.

---

## Roadmap ideas

- `gitforge init` – scaffold a fresh project into any empty directory (no manual clone).
- Additional themes (still minimal, dev‑focused).
- Multi-profile / team pages.

If you have a specific workflow in mind, open an issue or PR in the repo where this package lives. :)

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
