import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import siteContent from './siteContent.json'

type Theme = 'dark' | 'light'

export type LayoutContext = { theme: Theme }

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const sc = siteContent as {
    hero: { title?: string }
    footer: { text?: string; subtleText?: string; githubUrl?: string; githubLabel?: string }
  }
  const { hero, footer } = sc

  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const stored = window.localStorage.getItem('gitforge-theme')
    if (stored === 'dark' || stored === 'light') {
      setTheme(stored)
      document.documentElement.classList.toggle('dark', stored === 'dark')
      return
    }
    const prefersDark = window.matchMedia?.(
      '(prefers-color-scheme: dark)',
    ).matches
    const initial = prefersDark ? 'dark' : 'light'
    setTheme(initial)
    document.documentElement.classList.toggle('dark', initial === 'dark')
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    window.localStorage.setItem('gitforge-theme', theme)
  }, [theme])

  // GitHub Pages 404 redirect: ?/path -> /path
  useEffect(() => {
    const q = location.search
    if (q.startsWith('?/')) {
      const path = q.slice(2).replace(/~and~/g, '&')
      navigate(path || '/', { replace: true })
    }
  }, [location.search, navigate])

  useEffect(() => {
    document.title = hero.title || 'GitHub Profile'
    const firstChar = (hero.title || '?').charAt(0).toUpperCase()
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="6" fill="url(#grad)"/>
        <text x="16" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600" fill="#050509" text-anchor="middle">${firstChar}</text>
      </svg>
    `
    const svgBlob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(svgBlob)
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.getElementsByTagName('head')[0].appendChild(link)
    }
    link.type = 'image/svg+xml'
    link.href = url
    return () => URL.revokeObjectURL(url)
  }, [hero.title])

  const rootClasses =
    'min-h-screen font-sans bg-slate-50 text-slate-900 dark:bg-[#050509] dark:text-slate-50'
  const headerClasses =
    theme === 'dark'
      ? 'sticky top-0 z-20 border-b border-white/5 bg-[#050509]/90 backdrop-blur'
      : 'sticky top-0 z-20 border-b border-slate-200 bg-slate-50/90 backdrop-blur'
  const footerClasses =
    theme === 'dark'
      ? 'border-t border-slate-800 bg-gradient-to-b from-[#111120] to-[#050509] py-6 text-xs text-slate-400'
      : 'border-t border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100 py-6 text-xs text-slate-600'

  const navInitials = (() => {
    const name = (hero.title || '').trim()
    if (!name) return '?'
    const parts = name.split(/\s+/).filter(Boolean)
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase()
  })()

  return (
    <div className={rootClasses}>
      <header className={headerClasses}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 no-underline text-slate-900 dark:text-slate-100"
            aria-label={`${hero.title} home`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-xs font-semibold text-[#050509]" aria-hidden="true">
              {navInitials}
            </span>
          </Link>
          <nav className="flex items-center gap-3 text-xs font-medium text-slate-700 dark:text-slate-300" aria-label="Primary">
            <Link to="/" className="border-b border-transparent pb-0.5 transition-colors hover:border-slate-500 hover:text-slate-900 dark:hover:border-slate-400 dark:hover:text-slate-50">Home</Link>
            <Link to="/videos" className="border-b border-transparent pb-0.5 transition-colors hover:border-slate-500 hover:text-slate-900 dark:hover:border-slate-400 dark:hover:text-slate-50">Videos</Link>
            <Link to="/blogs" className="border-b border-transparent pb-0.5 transition-colors hover:border-slate-500 hover:text-slate-900 dark:hover:border-slate-400 dark:hover:text-slate-50">Blogs</Link>
            <Link to="/projects" className="border-b border-transparent pb-0.5 transition-colors hover:border-slate-500 hover:text-slate-900 dark:hover:border-slate-400 dark:hover:text-slate-50">Projects</Link>
            <a href="/#github" className="border-b border-transparent pb-0.5 transition-colors hover:border-slate-500 hover:text-slate-900 dark:hover:border-slate-400 dark:hover:text-slate-50">GitHub</a>
            <a href="/#stats" className="border-b border-transparent pb-0.5 transition-colors hover:border-slate-500 hover:text-slate-900 dark:hover:border-slate-400 dark:hover:text-slate-50">Stats</a>
            <a href={footer.githubUrl || '#'} target="_blank" rel="noreferrer" className="border-b border-transparent pb-0.5 transition-colors hover:border-slate-500 hover:text-slate-900 dark:hover:border-slate-400 dark:hover:text-slate-50">{footer.githubLabel || 'GitHub'}</a>
            <button
              type="button"
              onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] border-slate-300 bg-white/80 text-slate-800 transition hover:bg-white dark:border-slate-500/60 dark:bg-black/20 dark:text-slate-100 dark:hover:bg-black/40"
              aria-label="Toggle light and dark mode"
            >
              <span aria-hidden="true" className="h-5 w-5">
                {theme === 'dark' ? (
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    <circle cx="12" cy="12" r="4" className="fill-amber-400" />
                    <path d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" className="stroke-amber-400" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 scale-125">
                    <path d="M20 12.5A7.5 7.5 0 0 1 11.5 4 6 6 0 1 0 20 12.5Z" className="fill-slate-700" />
                  </svg>
                )}
              </span>
            </button>
          </nav>
        </div>
      </header>

      <main>
        <Outlet context={{ theme }} />
      </main>

      <footer className={footerClasses}>
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-3 px-6 sm:flex-row sm:items-center">
          <div>
            <p>{footer.text}</p>
            <p className="mt-1 text-[11px] text-slate-500">{footer.subtleText}</p>
            <p className="mt-2 text-[11px] text-slate-500">
              Want a site like this?{' '}
              <a href="https://github.com/amide-init/gitfolio" target="_blank" rel="noreferrer" className="font-medium text-indigo-600 underline underline-offset-2 hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200">Fork the gitfolio project</a> and point it at your own GitHub profile.
            </p>
          </div>
          <div className="flex gap-3">
            <a href="https://github.com/amide-init/gitfolio" target="_blank" rel="noreferrer" className="text-xs font-medium text-indigo-300 hover:text-indigo-200">{footer.githubLabel}</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
