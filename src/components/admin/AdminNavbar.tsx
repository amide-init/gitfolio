import { Link } from 'react-router-dom'

type AdminNavbarProps = {
  repoName: string | null
  onLogout: () => void
}

export function AdminNavbar({ repoName, onLogout }: AdminNavbarProps) {
  return (
    <nav className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-800 bg-slate-950/95 px-6 backdrop-blur">
      <div className="flex items-center gap-6">
        <Link
          to="/admin"
          className="flex items-center gap-2 text-base font-semibold tracking-tight text-slate-50"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 text-sm font-bold text-slate-950">
            G
          </span>
          Portfolio Admin
        </Link>
        {repoName && (
          <span className="hidden text-xs text-slate-500 sm:inline">
            {repoName}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Link
          to="/"
          target="_blank"
          rel="noreferrer"
          className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
        >
          View site →
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-md border border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-slate-500 hover:bg-slate-800 hover:text-slate-100"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
