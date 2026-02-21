import { Outlet } from 'react-router-dom'
import { AdminNavbar } from './AdminNavbar'
import { AdminSidebar } from './AdminSidebar'

type AdminLayoutProps = {
  repoName: string | null
  onLogout: () => void
}

export function AdminLayout({ repoName, onLogout }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      <AdminNavbar repoName={repoName} onLogout={onLogout} />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-4xl p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
