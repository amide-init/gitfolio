import { useState, useRef, useEffect, useCallback } from 'react'
import { Search, X, Star, Loader2, ExternalLink, MapPin, GitFork } from 'lucide-react'

// ── GitHub API types ──────────────────────────────────────────────────────────

type GHUser = {
  login: string
  name: string | null
  avatar_url: string
  bio: string | null
  html_url: string
  public_repos: number
  followers: number
  following: number
  location: string | null
}

type GHRepo = {
  id: number
  name: string
  html_url: string
  description: string | null
  stargazers_count: number
  language: string | null
  fork: boolean
}

type SearchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'done'; user: GHUser; repos: GHRepo[] }

// ── Language colour dots ──────────────────────────────────────────────────────

const LANG_COLOR: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  'C++': '#f34b7d',
  Java: '#b07219',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Shell: '#89e051',
}

// ─────────────────────────────────────────────────────────────────────────────

const FORK_URL = 'https://github.com/amide-init/gitfolio/fork'

type NavSearchProps = {
  /** Visual style: 'threejs' for sci-fi HUD, 'default' for all other templates */
  variant?: 'threejs' | 'default'
}

export function NavSearch({ variant = 'default' }: NavSearchProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [state, setState] = useState<SearchState>({ status: 'idle' })
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close when clicking outside
  useEffect(() => {
    if (!open) return
    const onMouseDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) close()
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [open])

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Auto-focus input when expanded
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  const close = () => {
    setOpen(false)
    setQuery('')
    setState({ status: 'idle' })
  }

  const search = useCallback(async (username: string) => {
    const name = username.trim()
    if (!name) return
    setState({ status: 'loading' })
    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${encodeURIComponent(name)}`),
        fetch(`https://api.github.com/users/${encodeURIComponent(name)}/repos?per_page=100&sort=updated`),
      ])
      if (userRes.status === 404) throw new Error(`User "${name}" not found on GitHub`)
      if (!userRes.ok) throw new Error('GitHub API error — try again later')
      const user = (await userRes.json()) as GHUser
      const allRepos = (await reposRes.json()) as GHRepo[]
      const repos = allRepos
        .filter((r) => !r.fork)
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 4)
      setState({ status: 'done', user, repos })
    } catch (err) {
      setState({ status: 'error', message: err instanceof Error ? err.message : 'Search failed' })
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') void search(query)
  }

  const isThreejs = variant === 'threejs'

  // ── Trigger button ──────────────────────────────────────────────────────────

  const triggerCls = isThreejs
    ? 'flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:text-slate-100 hover:bg-white/5 transition'
    : 'flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-white/5 transition'

  // ── Input wrapper ───────────────────────────────────────────────────────────

  const inputWrapCls = isThreejs
    ? 'flex items-center gap-1.5 rounded-md border border-blue-500/30 bg-[#0a0f1e] px-2 py-1 ring-1 ring-blue-500/15 shadow-[0_0_12px_rgba(59,130,246,0.12)]'
    : 'flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2 py-1 shadow-sm dark:border-zinc-700 dark:bg-zinc-900'

  const inputCls = isThreejs
    ? 'w-36 bg-transparent text-xs text-slate-200 placeholder:text-zinc-600 outline-none font-mono'
    : 'w-36 bg-transparent text-xs text-slate-800 placeholder:text-slate-400 outline-none dark:text-slate-200 dark:placeholder:text-zinc-600'

  const iconCls = isThreejs ? 'text-blue-400' : 'text-slate-400'

  // ── Panel ───────────────────────────────────────────────────────────────────

  const panelCls = isThreejs
    ? 'absolute right-0 top-full mt-2 w-80 rounded-xl border border-zinc-800/80 bg-[#080c18] shadow-2xl shadow-black/70 ring-1 ring-blue-900/30 z-50 overflow-hidden'
    : 'absolute right-0 top-full mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden dark:border-zinc-800 dark:bg-[#111827]'

  const statLabelCls = isThreejs ? 'text-zinc-600' : 'text-slate-400 dark:text-zinc-600'
  const statValCls = isThreejs ? 'text-zinc-100' : 'text-slate-800 dark:text-zinc-100'
  const repoCls = isThreejs
    ? 'flex items-start justify-between gap-2 rounded-md px-2 py-1.5 hover:bg-zinc-800/50 transition group'
    : 'flex items-start justify-between gap-2 rounded-md px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition group'
  const repoNameCls = isThreejs ? 'text-blue-400 group-hover:text-blue-300' : 'text-blue-600 dark:text-blue-400 group-hover:text-blue-500'
  const dividerCls = isThreejs ? 'border-zinc-800' : 'border-slate-100 dark:border-zinc-800'
  const metaCls = isThreejs ? 'text-zinc-600' : 'text-slate-400 dark:text-zinc-600'
  const descCls = isThreejs ? 'text-zinc-500' : 'text-slate-400 dark:text-zinc-500'
  const viewBtnCls = isThreejs
    ? 'flex flex-1 items-center justify-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition'
    : 'flex flex-1 items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
  const forkBtnCls = isThreejs
    ? 'flex flex-1 items-center justify-center gap-1.5 rounded-md border border-blue-500/30 bg-blue-600/10 px-3 py-1.5 text-xs font-medium text-blue-300 hover:bg-blue-600/20 transition'
    : 'flex flex-1 items-center justify-center gap-1.5 rounded-md border border-indigo-300 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-100 transition dark:border-indigo-500/30 dark:bg-indigo-600/10 dark:text-indigo-300 dark:hover:bg-indigo-600/20'

  const showPanel = open && (state.status === 'error' || state.status === 'done')

  return (
    <div ref={containerRef} className="relative">
      {/* Search trigger or expanded input */}
      {open ? (
        <div className={inputWrapCls}>
          <Search className={`h-3.5 w-3.5 shrink-0 ${iconCls}`} />
          <input
            ref={inputRef}
            type="text"
            placeholder="GitHub username…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className={inputCls}
            aria-label="Search GitHub user"
          />
          {state.status === 'loading' ? (
            <Loader2 className={`h-3.5 w-3.5 shrink-0 animate-spin ${iconCls}`} />
          ) : (
            <button type="button" onClick={close} className={`shrink-0 ${metaCls} hover:text-red-400 transition`} aria-label="Close search">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={triggerCls}
          aria-label="Search GitHub user"
        >
          <Search className="h-4 w-4" />
        </button>
      )}

      {/* Results panel */}
      {showPanel && (
        <div className={panelCls} role="dialog" aria-label="GitHub user search results">
          {state.status === 'error' && (
            <div className="p-4 text-sm text-red-400">{state.message}</div>
          )}

          {state.status === 'done' && (
            <>
              {/* User header */}
              <div className={`flex items-start gap-3 border-b p-4 ${dividerCls}`}>
                <img
                  src={state.user.avatar_url}
                  alt={state.user.login}
                  className={`h-12 w-12 rounded-full ring-2 ${isThreejs ? 'ring-blue-500/30' : 'ring-slate-200 dark:ring-blue-500/30'}`}
                />
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-semibold ${statValCls}`}>
                    {state.user.name || state.user.login}
                  </p>
                  <p className={`text-xs ${metaCls}`}>@{state.user.login}</p>
                  {state.user.bio && (
                    <p className={`mt-1 line-clamp-2 text-[11px] ${descCls}`}>{state.user.bio}</p>
                  )}
                  {state.user.location && (
                    <p className={`mt-0.5 flex items-center gap-0.5 text-[11px] ${metaCls}`}>
                      <MapPin className="h-2.5 w-2.5" /> {state.user.location}
                    </p>
                  )}
                </div>
              </div>

              {/* Stats row */}
              <div className={`flex divide-x border-b ${dividerCls}`}>
                {[
                  { label: 'Repos', value: state.user.public_repos },
                  { label: 'Followers', value: state.user.followers },
                  { label: 'Following', value: state.user.following },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-1 flex-col items-center py-2">
                    <span className={`text-sm font-semibold ${statValCls}`}>{value.toLocaleString()}</span>
                    <span className={`text-[10px] ${statLabelCls}`}>{label}</span>
                  </div>
                ))}
              </div>

              {/* Top repos */}
              {state.repos.length > 0 && (
                <div className="space-y-0.5 p-2">
                  {state.repos.map((repo) => (
                    <a
                      key={repo.id}
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className={repoCls}
                    >
                      <div className="min-w-0">
                        <p className={`truncate text-xs font-medium ${repoNameCls}`}>{repo.name}</p>
                        {repo.description && (
                          <p className={`truncate text-[10px] ${descCls}`}>{repo.description}</p>
                        )}
                      </div>
                      <div className={`flex shrink-0 items-center gap-2 text-[10px] ${metaCls}`}>
                        {repo.language && (
                          <span className="flex items-center gap-1">
                            <span
                              className="inline-block h-2 w-2 rounded-full"
                              style={{ background: LANG_COLOR[repo.language] ?? '#94a3b8' }}
                            />
                            {repo.language}
                          </span>
                        )}
                        {repo.stargazers_count > 0 && (
                          <span className="flex items-center gap-0.5">
                            <Star className="h-2.5 w-2.5" /> {repo.stargazers_count}
                          </span>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {/* CTA footer */}
              <div className={`flex gap-2 border-t p-3 ${dividerCls}`}>
                <a href={state.user.html_url} target="_blank" rel="noreferrer" className={viewBtnCls}>
                  <ExternalLink className="h-3 w-3" /> View GitHub
                </a>
                <a href={FORK_URL} target="_blank" rel="noreferrer" className={forkBtnCls}>
                  <GitFork className="h-3 w-3" /> Fork this template
                </a>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
