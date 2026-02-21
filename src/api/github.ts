// src/api/github.ts
import type { GitforgeConfig } from '../types/gitforgeConfig'

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID as string
const OWNER = import.meta.env.VITE_GITHUB_OWNER as string
const REPO = import.meta.env.VITE_GITHUB_REPO as string

if (!GITHUB_CLIENT_ID || !OWNER || !REPO) {
  // Fail fast in development; in production you'll just see console errors.
  console.warn(
    '[githubApi] Missing VITE_GITHUB_CLIENT_ID / VITE_GITHUB_OWNER / VITE_GITHUB_REPO env vars',
  )
}

const ACCESS_TOKEN_KEY = 'gitfolio_admin_access_token'

// In dev we use Vite proxy (/api/github/login/*) to avoid CORS. In production, set VITE_GITHUB_OAUTH_PROXY_URL to a serverless proxy.
const GITHUB_OAUTH_PROXY = import.meta.env.VITE_GITHUB_OAUTH_PROXY_URL as
  | string
  | undefined
const OAUTH_BASE_URL = GITHUB_OAUTH_PROXY
  ? `${GITHUB_OAUTH_PROXY}/login`
  : import.meta.env.DEV
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/api/github/login`
    : 'https://github.com/login'

export function getStoredToken(): string | null {
  try {
    return window.sessionStorage.getItem(ACCESS_TOKEN_KEY)
  } catch {
    return null
  }
}

function storeToken(token: string) {
  try {
    window.sessionStorage.setItem(ACCESS_TOKEN_KEY, token)
  } catch {
    // Ignore – sessionStorage can fail in private mode; token will just live in memory.
  }
}

export function clearStoredToken() {
  try {
    window.sessionStorage.removeItem(ACCESS_TOKEN_KEY)
  } catch {
    // ignore
  }
}

type DeviceCodeResponse = {
  device_code: string
  user_code: string
  verification_uri: string
  verification_uri_complete?: string
  expires_in: number
  interval: number
}

type DeviceTokenResponse =
  | {
      access_token: string
      token_type: 'bearer'
      scope: string
    }
  | {
      error:
        | 'authorization_pending'
        | 'slow_down'
        | 'expired_token'
        | 'access_denied'
        | string
      error_description?: string
    }

async function requestDeviceCode(): Promise<DeviceCodeResponse> {
  const body = new URLSearchParams()
  body.set('client_id', GITHUB_CLIENT_ID)
  // scopes: repo (to write config) + read:user (optional)
  body.set('scope', 'repo read:user')

  const res = await fetch(`${OAUTH_BASE_URL}/device/code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(
      `Failed to start device flow (${res.status}): ${text || res.statusText}`,
    )
  }

  return (await res.json()) as DeviceCodeResponse
}

