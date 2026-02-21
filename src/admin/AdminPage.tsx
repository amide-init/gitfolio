import {
  AdminLoadingSection,
  AdminLoginSection,
  AdminLayout,
  AdminUnauthorizedSection,
} from '../components/admin'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { useAdminAuth } from './hooks/useAdminAuth'

function AdminPage() {
  const auth = useAdminAuth()

  const showLogin = !auth.token || auth.viewState === 'unauthenticated'
  const showUnauthorized = Boolean(
    auth.token && auth.viewState === 'unauthorized',
  )
  const showLoading =
    Boolean(auth.token) &&
    (auth.viewState === 'checkingAuth' ||
      auth.viewState === 'authenticating' ||
      auth.viewState === 'checkingPermissions' ||
      auth.viewState === 'loadingConfig')
  const showDashboard =
    auth.token &&
    (auth.viewState === 'ready' || auth.viewState === 'saving')

  if (showLogin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
        <div className="w-full max-w-md">
          <AdminLoginSection
            isBusy={auth.isBusy}
            isAuthenticating={auth.viewState === 'authenticating'}
            errorMessage={auth.error?.message ?? null}
            onLogin={auth.handleLogin}
          />
        </div>
      </div>
    )
  }

  if (showUnauthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
        <div className="w-full max-w-md">
          <AdminUnauthorizedSection />
        </div>
      </div>
    )
  }

  if (showLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
        <div className="w-full max-w-md">
          <AdminLoadingSection message={auth.heading} />
        </div>
      </div>
    )
  }

  if (!showDashboard) return null

  return (
    <AdminAuthProvider value={auth}>
      <AdminLayout repoName={auth.repoName} onLogout={auth.handleLogout} />
    </AdminAuthProvider>
  )
}

export default AdminPage
