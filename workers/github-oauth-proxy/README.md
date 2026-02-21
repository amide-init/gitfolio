# GitHub OAuth CORS Proxy (Cloudflare Worker)

Proxies GitHub OAuth Device Flow requests (`/login/device/code`, `/login/oauth/access_token`) to avoid CORS in production. GitHub does not allow direct browser requests to these endpoints.

## Deploy

1. Install [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/): `npm install -g wrangler`
2. Log in: `wrangler login`
3. Deploy: `npx wrangler deploy` (from this directory)

Your worker URL will be `https://github-oauth-proxy.<YOUR_SUBDOMAIN>.workers.dev`.

## Configure gitfolio

1. Repo → **Settings** → **Secrets and variables** → **Actions** → **Variables**
2. **New repository variable**
3. Name: `VITE_GITHUB_OAUTH_PROXY_URL`
4. Value: `https://github-oauth-proxy.<YOUR_SUBDOMAIN>.workers.dev` (no trailing slash)

Push to `main` or run the deploy workflow to rebuild the site with the proxy URL.
