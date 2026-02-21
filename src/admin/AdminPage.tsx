import {
  AdminCustomLinksForm,
  AdminFeaturedReposForm,
  AdminFormFooter,
  AdminHeader,
  AdminHeroForm,
  AdminLoadingSection,
  AdminLoginSection,
  AdminUnauthorizedSection,
} from '../components/admin'
import { useAdminAuth } from './hooks/useAdminAuth'
import { useConfigForm } from './hooks/useConfigForm'

function AdminPage() {
  const {
    token,
    viewState,
    repoName,
    config,
    setConfig,
    error,
    saveSuccess,
    handleLogin,
    handleLogout,
    handleSave,
    isBusy,
    heading,
  } = useAdminAuth()

  const {
    featuredReposText,
    handleFeaturedReposChange,
    updateHero,
    updateCustomLink,
    addCustomLink,
    removeCustomLink,
  } = useConfigForm(config, setConfig)

  const showLogin =
    !token || viewState === 'unauthenticated'
  const showUnauthorized = Boolean(token && viewState === 'unauthorized')
  const showLoading =
    Boolean(token) &&
    (viewState === 'checkingAuth' ||
      viewState === 'authenticating' ||
      viewState === 'checkingPermissions' ||
      viewState === 'loadingConfig')
  const showForm =
    Boolean(token) &&
    (viewState === 'ready' || viewState === 'saving') &&
    Boolean(config)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <AdminHeader
          heading={heading}
          repoName={repoName}
          showLogout={Boolean(token && viewState !== 'unauthenticated')}
          onLogout={handleLogout}
        />

        {showLogin && (
          <AdminLoginSection
            isBusy={isBusy}
            isAuthenticating={viewState === 'authenticating'}
            errorMessage={error?.message ?? null}
            onLogin={handleLogin}
          />
        )}

        {showUnauthorized && <AdminUnauthorizedSection />}

        {showLoading && <AdminLoadingSection message={heading} />}

        {showForm && config && (
          <form
            className="mt-6 space-y-8 rounded-lg border border-slate-800 bg-slate-900/60 p-6"
            onSubmit={handleSave}
          >
            <AdminHeroForm
              hero={config.hero}
              onEyebrowChange={(v) => updateHero('eyebrow', v)}
              onMinorInfoChange={(v) => updateHero('minorInfo', v)}
            />

            <AdminFeaturedReposForm
              value={featuredReposText}
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