async function pollForAccessToken(
  deviceCode: string,
  intervalSeconds: number,
): Promise<string> {
  const body = new URLSearchParams()
  body.set('client_id', GITHUB_CLIENT_ID)
  body.set('device_code', deviceCode)
  body.set('grant_type', 'urn:ietf:params:oauth:grant-type:device_code')

  const baseDelay = Math.max(intervalSeconds, 5)

  // Simple polling loop; exits on success or terminal error.
  for (;;) {
    await new Promise((resolve) => setTimeout(resolve, baseDelay * 1000))

    const res = await fetch(`${OAUTH_BASE_URL}/oauth/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body,
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(
        `Failed to obtain access token (${res.status}): ${
          text || res.statusText
        }`,
      )
    }

    const data = (await res.json()) as DeviceTokenResponse

    if ('access_token' in data) {
      return data.access_token
    }

    switch (data.error) {
      case 'authorization_pending':
        // keep polling
        continue
      case 'slow_down':
        // in a real app you might back off further; for now just loop
        continue
      case 'access_denied':
        throw new Error('User denied access in GitHub OAuth screen.')
      case 'expired_token':
        throw new Error('Device code expired. Please try logging in again.')
      default:
        throw new Error(data.error_description || `OAuth error: ${data.error}`)
    }
  }
}

/**
 * login()
 *
 * Starts GitHub OAuth Device Flow and resolves with an access token.
 * The token is stored in sessionStorage (ephemeral) and also returned.
 *
 * IMPORTANT: GitHub's OAuth token endpoint does not currently support CORS,
 * so this flow may require a tiny server-side relay in practice. The
 * structure here is what you'd use; if you hit CORS, move these calls to a
 * serverless function while keeping the rest of the code unchanged.
 */
export async function login(): Promise<string> {
  const device = await requestDeviceCode()

  const verificationUrl =
    device.verification_uri_complete || device.verification_uri

  // Minimal UX; in a real app you'd render this in the React tree instead.
  window.open(verificationUrl, '_blank', 'noopener,noreferrer')
  // eslint-disable-next-line no-alert
  alert(
    `To continue, visit:\n\n${verificationUrl}\n\n` +
      `If prompted, enter this code:\n${device.user_code}`,
  )

  const token = await pollForAccessToken(device.device_code, device.interval)
  storeToken(token)
  return token
}

// ---- GitHub REST helpers ----

export type GitHubRepo = {
  full_name: string
  private: boolean
  permissions?: {
    admin?: boolean
    push?: boolean
    pull?: boolean
  }
}

async function githubFetch(
  token: string,
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const res = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  })
  return res
}

/**
 * getRepo()
 *
 * GET /repos/{owner}/{repo}
 * Used to verify that the authenticated user has admin rights.
 */
export async function getRepo(token: string): Promise<GitHubRepo> {
  const res = await githubFetch(token, `/repos/${OWNER}/${REPO}`)

  if (res.status === 401 || res.status === 403) {
    throw new Error('Unauthorized: invalid or expired token.')
  }

  if (!res.ok) {
    const text = await res.text()
    throw new Error(
      `Failed to fetch repo info (${res.status}): ${text || res.statusText}`,
    )
  }

  return (await res.json()) as GitHubRepo
}

export type ConfigFile = {
  config: GitforgeConfig
  sha: string | null
}

/**
 * getConfig()
 *
 * GET /repos/{owner}/{repo}/contents/gitforge.config.json
 * Decodes the Base64 JSON into a GitforgeConfig.
 * If the file does not exist, returns a sensible default config with sha = null.
 */
export async function getConfig(token: string): Promise<ConfigFile> {
  const res = await githubFetch(
    token,
    `/repos/${OWNER}/${REPO}/contents/gitforge.config.json`,
  )

  if (res.status === 404) {
    // File not present yet – initialize with minimal default.
    const defaultConfig: GitforgeConfig = {
      githubOwner: OWNER,
      profileType: 'user',
      featuredRepos: [],
      listedRepo: {
        count: 4,
        sort: 'date',
      },
      hero: {
        eyebrow: 'Open-source, developer-first profile',
        minorInfo: '',
      },
      customLinks: [],
    }

    return { config: defaultConfig, sha: null }
  }

  if (!res.ok) {
    const text = await res.text()
    throw new Error(
      `Failed to load gitforge.config.json (${res.status}): ${
        text || res.statusText
      }`,
    )
  }

  const json = await res.json()
  const { content, encoding, sha } = json as {
    content: string
    encoding: string
    sha: string
  }

  if (encoding !== 'base64') {
    throw new Error(`Unexpected encoding for config file: ${encoding}`)
  }

  const decoded = atob(content.replace(/\n/g, ''))
  let parsed: GitforgeConfig

  try {
    parsed = JSON.parse(decoded) as GitforgeConfig
  } catch (err) {
    throw new Error(
      `Config JSON is invalid. Please fix gitforge.config.json in GitHub.\n\n${String(
        err,
      )}`,
    )
  }

  return { config: parsed, sha }
}

/**
 * updateConfig()
 *
 * PUT /repos/{owner}/{repo}/contents/gitforge.config.json
 * Uses previous file SHA when updating to avoid race conditions.
 */
export async function updateConfig(
  token: string,
  params: {
    config: GitforgeConfig
    sha: string | null
    message?: string
  },
): Promise<ConfigFile> {
  const { config, sha, message } = params
  const json = JSON.stringify(config, null, 2)
  const contentBase64 = btoa(json)

  const body: Record<string, unknown> = {
    message: message ?? 'Update gitfolio config via admin panel',
    content: contentBase64,
  }

  if (sha) {
    body.sha = sha
  }

  const res = await githubFetch(
    token,
    `/repos/${OWNER}/${REPO}/contents/gitforge.config.json`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  )

  if (res.status === 401 || res.status === 403) {
    throw new Error('Unauthorized: token does not permit writing to repo.')
  }

  if (res.status === 409) {
    throw new Error(
      'Config file was updated on GitHub. Please reload and try again.',
    )
  }

  if (!res.ok) {
    const text = await res.text()
    throw new Error(
      `Failed to update config (${res.status}): ${text || res.statusText}`,
    )
  }

  const data = await res.json()
  const newSha =
    (data as any).content?.sha ??
    (data as any).content?.[0]?.sha ?? // fallback for any weird shape
    sha

  return {
    config,
    sha: newSha,
  }
}
