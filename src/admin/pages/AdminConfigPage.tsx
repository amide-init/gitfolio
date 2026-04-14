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
    updateConfigField,
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

      <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <h3 className="text-sm font-semibold text-slate-200">Typography</h3>
        <p className="text-xs text-slate-400">
          Choose the primary font used across the portfolio.
        </p>
        <div className="mt-2">
          <label className="block text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
            Font family
          </label>
          <select
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
            value={config.fontFamily ?? 'system'}
            onChange={(e) =>
              updateConfigField(
                'fontFamily',
                e.target.value as
                  | 'system'
                  | 'ubuntu'
                  | 'comic-sans'
                  | 'inter'
                  | 'roboto',
              )
            }
          >
            <option value="system">System default</option>
            <option value="ubuntu">Ubuntu</option>
            <option value="comic-sans">Comic Sans</option>
            <option value="inter">Inter</option>
            <option value="roboto">Roboto</option>
          </select>
        </div>
      </section>

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
