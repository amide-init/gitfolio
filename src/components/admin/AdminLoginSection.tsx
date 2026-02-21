type AdminLoginSectionProps = {
  isBusy: boolean
  isAuthenticating: boolean
  errorMessage: string | null
  onLogin: () => void
}

export function AdminLoginSection({
  isBusy,
  isAuthenticating,
  errorMessage,
  onLogin,
}: AdminLoginSectionProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="text-sm font-semibold text-slate-100">
        Admin access required
      </h2>
      <p className="mt-2 text-sm text-slate-400">
        Sign in with GitHub to edit portfolio configuration. Only users with{' '}
        <span className="font-semibold">admin</span> access to this repository
        will be allowed to save changes.
      </p>
      <button
        type="button"
        onClick={onLogin}
        disabled={isBusy}
        className="mt-4 inline-flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
      >
        {isBusy ? 'Signing in…' : 'Login with GitHub'}
      </button>
      {isAuthenticating && (
        <p className="mt-3 text-xs text-slate-400">
          If you've authorized in the other tab, return here and wait a few
          seconds for the dashboard to load.
        </p>
      )}
      {errorMessage && (
        <p className="mt-3 text-xs text-rose-400">{errorMessage}</p>
      )}
    </section>
  )
}
