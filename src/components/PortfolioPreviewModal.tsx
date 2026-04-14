import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X, Star, MapPin, Globe, ExternalLink, GitFork, Users, BookOpen } from 'lucide-react'

// Twitter/X brand icon (lucide-react does not ship it)
function XBrandIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? 'h-3 w-3'} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" />
    </svg>
  )
}

// ── Types (shared with NavSearch) ─────────────────────────────────────────────

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
  language: string | null
  fork: boolean
  topics?: string[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const FORK_URL = 'https://github.com/amide-init/gitfolio/fork'

const LANG_COLOR: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572A5',
  Go: '#00ADD8', Rust: '#dea584', 'C++': '#f34b7d', Java: '#b07219',
  Ruby: '#701516', PHP: '#4F5D95', Swift: '#F05138', Kotlin: '#A97BFF',
  Dart: '#00B4AB', CSS: '#563d7c', HTML: '#e34c26', Shell: '#89e051',
}

function initials(user: PreviewUser): string {
  const name = (user.name || user.login).trim()
  const parts = name.split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

// CSS-only animated dot grid — avoids adding another WebGL context
function DotGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `radial-gradient(circle, rgba(99,179,255,0.18) 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
      }}
    />
  )
}

// Animated scan-line canvas
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
  return <canvas ref={ref} width={1200} height={1} className="w-full block" aria-hidden="true" style={{ height: 1 }} />
}

// ── Repo card ─────────────────────────────────────────────────────────────────

function RepoCard({ repo }: { repo: PreviewRepo }) {
  const langColor = repo.language ? (LANG_COLOR[repo.language] ?? '#94a3b8') : null
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      className="group relative flex flex-col gap-2 rounded-xl border border-zinc-800/80 bg-[#0a0f1e]/80 p-4 transition-all duration-200 hover:border-blue-500/40 hover:bg-[#0d1527]/80 hover:shadow-[0_0_20px_rgba(59,130,246,0.08)]"
    >
      {/* Top accent bar */}
      <span className="absolute inset-x-0 top-0 h-px rounded-t-xl bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <p className="truncate text-sm font-semibold text-blue-400 group-hover:text-blue-300">{repo.name}</p>
      {repo.description && (
        <p className="line-clamp-2 text-xs text-zinc-500 leading-relaxed">{repo.description}</p>
      )}
      <div className="mt-auto flex items-center gap-3 text-[11px] text-zinc-600">
        {langColor && (
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: langColor }} />
            {repo.language}
          </span>
        )}
        {repo.stargazers_count > 0 && (
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3" />{repo.stargazers_count.toLocaleString()}
          </span>
        )}
      </div>
    </a>
  )
}

// ── Main modal ────────────────────────────────────────────────────────────────

type Props = {
  user: PreviewUser
  repos: PreviewRepo[]
  onClose: () => void
}

export function PortfolioPreviewModal({ user, repos, onClose }: Props) {
  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
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
            <GitFork className="h-3.5 w-3.5" />
            Fork &amp; make yours
          </a>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 transition"
            aria-label="Close preview"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Scrollable portfolio ── */}
      <div className="flex-1 overflow-y-auto bg-[#050509]">

        {/* ── Navbar replica ── */}
        <header className="sticky top-0 z-10 bg-[#050509]/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 text-[10px] font-bold text-[#050509]">
                {ini}
              </span>
              <span className="hidden sm:block text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                {displayName}
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-500">
              {['Home', 'Videos', 'Blogs', 'Projects'].map((l) => (
                <span key={l} className="cursor-default rounded-md px-2 py-1 hover:bg-white/5 hover:text-slate-300 transition">{l}</span>
              ))}
            </div>
          </div>
          <ScanLine />
        </header>

        {/* ── Hero ── */}
        <section className="relative overflow-hidden py-16 sm:py-24">
          <DotGrid />
          {/* ambient glow behind avatar */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[80px]"
            style={{ background: 'radial-gradient(circle, #3b82f6 0%, #06b6d4 60%, transparent 100%)' }}
          />
          <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 text-center sm:flex-row sm:text-left sm:items-start">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 opacity-50 blur-sm" />
              <img
                src={user.avatar_url}
                alt={displayName}
                className="relative h-24 w-24 rounded-full ring-2 ring-blue-500/40 sm:h-28 sm:w-28"
              />
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 ring-2 ring-[#050509]">
                <span className="h-2 w-2 rounded-full bg-white" />
              </span>
            </div>

            {/* Text */}
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

              {user.bio && (
                <p className="max-w-xl text-sm leading-relaxed text-slate-400">{user.bio}</p>
              )}

              {/* Meta links */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                {user.location && (
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{user.location}</span>
                )}
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
                {user.company && (
                  <span className="flex items-center gap-1 text-zinc-500">{user.company}</span>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs">
                {[
                  { icon: BookOpen, label: 'repos', value: user.public_repos },
                  { icon: Users, label: 'followers', value: user.followers },
                  { icon: Users, label: 'following', value: user.following },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-1">
                    <Icon className="h-3 w-3 text-blue-400" />
                    <span className="font-semibold text-zinc-200">{value.toLocaleString()}</span>
                    <span className="text-zinc-600">{label}</span>
                  </div>
                ))}
              </div>

              {/* CTA row */}
              <div className="flex flex-wrap gap-2">
                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> View on GitHub
                </a>
                <a
                  href={FORK_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-500"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-500 group-hover:translate-x-[150%]" />
                  <GitFork className="h-3.5 w-3.5" /> Fork &amp; build yours
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Repos section ── */}
        {repos.length > 0 && (
          <section className="mx-auto max-w-5xl px-6 pb-16">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-blue-900/0 via-blue-800/40 to-blue-900/0" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Featured repositories</p>
              <div className="h-px flex-1 bg-gradient-to-r from-blue-900/0 via-blue-800/40 to-blue-900/0" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {repos.map((repo) => <RepoCard key={repo.id} repo={repo} />)}
            </div>
          </section>
        )}

        {/* ── Claim / Fork CTA ── */}
        <section className="border-t border-blue-900/20 bg-gradient-to-b from-[#080c18] to-[#050509]">
          <div className="mx-auto max-w-5xl px-6 py-12 text-center">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-600">Want a portfolio like this?</p>
            <h2 className="text-xl font-extrabold text-zinc-100 sm:text-2xl">
              Fork Gitfolio — deploy in{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(90deg,#60a5fa,#a5f3fc)' }}
              >
                30 seconds
              </span>
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Fork the repo, rename it to <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">{'<username>.github.io'}</code>, and GitHub Actions auto-builds it with your data.
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
