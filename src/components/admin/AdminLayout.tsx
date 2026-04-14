import { useState, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import { AdminNavbar } from './AdminNavbar'
import { AdminSidebar } from './AdminSidebar'

type AdminLayoutProps = {
  repoName: string | null
  onLogout: () => void
}

export function AdminLayout({ repoName, onLogout }: AdminLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const openDrawer = useCallback(() => setDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <AdminNavbar repoName={repoName} onLogout={onLogout} onMenuOpen={openDrawer} />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar drawerOpen={drawerOpen} onClose={closeDrawer} />
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-3xl p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
