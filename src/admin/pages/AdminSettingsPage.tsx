import { useEffect, useState } from 'react'
import { CheckCircle2, AlertCircle, Loader2, Trash2 } from 'lucide-react'
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Switch } from '../../components/ui/switch'
import { Label } from '../../components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog'

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
      await updateProjects(token, [], projectsRes.sha, 'Clear all projects via admin panel')
      await updateBlogs(token, [], blogsRes.sha, 'Clear all blogs via admin panel')
      await updatePosts(token, [], postsRes.sha, 'Clear all posts via admin panel')
      setClearState({
        loading: false,
        error: null,
        success: 'All projects, blogs, and posts cleared. Reload the Projects/Blogs/Posts pages to see empty lists.',
      })
    } catch (err) {
      setClearState({ loading: false, error: String(err), success: null })
    }
  }

  const isSaving = viewState === 'saving'

  return (
    <>
      <form className="space-y-6" onSubmit={handleSave}>
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">Settings</h1>
          <p className="mt-1 text-sm text-zinc-400">Admin and data options for this site.</p>
        </div>

        {config && (
          <>
            <Card className="border-zinc-800 bg-zinc-900">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm text-zinc-100">Search & discovery</CardTitle>
                <CardDescription className="text-xs text-zinc-500">
                  Allow visitors to search any GitHub user and preview their profile right inside your portfolio.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-search" className="text-sm text-zinc-300">Show search bar in navbar</Label>
                    <p className="text-xs text-zinc-500 mt-0.5">Visitors can explore any GitHub user's profile and repos from your site.</p>
                  </div>
                  <Switch
                    id="show-search"
                    checked={config.showSearch !== false}
                    onCheckedChange={(v) => updateConfigField('showSearch', v)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm text-zinc-100">Sections visibility</CardTitle>
                <CardDescription className="text-xs text-zinc-500">
                  Toggle which sections appear on the public homepage. Routes like /videos, /blogs, and /projects remain available.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-videos" className="text-sm text-zinc-300">Show Videos section</Label>
                  <Switch
                    id="show-videos"
                    checked={config.showVideosSection !== false}
                    onCheckedChange={(v) => updateConfigField('showVideosSection', v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-blogs" className="text-sm text-zinc-300">Show Blogs section</Label>
                  <Switch
                    id="show-blogs"
                    checked={config.showBlogsSection !== false}
                    onCheckedChange={(v) => updateConfigField('showBlogsSection', v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-projects" className="text-sm text-zinc-300">Show Projects section</Label>
                  <Switch
                    id="show-projects"
                    checked={config.showProjectsSection !== false}
                    onCheckedChange={(v) => updateConfigField('showProjectsSection', v)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm text-zinc-100">Stats & charts</CardTitle>
                <CardDescription className="text-xs text-zinc-500">
                  Control which GitHub statistics and charts are included. These are computed at build time from your profile.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-stats" className="text-sm text-zinc-300">Show Stats section</Label>
                  <Switch
                    id="show-stats"
                    checked={config.showStats !== false}
                    onCheckedChange={(v) => updateConfigField('showStats', v)}
                  />
                </div>
                {(() => {
                  const stats = config.stats ?? {}
                  const updateStatsField = (
                    key: 'showLanguageChart' | 'showRepoActivityChart' | 'showCommitActivityChart' | 'showTopReposChart',
                    value: boolean,
                  ) => updateConfigField('stats', { ...stats, [key]: value })
                  return (
                    <div className="space-y-4 border-t border-zinc-800 pt-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="lang-chart" className="text-sm text-zinc-300">Language distribution chart</Label>
                        <Switch
                          id="lang-chart"
                          checked={stats.showLanguageChart !== false}
                          onCheckedChange={(v) => updateStatsField('showLanguageChart', v)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="repo-chart" className="text-sm text-zinc-300">Repos per year chart</Label>
                        <Switch
                          id="repo-chart"
                          checked={stats.showRepoActivityChart !== false}
                          onCheckedChange={(v) => updateStatsField('showRepoActivityChart', v)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="commit-chart" className="text-sm text-zinc-300">Commit activity chart</Label>
                        <Switch
                          id="commit-chart"
                          checked={stats.showCommitActivityChart !== false}
                          onCheckedChange={(v) => updateStatsField('showCommitActivityChart', v)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="top-repos-chart" className="text-sm text-zinc-300">Top repos by stars chart</Label>
                        <Switch
                          id="top-repos-chart"
                          checked={stats.showTopReposChart === true}
                          onCheckedChange={(v) => updateStatsField('showTopReposChart', v)}
                        />
                      </div>
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          </>
        )}

        <Card className="border-red-900/50 bg-zinc-900">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm text-red-400">Danger zone</CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Clear all projects, blogs, and posts. Repo files will be reset to empty arrays.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {clearState.error && (
              <div className="flex items-start gap-2 rounded-lg border border-red-800/50 bg-red-950/30 px-3 py-2.5 text-sm text-red-400">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {clearState.error}
              </div>
            )}
            {clearState.success && (
              <div className="flex items-start gap-2 rounded-lg border border-green-800/50 bg-green-950/30 px-3 py-2.5 text-sm text-green-400">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                {clearState.success}
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowClearModal(true)}
              disabled={clearState.loading}
              className="gap-2 border-red-800 bg-red-950/30 text-red-400 hover:bg-red-950/60 hover:text-red-300"
            >
              {clearState.loading ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Clearing…</>
              ) : (
                <><Trash2 className="h-3.5 w-3.5" /> Clear all data</>
              )}
            </Button>
          </CardContent>
        </Card>

        <AdminFormFooter
          errorMessage={error?.message ?? null}
          saveSuccessMessage={saveSuccess}
          isSaving={isSaving}
          isBusy={isBusy}
        />
      </form>

      <Dialog open={showClearModal} onOpenChange={setShowClearModal}>
        <DialogContent className="border-zinc-800 bg-zinc-900 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Clear all data?</DialogTitle>
            <DialogDescription className="text-zinc-400">
              This will remove all projects, blogs, and posts. The repo files will be reset to empty arrays. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowClearModal(false)}
              className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => void performClear()}
              className="bg-red-600 text-white hover:bg-red-500"
            >
              Clear data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
