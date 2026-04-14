import { useEffect, useState } from 'react'
import {
  getBlogs,
  getPosts,
  getProjects,
  updateBlogs,
  updatePosts,
  updateProjects,
} from '../../api/github'
import { AdminFormFooter } from '../../components/admin'
import { useAdminAuthContext } from '../context/AdminAuthContext'
import { useConfigForm } from '../hooks/useConfigForm'

export function AdminSettingsPage() {
  const {
    token,
    config,
    setConfig,
    error,
    saveSuccess,
    handleSave,
    isBusy,
    viewState,
  } = useAdminAuthContext()
  const { updateConfigField } = useConfigForm(config, setConfig)
  const [showClearModal, setShowClearModal] = useState(false)
  useEffect(() => {
    if (!showClearModal) return
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowClearModal(false)
    }
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [showClearModal])
  const [clearState, setClearState] = useState<{
    loading: boolean
    error: string | null
    success: string | null
  }>({ loading: false, error: null, success: null })

  async function performClear() {
    if (!token) return
    setShowClearModal(false)
    setClearState({ loading: true, error: null, success: null })
    try {
      const [projectsRes, blogsRes, postsRes] = await Promise.all([
        getProjects(token),
        getBlogs(token),
        getPosts(token),
      ])
      await updateProjects(
        token,
        [],
        projectsRes.sha,
        'Clear all projects via admin panel',
      )
      await updateBlogs(
        token,
        [],
        blogsRes.sha,
        'Clear all blogs via admin panel',
      )
      await updatePosts(
        token,
        [],
        postsRes.sha,
        'Clear all posts via admin panel',
      )
      setClearState({
        loading: false,
        error: null,
        success:
          'All projects, blogs, and posts cleared. Reload the Projects/Blogs/Posts pages to see empty lists.',
      })
    } catch (err) {
      setClearState({
        loading: false,
        error: String(err),
        success: null,
      })
    }
  }

  const isSaving = viewState === 'saving'

  return (
    <>
      <form className="space-y-6" onSubmit={handleSave}>
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Settings</h2>
          <p className="mt-1 text-sm text-slate-400">
            Admin and data options for this site.
          </p>
        </div>

        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
          <h3 className="text-sm font-semibold text-slate-300">Danger zone</h3>
          <p className="mt-1 text-xs text-slate-500">
            Clear all projects, blogs, and posts. Repo files will be reset to
            empty arrays.
          </p>
          {clearState.error && (
            <p className="mt-2 text-sm text-rose-400">{clearState.error}</p>
          )}
          {clearState.success && (
            <p className="mt-2 text-sm text-emerald-400">{clearState.success}</p>
          )}
          <button
            type="button"
            onClick={() => setShowClearModal(true)}
            disabled={clearState.loading}
            className="mt-3 rounded-md border border-rose-700 bg-rose-950/50 px-4 py-2 text-sm font-medium text-rose-300 hover:bg-rose-900/50 disabled:opacity-50"
          >
            {clearState.loading ? 'Clearing…' : 'Clear all data'}
          </button>
        </section>

        {config && (
          <>
            <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
              <h3 className="text-sm font-semibold text-slate-200">Template</h3>
              <p className="mt-1 text-xs text-slate-400">
                Choose the visual layout for your portfolio. Affects all public pages.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {(
                  [
                    {
                      id: 'minimal' as const,
                      label: 'Minimal',
                      description: 'Dark, text-first, developer-focused',
                      preview: (
                        <svg viewBox="0 0 120 80" className="h-full w-full" aria-hidden="true">
                          <rect width="120" height="80" fill="#050509" />
                          <rect x="12" y="12" width="50" height="6" rx="2" fill="#6366f1" opacity="0.5" />
                          <rect x="12" y="22" width="70" height="10" rx="2" fill="#f8fafc" opacity="0.9" />
                          <rect x="12" y="36" width="55" height="4" rx="1" fill="#94a3b8" opacity="0.6" />
                          <rect x="12" y="44" width="40" height="4" rx="1" fill="#94a3b8" opacity="0.4" />
                          <rect x="12" y="58" width="28" height="14" rx="3" fill="#1e1e2e" stroke="#ffffff" strokeOpacity="0.1" />
                          <rect x="46" y="58" width="28" height="14" rx="3" fill="#1e1e2e" stroke="#ffffff" strokeOpacity="0.1" />
                          <rect x="80" y="58" width="28" height="14" rx="3" fill="#1e1e2e" stroke="#ffffff" strokeOpacity="0.1" />
                        </svg>
                      ),
                    },
                    {
                      id: 'classic' as const,
                      label: 'Classic',
                      description: 'Light, card-based, resume-style',
                      preview: (
                        <svg viewBox="0 0 120 80" className="h-full w-full" aria-hidden="true">
                          <rect width="120" height="80" fill="#f8fafc" />
                          <rect x="12" y="10" width="96" height="22" rx="3" fill="#ffffff" stroke="#e2e8f0" />
                          <rect x="18" y="15" width="30" height="5" rx="1.5" fill="#1e293b" opacity="0.8" />
                          <rect x="18" y="23" width="50" height="3" rx="1" fill="#64748b" opacity="0.5" />
                          <rect x="12" y="38" width="29" height="18" rx="3" fill="#ffffff" stroke="#e2e8f0" />
                          <rect x="47" y="38" width="29" height="18" rx="3" fill="#ffffff" stroke="#e2e8f0" />
                          <rect x="82" y="38" width="26" height="18" rx="3" fill="#ffffff" stroke="#e2e8f0" />
                          <rect x="16" y="42" width="18" height="3" rx="1" fill="#1e293b" opacity="0.7" />
                          <rect x="16" y="48" width="22" height="2" rx="1" fill="#94a3b8" opacity="0.5" />
                          <rect x="51" y="42" width="18" height="3" rx="1" fill="#1e293b" opacity="0.7" />
                          <rect x="51" y="48" width="22" height="2" rx="1" fill="#94a3b8" opacity="0.5" />
                        </svg>
                      ),
                    },
                    {
                      id: 'bento' as const,
                      label: 'Bento',
                      description: 'Mosaic grid, creative layout',
                      preview: (
                        <svg viewBox="0 0 120 80" className="h-full w-full" aria-hidden="true">
                          <rect width="120" height="80" fill="#0f0f1a" />
                          <rect x="8" y="8" width="55" height="40" rx="4" fill="#1a1a2e" stroke="#ffffff" strokeOpacity="0.08" />
                          <rect x="69" y="8" width="43" height="18" rx="4" fill="#1a1a2e" stroke="#ffffff" strokeOpacity="0.08" />
                          <rect x="69" y="30" width="43" height="18" rx="4" fill="#1a1a2e" stroke="#ffffff" strokeOpacity="0.08" />
                          <rect x="8" y="53" width="27" height="19" rx="4" fill="#1a1a2e" stroke="#ffffff" strokeOpacity="0.08" />
                          <rect x="39" y="53" width="27" height="19" rx="4" fill="#1a1a2e" stroke="#ffffff" strokeOpacity="0.08" />
                          <rect x="70" y="53" width="42" height="19" rx="4" fill="#6366f1" opacity="0.3" />
                          <rect x="14" y="18" width="30" height="5" rx="1.5" fill="#f8fafc" opacity="0.8" />
                          <rect x="14" y="27" width="42" height="3" rx="1" fill="#94a3b8" opacity="0.4" />
                        </svg>
                      ),
                    },
                  ] as const
                ).map(({ id, label, description, preview }) => {
                  const isActive = (config.template ?? 'minimal') === id
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => updateConfigField('template', id)}
                      className={`relative flex flex-col overflow-hidden rounded-xl border text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                        isActive
                          ? 'border-indigo-500 ring-2 ring-indigo-500/40'
                          : 'border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <div className="aspect-[3/2] w-full bg-slate-950">
                        {preview}
                      </div>
                      <div className="p-2.5">
                        <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                          {isActive && (
                            <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-indigo-500 text-[8px] text-white">✓</span>
                          )}
                          {label}
                        </p>
                        <p className="mt-0.5 text-[10px] text-slate-500">{description}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
              {(config.template === 'classic' || config.template === 'bento') && (
                <p className="mt-3 text-[11px] text-amber-400/80">
                  This template is coming soon — saving will fall back to Minimal until it is released.
                </p>
              )}
            </section>

            <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <h3 className="text-sm font-semibold text-slate-200">
              Sections visibility
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Toggle which sections appear on the public homepage. Routes like
              /videos, /blogs, and /projects remain available.
            </p>
            <div className="mt-4 space-y-2 text-xs text-slate-300">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900 text-indigo-500"
                  checked={config.showVideosSection !== false}
                  onChange={(e) =>
                    updateConfigField('showVideosSection', e.target.checked)
                  }
                />
                <span>Show Videos section</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900 text-indigo-500"
                  checked={config.showBlogsSection !== false}
                  onChange={(e) =>
                    updateConfigField('showBlogsSection', e.target.checked)
                  }
                />
                <span>Show Blogs section</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900 text-indigo-500"
                  checked={config.showProjectsSection !== false}
                  onChange={(e) =>
                    updateConfigField('showProjectsSection', e.target.checked)
                  }
                />
                <span>Show Projects section</span>
              </label>
            </div>
            </section>

            <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <h3 className="text-sm font-semibold text-slate-200">
              Stats & charts
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Control which GitHub statistics and charts are included. These are
              computed at build time from your profile.
            </p>

            <div className="mt-4 space-y-2 text-xs text-slate-300">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900 text-indigo-500"
                  checked={config.showStats !== false}
                  onChange={(e) =>
                    updateConfigField('showStats', e.target.checked)
                  }
                />
                <span>Show Stats section</span>
              </label>
            </div>

            <div className="mt-4 grid gap-2 text-xs text-slate-300 sm:grid-cols-2">
              {(() => {
                const stats = config.stats ?? {}
                const updateStatsField = (
                  key:
                    | 'showLanguageChart'
                    | 'showRepoActivityChart'
                    | 'showCommitActivityChart'
                    | 'showTopReposChart',
                  value: boolean,
                ) => {
                  updateConfigField('stats', { ...stats, [key]: value })
                }
                return (
                  <>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900 text-indigo-500"
                        checked={stats.showLanguageChart !== false}
                        onChange={(e) =>
                          updateStatsField(
                            'showLanguageChart',
                            e.target.checked,
                          )
                        }
                      />
                      <span>Language distribution chart</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900 text-indigo-500"
                        checked={stats.showRepoActivityChart !== false}
                        onChange={(e) =>
                          updateStatsField(
                            'showRepoActivityChart',
                            e.target.checked,
                          )
                        }
                      />
                      <span>Repos per year chart</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900 text-indigo-500"
                        checked={stats.showCommitActivityChart !== false}
                        onChange={(e) =>
                          updateStatsField(
                            'showCommitActivityChart',
                            e.target.checked,
                          )
                        }
                      />
                      <span>Commit activity chart</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900 text-indigo-500"
                        checked={stats.showTopReposChart === true}
                        onChange={(e) =>
                          updateStatsField(
                            'showTopReposChart',
                            e.target.checked,
                          )
                        }
                      />
                      <span>Top repos by stars chart</span>
                    </label>
                  </>
                )
              })()}
            </div>
            </section>
          </>
        )}

        <AdminFormFooter
          errorMessage={error?.message ?? null}
          saveSuccessMessage={saveSuccess}
          isSaving={isSaving}
          isBusy={isBusy}
        />
      </form>

      {showClearModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-modal-title"
          onClick={(e) => e.target === e.currentTarget && setShowClearModal(false)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              id="clear-modal-title"
              className="text-lg font-semibold text-slate-100"
            >
              Clear all data?
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              This will remove all projects, blogs, and posts. The repo files
              will be reset to empty arrays. This cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="rounded-md border border-slate-600 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => performClear()}
                className="rounded-md border border-rose-600 bg-rose-600 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-rose-500"
              >
                Clear data
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
