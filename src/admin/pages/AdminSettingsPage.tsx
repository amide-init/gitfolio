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
