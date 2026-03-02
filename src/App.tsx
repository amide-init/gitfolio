import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import siteContent from './siteContent.json'
import { githubConfig } from './generated/githubData'

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

  // Apply font family from generated GitHub config
  useEffect(() => {
    const font = (githubConfig as {
      fontFamily?: 'system' | 'ubuntu' | 'comic-sans' | 'inter' | 'roboto'
    }).fontFamily || 'system'
    let value =
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    if (font === 'ubuntu') {
      value = "'Ubuntu', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      // Inject Google Fonts stylesheet for Ubuntu if not already present
      if (!document.getElementById('gf-font-ubuntu')) {
        const link = document.createElement('link')
        link.id = 'gf-font-ubuntu'
        link.rel = 'stylesheet'
        link.href =
          'https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap'
        document.head.appendChild(link)
      }
    } else if (font === 'inter') {
      value =
        "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      if (!document.getElementById('gf-font-inter')) {
        const link = document.createElement('link')
        link.id = 'gf-font-inter'
        link.rel = 'stylesheet'
        link.href =
          'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
        document.head.appendChild(link)
      }
    } else if (font === 'roboto') {
      value =
        "'Roboto', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      if (!document.getElementById('gf-font-roboto')) {
        const link = document.createElement('link')
        link.id = 'gf-font-roboto'
        link.rel = 'stylesheet'
        link.href =
          'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap'
        document.head.appendChild(link)
      }
    } else if (font === 'comic-sans') {
      value = "'Comic Sans MS', 'Comic Sans', cursive"
    }
    document.documentElement.style.setProperty('--gf-font-family', value)
  }, [])

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
    'min-h-screen bg-slate-50 text-slate-900 dark:bg-[#050509] dark:text-slate-50'
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
            <a href={`${import.meta.env.BASE_URL}#github`} className="border-b border-transparent pb-0.5 transition-colors hover:border-slate-500 hover:text-slate-900 dark:hover:border-slate-400 dark:hover:text-slate-50">GitHub</a>
            <a href={`${import.meta.env.BASE_URL}#stats`} className="border-b border-transparent pb-0.5 transition-colors hover:border-slate-500 hover:text-slate-900 dark:hover:border-slate-400 dark:hover:text-slate-50">Stats</a>
            <a href={footer.githubUrl || '#'} target="_blank" rel="noreferrer" className="border-b border-transparent pb-0.5 transition-colors hover:border-slate-500 hover:text-slate-900 dark:hover:border-slate-400 dark:hover:text-slate-50">{footer.githubLabel || 'Fork'}</a>
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
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://github.com/amide-init/gitfolio"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-semibold transition border-amber-400/40 bg-amber-400/10 text-amber-500 hover:bg-amber-400/20 dark:border-amber-400/30 dark:text-amber-300 dark:hover:bg-amber-400/20"
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.873 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
              </svg>
              Star
            </a>
            <a
              href="https://github.com/amide-init/gitfolio/fork"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-semibold transition border-indigo-400/40 bg-indigo-400/10 text-indigo-500 hover:bg-indigo-400/20 dark:border-indigo-400/30 dark:text-indigo-300 dark:hover:bg-indigo-400/20"
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
              </svg>
              Fork
            </a>
            <Link
              to="/admin"
              className="text-[11px] font-medium text-slate-500 underline-offset-2 hover:underline dark:text-slate-400"
            >
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
