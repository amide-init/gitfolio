import { AdminCustomLinksForm, AdminFeaturedReposForm, AdminFormFooter, AdminHeroForm } from '../../components/admin'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { useAdminAuthContext } from '../context/AdminAuthContext'
import { useConfigForm } from '../hooks/useConfigForm'

export function AdminConfigPage() {
  const { config, setConfig, error, saveSuccess, handleSave, isBusy, viewState } = useAdminAuthContext()
  const { handleFeaturedReposChange, updateHero, updateCustomLink, addCustomLink, removeCustomLink } = useConfigForm(config, setConfig)

  if ((viewState !== 'ready' && viewState !== 'saving') || !config) return null

  return (
    <form className="space-y-6" onSubmit={handleSave}>
      <div>
        <h1 className="text-lg font-semibold text-zinc-100">Portfolio Settings</h1>
        <p className="mt-1 text-sm text-zinc-400">Edit hero, featured repos, and custom links. Changes commit to the repo and trigger a rebuild.</p>
      </div>

      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm text-zinc-100">Hero section</CardTitle>
          <CardDescription className="text-xs text-zinc-500">Controls the eyebrow text and bio shown in the hero.</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminHeroForm
            hero={config.hero}
            onEyebrowChange={(v) => updateHero('eyebrow', v)}
            onMinorInfoChange={(v) => updateHero('minorInfo', v)}
          />
        </CardContent>
      </Card>

      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm text-zinc-100">Featured repositories</CardTitle>
          <CardDescription className="text-xs text-zinc-500">Pinned repos highlighted at the top of the GitHub section.</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminFeaturedReposForm value={config.featuredRepos ?? []} onChange={handleFeaturedReposChange} />
        </CardContent>
      </Card>

      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm text-zinc-100">Custom links</CardTitle>
          <CardDescription className="text-xs text-zinc-500">External links shown on your profile page.</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminCustomLinksForm
            links={config.customLinks ?? []}
            onUpdate={updateCustomLink}
            onAdd={addCustomLink}
            onRemove={removeCustomLink}
          />
        </CardContent>
      </Card>

      <AdminFormFooter errorMessage={error?.message ?? null} saveSuccessMessage={saveSuccess} isSaving={viewState === 'saving'} isBusy={isBusy} />
    </form>
  )
}
