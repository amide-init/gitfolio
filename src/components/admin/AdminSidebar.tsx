import { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Settings2, FolderOpen, BookOpen, Video, Layout, SlidersHorizontal, X } from 'lucide-react'
import { cn } from '../../lib/utils'

const NAV = [
  { section: 'Content', items: [
    { to: '/admin/config',   label: 'Portfolio',  icon: Settings2 },
    { to: '/admin/projects', label: 'Projects',   icon: FolderOpen },
    { to: '/admin/blogs',    label: 'Blogs',      icon: BookOpen },
    { to: '/admin/videos',   label: 'Videos',     icon: Video },
  ]},
  { section: 'Manage', items: [
    { to: '/admin/template', label: 'Template',   icon: Layout },
    { to: '/admin/settings', label: 'Settings',   icon: SlidersHorizontal },
  ]},
]

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex flex-col gap-4 p-3">
      {NAV.map(({ section, items }) => (
        <div key={section}>
          <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">{section}</p>
          <div className="flex flex-col gap-0.5">
            {items.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onNavigate}
                className={({ isActive }) => cn(
                  'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-600/15 text-blue-400'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function AdminSidebar({ drawerOpen, onClose }: { drawerOpen: boolean; onClose: () => void }) {
  const location = useLocation()

  useEffect(() => { onClose() }, [location.pathname, onClose])
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-52 shrink-0 flex-col border-r border-zinc-800/60 bg-zinc-950 md:flex">
        <NavItems />
      </aside>

      {/* Mobile backdrop */}
      <div
        className={cn('fixed inset-0 z-40 bg-black/70 transition-opacity md:hidden', drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none')}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <aside
        className={cn('fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-zinc-800 bg-zinc-950 transition-transform duration-300 ease-in-out md:hidden', drawerOpen ? 'translate-x-0' : '-translate-x-full')}
        aria-label="Navigation drawer"
      >
        <div className="flex h-14 items-center justify-between border-b border-zinc-800 px-4">
          <span className="text-sm font-semibold text-zinc-100">Menu</span>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <NavItems />
        </div>
      </aside>
    </>
  )
}
