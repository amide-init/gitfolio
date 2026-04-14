import { Link } from 'react-router-dom'
import { Menu, ExternalLink, LogOut } from 'lucide-react'
import { Button } from '../ui/button'

type AdminNavbarProps = {
  repoName: string | null
  onLogout: () => void
  onMenuOpen: () => void
}

export function AdminNavbar({ repoName, onLogout, onMenuOpen }: AdminNavbarProps) {
  return (
    <nav className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-950/95 px-4 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onMenuOpen} className="md:hidden text-zinc-400" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
        <Link to="/admin" className="flex items-center gap-2.5 no-underline">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">G</span>
          <span className="text-sm font-semibold text-zinc-100">Admin</span>
        </Link>
        {repoName && (
          <span className="hidden rounded-md bg-zinc-800/60 px-2 py-0.5 text-xs text-zinc-500 md:inline">
            {repoName}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" asChild className="text-zinc-400 hover:text-zinc-100 gap-1.5">
          <Link to="/" target="_blank" rel="noreferrer">
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">View site</span>
          </Link>
        </Button>
        <Button variant="ghost" size="sm" onClick={onLogout} className="text-zinc-400 hover:text-zinc-100 gap-1.5">
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </nav>
  )
}
