/**
 * Cloudflare Worker: CORS proxy for GitHub OAuth Device Flow.
 *
 * GitHub's /login/device/code and /login/oauth/access_token do not support CORS.
 * This worker forwards requests to GitHub and adds Access-Control-Allow-Origin.
 *
 * Deploy: npx wrangler deploy (from workers/github-oauth-proxy/)
 * After deploy, set VITE_GITHUB_OAUTH_PROXY_URL in repo variables (e.g. https://github-oauth-proxy.YOUR_SUBDOMAIN.workers.dev)
 */

const GITHUB_BASE = 'https://github.com'

const ALLOWED_PATHS = ['/login/device/code', '/login/oauth/access_token']

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
  'Access-Control-Max-Age': '86400',
}

function jsonResponse(body, status, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders, ...headers },
  })
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders })
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405)
    }

    const url = new URL(request.url)
    if (!ALLOWED_PATHS.includes(url.pathname)) {
      return jsonResponse(
        { error: 'Proxy only for /login/device/code and /login/oauth/access_token' },
        400
      )
    }

    const targetUrl = `${GITHUB_BASE}${url.pathname}${url.search}`
    const init = {
      method: request.method,
      headers: {
        'Content-Type': request.headers.get('Content-Type') || 'application/x-www-form-urlencoded',
        Accept: request.headers.get('Accept') || 'application/json',
      },
    }
    if (request.method === 'POST') {
      init.body = await request.text()
    }

    const res = await fetch(targetUrl, init)
    const text = await res.text()
    const newHeaders = new Headers(res.headers)
    Object.entries(corsHeaders).forEach(([k, v]) => newHeaders.set(k, v))

    return new Response(text, {
      status: res.status,
      statusText: res.statusText,
      headers: newHeaders,
    })
  },
}
