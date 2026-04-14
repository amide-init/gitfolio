import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X, Star, MapPin, Globe, ExternalLink, GitFork, Users, BookOpen, GitCommitHorizontal } from 'lucide-react'

// ── Brand icons ───────────────────────────────────────────────────────────────

function XBrandIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? 'h-3 w-3'} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" />
    </svg>
  )
}

// ── Shared types ──────────────────────────────────────────────────────────────

export type PreviewUser = {
  login: string
  name: string | null
  avatar_url: string
  bio: string | null
  html_url: string
  public_repos: number
  followers: number
  following: number
  location: string | null
  blog?: string | null
  twitter_username?: string | null
  company?: string | null
}

export type PreviewRepo = {
  id: number
  name: string
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count?: number
  language: string | null
  fork: boolean
  topics?: string[]
  created_at?: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const FORK_URL = 'https://github.com/amide-init/gitfolio/fork'

const LANG_COLOR: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572A5',
  Go: '#00ADD8', Rust: '#dea584', 'C++': '#f34b7d', Java: '#b07219',
  Ruby: '#701516', PHP: '#4F5D95', Swift: '#F05138', Kotlin: '#A97BFF',
  Dart: '#00B4AB', CSS: '#563d7c', HTML: '#e34c26', Shell: '#89e051',
  Vue: '#41b883', 'C#': '#178600', Scala: '#c22d40', Lua: '#000080',
  R: '#198CE7', Elixir: '#6e4a7e', Haskell: '#5e5086',
}

function initials(u: PreviewUser) {
  const name = (u.name || u.login).trim()
  const parts = name.split(/\s+/).filter(Boolean)
  return parts.length === 1 ? parts[0].slice(0, 2).toUpperCase() : (parts[0][0] + parts[1][0]).toUpperCase()
}

function fmtNum(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

// ── CSS dot-grid background ───────────────────────────────────────────────────

function DotGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(99,179,255,0.18) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
      }}
    />
  )
}

// ── Animated scan-line ────────────────────────────────────────────────────────

function ScanLine() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let frame: number
    let t = 0
    const draw = () => {
      frame = requestAnimationFrame(draw)
      t += 0.012
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const w = canvas.width
      ctx.clearRect(0, 0, w, 1)
      const grad = ctx.createLinearGradient(0, 0, w, 0)
      const pos = Math.sin(t) * 0.5 + 0.5
      const span = 0.28
      grad.addColorStop(Math.max(0, pos - span), 'rgba(59,130,246,0)')
      grad.addColorStop(pos, 'rgba(99,179,255,0.9)')
      grad.addColorStop(Math.min(1, pos + span), 'rgba(6,182,212,0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, 1)
    }
    draw()
    return () => cancelAnimationFrame(frame)
  }, [])
  return <canvas ref={ref} width={1200} height={1} className="w-full block" aria-hidden style={{ height: 1 }} />
}

// ── Section divider ───────────────────────────────────────────────────────────

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="h-px flex-1 bg-gradient-to-r from-blue-900/0 via-blue-800/40 to-blue-900/0" />
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">{label}</p>
      <div className="h-px flex-1 bg-gradient-to-r from-blue-900/0 via-blue-800/40 to-blue-900/0" />
    </div>
  )
}

// ── Language chart ────────────────────────────────────────────────────────────

