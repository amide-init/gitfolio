type AdminHeaderProps = {
  heading: string
  repoName: string | null
  showLogout: boolean
  onLogout: () => void
}

export function AdminHeader({
  heading,
  repoName,
  showLogout,
  onLogout,
}: AdminHeaderProps) {
  return (
    <header className="mb-8 flex items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{heading}</h1>
        {repoName && (
          <p className="mt-1 text-xs text-slate-400">
            Repository:{' '}
            <span className="font-mono text-slate-300">{repoName}</span>
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {showLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="rounded-md border border-slate-600 px-3 py-1 text-xs font-medium text-slate-200 hover:bg-slate-800"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  )
}
