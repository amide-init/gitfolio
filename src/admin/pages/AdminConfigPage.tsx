import {
  AdminCustomLinksForm,
  AdminFeaturedReposForm,
  AdminFormFooter,
  AdminHeroForm,
} from '../../components/admin'
import { useAdminAuthContext } from '../context/AdminAuthContext'
import { useConfigForm } from '../hooks/useConfigForm'

export function AdminConfigPage() {
  const {
    config,
    setConfig,
    error,
    saveSuccess,
    handleSave,
    isBusy,
    viewState,
  } = useAdminAuthContext()

  const {
    handleFeaturedReposChange,
    updateHero,
    updateCustomLink,
    addCustomLink,
    removeCustomLink,
  } = useConfigForm(config, setConfig)

  const showForm =
    (viewState === 'ready' || viewState === 'saving') && config

  if (!showForm || !config) return null

  return (
    <form
      className="space-y-8 rounded-xl border border-slate-800 bg-slate-900/40 p-6"
      onSubmit={handleSave}
    >
      <div>
        <h2 className="text-lg font-semibold text-slate-100">
          Portfolio Settings
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Edit hero, featured repos, and custom links. Changes are committed to
          the repo and trigger a rebuild.
        </p>
      </div>

      <AdminHeroForm
        hero={config.hero}
        onEyebrowChange={(v) => updateHero('eyebrow', v)}
        onMinorInfoChange={(v) => updateHero('minorInfo', v)}
      />

      <AdminFeaturedReposForm
        value={config.featuredRepos ?? []}
        onChange={handleFeaturedReposChange}
      />

      <AdminCustomLinksForm
        links={config.customLinks ?? []}
        onUpdate={updateCustomLink}
        onAdd={addCustomLink}
        onRemove={removeCustomLink}
      />

      <AdminFormFooter
        errorMessage={error?.message ?? null}
        saveSuccessMessage={saveSuccess}
        isSaving={viewState === 'saving'}
        isBusy={isBusy}
      />
    </form>
  )
}