function LanguageChart({ allRepos }: { allRepos: PreviewRepo[] }) {
  const counts: Record<string, number> = {}
  allRepos.forEach(r => {
    if (r.language) counts[r.language] = (counts[r.language] ?? 0) + 1
  })
  const total = Object.values(counts).reduce((s, n) => s + n, 0)
  if (!total) return <p className="text-xs text-zinc-600">No language data available.</p>

  const langs = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  // Colour strip across the top (like GitHub's language bar)
  const strip = langs.map(([lang, count]) => ({
    lang,
    pct: (count / total) * 100,
    color: LANG_COLOR[lang] ?? '#94a3b8',
  }))

  return (
    <div className="space-y-4">
      {/* Colour strip */}
      <div className="flex h-2 w-full overflow-hidden rounded-full">
        {strip.map(({ lang, pct, color }) => (
          <div key={lang} style={{ width: `${pct}%`, background: color }} title={`${lang} ${Math.round(pct)}%`} />
        ))}
      </div>

      {/* Bars */}
      <div className="grid gap-2 sm:grid-cols-2">
        {langs.map(([lang, count]) => {
          const pct = Math.round((count / total) * 100)
          const color = LANG_COLOR[lang] ?? '#94a3b8'
          return (
            <div key={lang} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color }} />
              <span className="w-24 shrink-0 truncate text-xs text-zinc-300">{lang}</span>
              <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all"
                  style={{ width: `${pct}%`, background: color, opacity: 0.8 }}
                />
              </div>
              <span className="w-9 shrink-0 text-right text-[11px] text-zinc-500">{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Repos-per-year chart ──────────────────────────────────────────────────────

function ActivityChart({ allRepos }: { allRepos: PreviewRepo[] }) {
  const yearsMap: Record<string, number> = {}
  allRepos.forEach(r => {
    if (r.created_at) {
      const y = new Date(r.created_at).getFullYear().toString()
      yearsMap[y] = (yearsMap[y] ?? 0) + 1
    }
  })
  const years = Object.keys(yearsMap).sort()
  if (!years.length) return <p className="text-xs text-zinc-600">No activity data available.</p>

  const maxCount = Math.max(...Object.values(yearsMap))

  return (
    <div>
      <div className="flex items-end gap-1.5 h-24">
        {years.map(y => {
          const count = yearsMap[y]
          const heightPct = Math.max(8, (count / maxCount) * 100)
          return (
            <div key={y} className="group flex flex-1 flex-col items-center gap-1">
              <span className="text-[9px] text-zinc-600 opacity-0 group-hover:opacity-100 transition">{count}</span>
              <div
                className="w-full rounded-sm bg-blue-600/50 transition-all group-hover:bg-blue-400/80"
                style={{ height: `${heightPct}%` }}
              />
              <span className="text-[9px] text-zinc-600">{y.slice(2)}</span>
            </div>
          )
        })}
      </div>
      <p className="mt-1 text-[10px] text-zinc-700 text-center">Repositories created per year</p>
    </div>
  )
}

// ── Stats overview ────────────────────────────────────────────────────────────

function StatsOverview({ user, allRepos }: { user: PreviewUser; allRepos: PreviewRepo[] }) {
  const totalStars = allRepos.reduce((s, r) => s + r.stargazers_count, 0)
  const totalForks = allRepos.reduce((s, r) => s + (r.forks_count ?? 0), 0)
  const langCount = new Set(allRepos.map(r => r.language).filter(Boolean)).size

  const items = [
    { icon: Star, label: 'Total stars', value: fmtNum(totalStars), color: 'text-yellow-400' },
    { icon: GitFork, label: 'Total forks', value: fmtNum(totalForks), color: 'text-blue-400' },
    { icon: BookOpen, label: 'Public repos', value: fmtNum(user.public_repos), color: 'text-cyan-400' },
    { icon: Users, label: 'Followers', value: fmtNum(user.followers), color: 'text-purple-400' },
    { icon: Users, label: 'Following', value: fmtNum(user.following), color: 'text-indigo-400' },
    { icon: GitCommitHorizontal, label: 'Languages', value: String(langCount), color: 'text-green-400' },
  ]

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
      {items.map(({ icon: Icon, label, value, color }) => (
        <div key={label} className="flex flex-col items-center gap-1 rounded-xl border border-zinc-800/80 bg-[#0a0f1e]/60 py-3">
          <Icon className={`h-4 w-4 ${color}`} />
          <span className="text-base font-bold text-zinc-100">{value}</span>
          <span className="text-[9px] text-zinc-600 text-center leading-tight">{label}</span>
        </div>
      ))}
    </div>
  )
}

// ── Repo card ─────────────────────────────────────────────────────────────────

function RepoCard({ repo }: { repo: PreviewRepo }) {
  const color = repo.language ? (LANG_COLOR[repo.language] ?? '#94a3b8') : null
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      className="group relative flex flex-col gap-2 rounded-xl border border-zinc-800/80 bg-[#0a0f1e]/80 p-4 transition-all hover:border-blue-500/40 hover:bg-[#0d1527]/80 hover:shadow-[0_0_20px_rgba(59,130,246,0.08)]"
    >
      <span className="absolute inset-x-0 top-0 h-px rounded-t-xl bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <p className="truncate text-sm font-semibold text-blue-400 group-hover:text-blue-300">{repo.name}</p>
      {repo.description && <p className="line-clamp-2 text-xs text-zinc-500 leading-relaxed">{repo.description}</p>}
      <div className="mt-auto flex items-center gap-3 text-[11px] text-zinc-600">
        {color && (
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: color }} />
            {repo.language}
          </span>
        )}
        {repo.stargazers_count > 0 && (
          <span className="flex items-center gap-1"><Star className="h-3 w-3" />{repo.stargazers_count.toLocaleString()}</span>
        )}
        {(repo.forks_count ?? 0) > 0 && (
          <span className="flex items-center gap-1"><GitFork className="h-3 w-3" />{repo.forks_count}</span>
        )}
      </div>
    </a>
  )
}

// ── Main modal ────────────────────────────────────────────────────────────────

type Props = {
  user: PreviewUser
  repos: PreviewRepo[]
  allRepos: PreviewRepo[]
  onClose: () => void
}

export function PortfolioPreviewModal({ user, repos, allRepos, onClose }: Props) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const ini = initials(user)
  const displayName = user.name || user.login
  const websiteUrl = user.blog
    ? user.blog.startsWith('http') ? user.blog : `https://${user.blog}`
    : null

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex flex-col bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Portfolio preview for ${user.login}`}
    >
      {/* ── Preview banner ── */}
      <div className="flex shrink-0 items-center justify-between border-b border-blue-900/40 bg-[#050509]/95 px-4 py-2.5 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <span className="rounded-md border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-blue-400">
            Preview
          </span>
          <span className="text-xs text-zinc-400">
            Portfolio for <span className="font-semibold text-zinc-200">@{user.login}</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={FORK_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-indigo-500/40 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 transition hover:bg-indigo-500/20"
          >
            <GitFork className="h-3.5 w-3.5" /> Fork &amp; make yours
          </a>
          <button type="button" onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 transition" aria-label="Close preview">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Scrollable portfolio body ── */}
      <div className="flex-1 overflow-y-auto bg-[#050509]">

        {/* Navbar replica */}
        <header className="sticky top-0 z-10 bg-[#050509]/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 text-[10px] font-bold text-[#050509]">{ini}</span>
              <span className="hidden sm:block text-[11px] font-semibold uppercase tracking-widest text-slate-400">{displayName}</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-500">
              {['Home', 'Videos', 'Blogs', 'Projects'].map(l => (
                <span key={l} className="cursor-default rounded-md px-2 py-1 hover:bg-white/5 hover:text-slate-300 transition">{l}</span>
              ))}
            </div>
          </div>
          <ScanLine />
        </header>

        {/* ── Hero ── */}
        <section className="relative overflow-hidden py-14 sm:py-20">
          <DotGrid />
          <div className="pointer-events-none absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[80px]"
            style={{ background: 'radial-gradient(circle, #3b82f6 0%, #06b6d4 60%, transparent 100%)' }} />
          <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 text-center sm:flex-row sm:text-left sm:items-start">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 opacity-50 blur-sm" />
              <img src={user.avatar_url} alt={displayName} className="relative h-24 w-24 rounded-full ring-2 ring-blue-500/40 sm:h-28 sm:w-28" />
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 ring-2 ring-[#050509]">
                <span className="h-2 w-2 rounded-full bg-white" />
              </span>
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-3">
              <div>
                <h1
                  className="bg-clip-text text-3xl font-extrabold leading-tight text-transparent sm:text-4xl"
                  style={{ backgroundImage: 'linear-gradient(135deg,#60a5fa 0%,#a5f3fc 40%,#c084fc 100%)' }}
                >
                  {displayName}
                </h1>
                <p className="mt-1 text-sm font-mono text-slate-500">@{user.login}</p>
              </div>
              {user.bio && <p className="max-w-xl text-sm leading-relaxed text-slate-400">{user.bio}</p>}
              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                {user.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{user.location}</span>}
                {websiteUrl && (
                  <a href={websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-blue-400 transition">
                    <Globe className="h-3 w-3" />{user.blog}
                  </a>
                )}
                {user.twitter_username && (
                  <a href={`https://twitter.com/${user.twitter_username}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-sky-400 transition">
                    <XBrandIcon className="h-3 w-3" />@{user.twitter_username}
                  </a>
                )}
                {user.company && <span>{user.company}</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                <a href={user.html_url} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100">
                  <ExternalLink className="h-3.5 w-3.5" /> View on GitHub
                </a>
                <a href={FORK_URL} target="_blank" rel="noreferrer"
                  className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-500">
                  <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-500 group-hover:translate-x-[150%]" />
                  <GitFork className="h-3.5 w-3.5" /> Fork &amp; build yours
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── GitHub Stats overview ── */}
        <section className="mx-auto max-w-5xl px-6 pb-12">
          <SectionDivider label="GitHub stats" />
          <StatsOverview user={user} allRepos={allRepos} />
        </section>

        {/* ── Language distribution + Activity side by side ── */}
        <section className="mx-auto max-w-5xl px-6 pb-12">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Languages */}
            <div>
              <SectionDivider label="Top languages" />
              <LanguageChart allRepos={allRepos} />
            </div>
            {/* Activity */}
            <div>
              <SectionDivider label="Repo activity" />
              <ActivityChart allRepos={allRepos} />
            </div>
          </div>
        </section>

        {/* ── Top repos ── */}
        {repos.length > 0 && (
          <section className="mx-auto max-w-5xl px-6 pb-12">
            <SectionDivider label="Featured repositories" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {repos.map(r => <RepoCard key={r.id} repo={r} />)}
            </div>
          </section>
        )}

        {/* ── Claim / Fork CTA ── */}
        <section className="border-t border-blue-900/20 bg-gradient-to-b from-[#080c18] to-[#050509]">
          <div className="mx-auto max-w-5xl px-6 py-12 text-center">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-600">Want a portfolio like this?</p>
            <h2 className="text-xl font-extrabold text-zinc-100 sm:text-2xl">
              Fork Gitfolio —{' '}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg,#60a5fa,#a5f3fc)' }}>
                deploy in 30 seconds
              </span>
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Fork the repo, rename to <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">{'<username>.github.io'}</code>, and GitHub Actions auto-builds it with your data.
            </p>
            <a
              href={FORK_URL}
              target="_blank"
              rel="noreferrer"
              className="group relative mt-6 inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-[0_0_30px_rgba(59,130,246,0.35)] transition hover:shadow-[0_0_40px_rgba(59,130,246,0.55)]"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-500 group-hover:translate-x-[150%]" />
              <GitFork className="h-4 w-4" />
              Fork this template
            </a>
          </div>
        </section>

      </div>
    </div>,
    document.body
  )
}
