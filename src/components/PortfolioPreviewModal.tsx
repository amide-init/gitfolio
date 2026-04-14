import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, GitFork } from 'lucide-react'
import HeroSection from '../templates/threejs/HeroSection'
import GitHubSection from '../templates/threejs/GitHubSection'
import StatsSection from '../templates/threejs/StatsSection'

// ── Shared types (also used by NavSearch) ────────────────────────────────────

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

// ── Data builders — convert GitHub API → threejs template prop shapes ─────────

function buildHero(user: PreviewUser, allRepos: PreviewRepo[]) {
  const topLangs = [
    ...new Set(allRepos.map((r) => r.language).filter(Boolean)),
  ].slice(0, 5)

  const eyebrow = user.company
    ? `Working at ${user.company}`
    : topLangs.length
      ? topLangs.join(' · ')
      : 'GitHub Developer'

  const description =
    user.bio ||
    `${user.name || user.login} maintains ${user.public_repos} public repositories on GitHub.`

  const social: { provider: string; url: string }[] = []
  if (user.twitter_username)
    social.push({ provider: 'twitter', url: `https://twitter.com/${user.twitter_username}` })

  return {
    eyebrow,
    title: user.name || user.login,
    description,
    minorInfo: user.bio ?? null,
    primaryCtaLabel: 'View on GitHub',
    primaryCtaHref: user.html_url,
    caption: '',
    avatarUrl: user.avatar_url,
    contact: {
      email: null,
      location: user.location ?? null,
      company: user.company ?? null,
      website: user.blog
        ? user.blog.startsWith('http') ? user.blog : `https://${user.blog}`
        : null,
      twitter: user.twitter_username ?? null,
      social,
    },
  }
}

function buildSnapshot(user: PreviewUser, allRepos: PreviewRepo[]) {
  const langs = [
    ...new Set(allRepos.map((r) => r.language).filter(Boolean)),
  ].slice(0, 6)

  return {
    title: 'Top skills',
    items: [
      user.location ? `Based in ${user.location}` : null,
      `${user.public_repos} public repositories`,
      `${user.followers} followers · ${user.following} following`,
      user.blog ? `${user.blog}` : null,
    ].filter(Boolean) as string[],
    subtitle: langs.length ? langs.join(', ') : null,
  }
}

function buildRepos(allRepos: PreviewRepo[]) {
  return allRepos.map((r) => ({
    name: r.name,
    description: r.description ?? '',
    url: r.html_url,
    stars: r.stargazers_count,
    language: r.language ?? undefined,
    topics: r.topics ?? [],
    lastUpdated: undefined as string | undefined,
    featured: false,
  }))
}

function buildStats(user: PreviewUser, allRepos: PreviewRepo[]) {
  const totalStars = allRepos.reduce((s, r) => s + r.stargazers_count, 0)
  const totalForks = allRepos.reduce((s, r) => s + (r.forks_count ?? 0), 0)

  // Language distribution
  const langCounts: Record<string, number> = {}
  allRepos.forEach((r) => {
    if (r.language) langCounts[r.language] = (langCounts[r.language] ?? 0) + 1
  })
  const totalLangRepos = Object.values(langCounts).reduce((s, n) => s + n, 0)
  const languageDistribution = Object.entries(langCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([language, count]) => ({
      language,
      count,
      percentage: totalLangRepos ? Math.round((count / totalLangRepos) * 100) : 0,
    }))

  // Activity by year from created_at
  const yearCounts: Record<number, number> = {}
  allRepos.forEach((r) => {
    if (r.created_at) {
      const y = new Date(r.created_at).getFullYear()
      yearCounts[y] = (yearCounts[y] ?? 0) + 1
    }
  })
  const activityByYear = Object.entries(yearCounts)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([year, repos]) => ({ year: Number(year), repos }))

  // Top repos by stars
  const topReposByStars = [...allRepos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 10)
    .map((r) => ({
      name: r.name,
      stars: r.stargazers_count,
      language: r.language ?? 'Unknown',
    }))

  return {
    metrics: {
      totalRepos: allRepos.length,
      publicRepos: user.public_repos,
      totalStars,
      totalForks,
      totalOpenIssues: 0,
      languagesUsed: Object.keys(langCounts).length,
      followers: user.followers,
      following: user.following,
    },
    languageDistribution,
    activityByYear,
    topReposByStars,
  }
}

// ─────────────────────────────────────────────────────────────────────────────

const FORK_URL = 'https://github.com/amide-init/gitfolio/fork'

type Props = {
  user: PreviewUser
  repos: PreviewRepo[]
  allRepos: PreviewRepo[]
  onClose: () => void
}

export function PortfolioPreviewModal({ user, repos: _, allRepos, onClose }: Props) {
  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // Close on Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const hero     = buildHero(user, allRepos)
  const snapshot = buildSnapshot(user, allRepos)
  const repos    = buildRepos(allRepos)
  const stats    = buildStats(user, allRepos)

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={`Portfolio preview for ${user.login}`}
    >
      {/* ── Preview banner ── */}
      <div className="flex shrink-0 items-center justify-between border-b border-blue-900/40 bg-[#050509] px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="rounded-md border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-blue-400">
            Preview
          </span>
          <span className="text-xs text-zinc-400">
            Viewing portfolio for{' '}
            <span className="font-semibold text-zinc-200">@{user.login}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={FORK_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-indigo-500/40 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 transition hover:bg-indigo-500/20"
          >
            <GitFork className="h-3.5 w-3.5" /> Fork &amp; make yours
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

      {/* ── Scrollable template render ── */}
      <div className="flex-1 overflow-y-auto bg-[#050509]">

        {/* Render the actual threejs template sections with live data */}
        <HeroSection hero={hero} snapshot={snapshot} />
        <GitHubSection
          title="GitHub"
          body={`${user.name || user.login}'s public repositories on GitHub.`}
          repos={repos}
        />
        <StatsSection stats={stats} />

        {/* ── Claim CTA ── */}
        <section className="border-t border-blue-900/20 bg-gradient-to-b from-[#080c18] to-[#050509]">
          <div className="mx-auto max-w-5xl px-6 py-14 text-center">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-600">
              Like what you see?
            </p>
            <h2 className="text-xl font-extrabold text-zinc-100 sm:text-2xl">
              Fork Gitfolio —{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(90deg,#60a5fa,#a5f3fc)' }}
              >
                your portfolio in 30 seconds
              </span>
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Fork the repo, rename it to{' '}
              <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">
                {'<username>.github.io'}
              </code>
              , and GitHub Actions auto-builds it with your data.
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
