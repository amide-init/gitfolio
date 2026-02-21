// src/admin/AdminPage.tsx
import { useEffect, useMemo, useState } from 'react'
import {
  clearStoredToken,
  getConfig,
  getRepo,
  getStoredToken,
  login,
  updateConfig,
} from '../api/github'
import type { CustomLink, GitforgeConfig } from '../types/gitforgeConfig'

type ViewState =
  | 'checkingAuth'
  | 'unauthenticated'
  | 'authenticating'
  | 'checkingPermissions'
  | 'unauthorized'
  | 'loadingConfig'
  | 'ready'
  | 'saving'

type UiError = {
  message: string
  details?: string
}

function AdminPage() {
  const [token, setToken] = useState<string | null>(() => getStoredToken())
  const [viewState, setViewState] = useState<ViewState>('checkingAuth')
  const [repoName, setRepoName] = useState<string | null>(null)
  const [config, setConfig] = useState<GitforgeConfig | null>(null)
  const [configSha, setConfigSha] = useState<string | null>(null)
  const [error, setError] = useState<UiError | null>(null)
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)

  // Derived fields for form inputs
  const featuredReposText = useMemo(
    () => (config?.featuredRepos ?? []).join(', '),
    [config?.featuredRepos],
  )

  // Initial auth + permission check
  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      if (!token) {
        setViewState('unauthenticated')
        return
      }

      try {
        setViewState('checkingPermissions')
        const repo = await getRepo(token)
        if (cancelled) return

        setRepoName(repo.full_name)

        if (!repo.permissions?.admin) {
          setViewState('unauthorized')
          return
        }

        setViewState('loadingConfig')
        const { config: loadedConfig, sha } = await getConfig(token)
        if (cancelled) return

        setConfig(loadedConfig)
        setConfigSha(sha)
        setViewState('ready')
      } catch (err) {
        if (cancelled) return
        setError({
          message: 'Failed to verify permissions.',
          details: String(err),
        })
        clearStoredToken()
        setToken(null)
        setViewState('unauthenticated')
      }
    }

    void bootstrap()

    return () => {
      cancelled = true
    }
  }, [token])

  async function handleLogin() {
    setError(null)
    setSaveSuccess(null)

    try {
      setViewState('authenticating')
      const newToken = await login()
      setToken(newToken)
      // bootstrap effect will run again with the new token
    } catch (err) {
      setViewState('unauthenticated')
      setError({
        message: 'GitHub login failed.',
        details: String(err),
      })
    }
  }

  function handleLogout() {
    clearStoredToken()
    setToken(null)
    setConfig(null)
    setConfigSha(null)
    setRepoName(null)
    setViewState('unauthenticated')
    setError(null)
    setSaveSuccess(null)
  }

  function updateConfigField<K extends keyof GitforgeConfig>(
    key: K,
    value: GitforgeConfig[K],
  ) {
    setConfig((prev) => {
      if (!prev) return prev
      return { ...prev, [key]: value }
    })
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!token || !config) return

    setError(null)
    setSaveSuccess(null)
    setViewState('saving')

    try {
      const cleaned: GitforgeConfig = {
        ...config,
        featuredRepos:
          config.featuredRepos?.map((r) => r.trim()).filter(Boolean) ?? [],
        customLinks:
          config.customLinks
            ?.map((link) => ({
              ...link,
              title: link.title.trim(),
              url: link.url.trim(),
              description: link.description?.trim() || undefined,
            }))
            .filter((link) => link.title && link.url) ?? [],
      }

      const { sha } = await updateConfig(token, {
        config: cleaned,
        sha: configSha,
        message: 'Update gitfolio config via admin panel',
      })

      setConfig(cleaned)
      setConfigSha(sha)
      setSaveSuccess(
        'Config saved. GitHub Actions will rebuild the site shortly.',
      )
      setViewState('ready')
    } catch (err) {
      setViewState('ready')
      setError({
        message: 'Failed to save configuration.',
        details: String(err),
      })
    }
  }

  function handleFeaturedReposChange(value: string) {
    const repos = value
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean)
    updateConfigField('featuredRepos', repos)
  }

  function ensureHero() {
    setConfig((prev) => {
      if (!prev) return prev
      if (prev.hero) return prev
      return {
        ...prev,
        hero: {
          eyebrow: 'Open-source, developer-first profile',
          minorInfo: '',
        },
      }
    })
  }

  function updateHero<K extends keyof NonNullable<GitforgeConfig['hero']>>(
    key: K,
    value: NonNullable<GitforgeConfig['hero']>[K],
  ) {
    ensureHero()
    setConfig((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        hero: {
          ...(prev.hero ?? {
            eyebrow: 'Open-source, developer-first profile',
            minorInfo: '',
          }),
          [key]: value,
        },
      }
    })
  }

  function updateCustomLink(
    index: number,
    field: keyof CustomLink,
    value: string,
  ) {
    setConfig((prev) => {
      if (!prev) return prev
      const current = prev.customLinks ?? []
      const next: CustomLink[] = current.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      )
      return { ...prev, customLinks: next }
    })
  }

  function addCustomLink() {
    setConfig((prev) => {
      if (!prev) return prev
      const current = prev.customLinks ?? []
      return {
        ...prev,
        customLinks: [
          ...current,
          { title: '', url: '', description: '' } as CustomLink,
        ],
      }
    })
  }

  function removeCustomLink(index: number) {
    setConfig((prev) => {
      if (!prev) return prev
      const current = prev.customLinks ?? []
      const next = current.filter((_, i) => i !== index)
      return { ...prev, customLinks: next }
    })
  }

  const isBusy =
    viewState === 'authenticating' ||
    viewState === 'checkingPermissions' ||
    viewState === 'loadingConfig' ||
    viewState === 'saving'

  const heading = useMemo(() => {
    switch (viewState) {
      case 'checkingAuth':
        return 'Checking session…'
      case 'authenticating':
        return 'Authenticating with GitHub…'
      case 'checkingPermissions':
        return 'Verifying repository permissions…'
      case 'loadingConfig':
        return 'Loading configuration…'
      case 'saving':
        return 'Saving changes…'
      default:
        return 'Admin – gitfolio'
    }
  }, [viewState])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              {heading}
            </h1>
            {repoName && (
              <p className="mt-1 text-xs text-slate-400">
                Repository:{' '}
                <span className="font-mono text-slate-300">{repoName}</span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {token && viewState !== 'unauthenticated' && (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-slate-600 px-3 py-1 text-xs font-medium text-slate-200 hover:bg-slate-800"
              >
                Logout
              </button>
            )}
          </div>
        </header>

        {!token || viewState === 'unauthenticated' ? (
          <section className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-sm font-semibold text-slate-100">
              Admin access required
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Sign in with GitHub to edit portfolio configuration. Only users
              with <span className="font-semibold">admin</span> access to this
              repository will be allowed to save changes.
            </p>
            <button
              type="button"
              onClick={handleLogin}
              disabled={isBusy}
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
            >
              {isBusy ? 'Opening GitHub…' : 'Login with GitHub'}
            </button>
            {error && (
              <p className="mt-3 text-xs text-rose-400">{error.message}</p>
            )}
          </section>
        ) : null}

        {token && viewState === 'unauthorized' && (
          <section className="rounded-lg border border-rose-900/60 bg-rose-950/40 p-6">
            <h2 className="text-sm font-semibold text-rose-200">
              Unauthorized
            </h2>
            <p className="mt-2 text-sm text-rose-200/80">
              You are logged into GitHub, but your account does not have{' '}
              <span className="font-semibold">admin permission</span> on this
              repository. Only admins can edit the portfolio configuration.
            </p>
          </section>
        )}

        {token &&
          (viewState === 'checkingAuth' ||
            viewState === 'authenticating' ||
            viewState === 'checkingPermissions' ||
            viewState === 'loadingConfig') && (
            <section className="mt-6 rounded-lg border border-slate-800 bg-slate-900/60 p-6">
              <p className="text-sm text-slate-300">
                {heading} This usually only takes a few seconds.
              </p>
            </section>
          )}

        {token && viewState === 'ready' && config && (
          <form
            className="mt-6 space-y-8 rounded-lg border border-slate-800 bg-slate-900/60 p-6"
            onSubmit={handleSave}
          >
            <section>
              <h2 className="text-sm font-semibold text-slate-100">
                Hero section
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Controls the eyebrow text and minor info displayed in the hero
                section.
              </p>
              <div className="mt-4 space-y-3">
                <label className="block text-xs font-medium text-slate-300">
                  Eyebrow (small text above title)
                  <input
                    type="text"
                    className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                    value={config.hero?.eyebrow ?? ''}
                    onChange={(e) => updateHero('eyebrow', e.target.value)}
                  />
                </label>
                <label className="block text-xs font-medium text-slate-300">
                  Minor Info (subtitle/bio text)
                  <textarea
                    rows={3}
                    className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                    value={config.hero?.minorInfo ?? ''}
                    onChange={(e) => updateHero('minorInfo', e.target.value)}
                  />
                </label>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-semibold text-slate-100">
                Featured repositories
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Comma-separated list of repo names that should always be
                featured. Example: <code>gitfolio, my-awesome-repo</code>
              </p>
              <textarea
                rows={2}
                className="mt-3 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                value={featuredReposText}
                onChange={(e) => handleFeaturedReposChange(e.target.value)}
              />
            </section>

            <section>
              <h2 className="text-sm font-semibold text-slate-100">
                Custom links
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Add external links (blog, newsletter, talks) with a short
                description.
              </p>
              <div className="mt-3 space-y-4">
                {(config.customLinks ?? []).map((link, index) => (
                  <div
                    key={index}
                    className="rounded-md border border-slate-800 bg-slate-950/60 p-3"
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          placeholder="Title (e.g. Personal blog)"
                          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                          value={link.title}
                          onChange={(e) =>
                            updateCustomLink(index, 'title', e.target.value)
                          }
                        />
                        <input
                          type="url"
                          placeholder="URL (https://…)"
                          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                          value={link.url}
                          onChange={(e) =>
                            updateCustomLink(index, 'url', e.target.value)
                          }
                        />
                        <textarea
                          rows={2}
                          placeholder="Short description (optional)"
                          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                          value={link.description ?? ''}
                          onChange={(e) =>
                            updateCustomLink(
                              index,
                              'description',
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCustomLink(index)}
                        className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 text-xs text-slate-300 hover:bg-slate-800"
                        aria-label="Remove link"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addCustomLink}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-800"
                >
                  + Add link
                </button>
              </div>
            </section>

            <section className="flex items-center justify-between gap-4 border-t border-slate-800 pt-4">
              <div className="space-y-1">
                {error && (
                  <p className="text-xs text-rose-400">{error.message}</p>
                )}
                {saveSuccess && (
                  <p className="text-xs text-emerald-400">{saveSuccess}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isBusy}
                className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
              >
                {viewState === 'saving' ? 'Saving…' : 'Save changes'}
              </button>
            </section>
          </form>
        )}

        {error && !config && viewState !== 'ready' && (
          <p className="mt-4 text-xs text-rose-400">
            {error.message}
            {error.details && (
              <>
                <br />
                <span className="text-rose-500/80">{error.details}</span>
              </>
            )}
          </p>
        )}
      </div>
    </div>
  )
}

export default AdminPage
