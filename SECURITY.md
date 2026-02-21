# Security Checklist

## Never commit

- **`.env`** – contains `GITHUB_TOKEN`, `VITE_GITHUB_CLIENT_ID`, etc. (ignored by git)
- **`gitforge.config.json`** – can contain `githubToken` (ignored by git)
- **Personal access tokens** (ghp_*, github_pat_*)
- **OAuth client secrets** (we only use Client ID; no secret in browser)

## Safe to commit

- `.env.example` – template with empty values, no secrets
- `gitforge.config.example.json` – template with `githubToken: null`

## GitHub Actions

- **Secrets** (Settings → Secrets and variables → Actions):
  - `GITHUB_TOKEN` – built-in, or your PAT for private repos
  - `VITE_GITHUB_CLIENT_ID` – OAuth App Client ID (for admin panel)

- **Variables**: `VITE_GITHUB_OWNER` and `VITE_GITHUB_REPO` are set automatically from the repo in the workflow.

## Verify before push

```bash
# Ensure no env files are staged
git status
# .env, .env.local should NOT appear

# If accidentally added, unstage:
git reset HEAD .env .env.local
```
