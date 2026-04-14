import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, GitFork, Copy, Check, ExternalLink } from 'lucide-react'
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
  // Top languages by repo count
  const langCounts: Record<string, number> = {}
  allRepos.forEach((r) => { if (r.language) langCounts[r.language] = (langCounts[r.language] ?? 0) + 1 })
  const topLangs = Object.entries(langCounts).sort((a, b) => b[1] - a[1]).map(([l]) => l).slice(0, 5)

  // Top topics by frequency
  const topicCounts: Record<string, number> = {}
  allRepos.forEach((r) => (r.topics ?? []).forEach((t) => { topicCounts[t] = (topicCounts[t] ?? 0) + 1 }))
  const topTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]).map(([t]) => t).slice(0, 3)

  const totalStars = allRepos.reduce((s, r) => s + r.stargazers_count, 0)

  const eyebrow = user.company
    ? `Working at ${user.company}`
    : topLangs.length
      ? topLangs.join(' · ')
      : 'GitHub Developer'

  // Build a rich auto-generated description (same style as the CLI generator)
  const name = user.name || user.login
  let generated = `${name} maintains ${user.public_repos} public repositories on GitHub`
  if (totalStars > 0) generated += ` with ${totalStars.toLocaleString()} star${totalStars === 1 ? '' : 's'} across these projects`
  generated += '.'
  if (topLangs.length) generated += ` Most of the work centers around ${topLangs[0]}`
  if (topTopics.length) generated += `, with repositories touching topics like ${topTopics.join(', ')}`
  if (topLangs.length || topTopics.length) generated += '.'

  // Use the user's own bio if they have one, otherwise use the generated description
  const description = user.bio
    ? `${user.bio}\n\n${generated}`
    : generated

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

// ── Fork button — copies repo name then opens GitHub fork page ────────────────

const FORK_BASE = 'https://github.com/amide-init/gitfolio/fork'

/**
 * Two-step fork flow:
 * 1. Show a small panel with the suggested repo name + copy button.
 * 2. "Go fork" button opens the GitHub fork page in a new tab.
 *
 * GitHub's web fork form cannot be pre-filled via URL params, so we give
 * the user the name ready to paste.
 */
function ForkButton({ login, className }: { login: string; className?: string }) {
  const [step, setStep] = useState<'idle' | 'confirm'>('idle')
  const [copied, setCopied] = useState(false)
  const repoName = `${login}.github.io`

  const copy = async () => {
    await navigator.clipboard.writeText(repoName).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const goFork = () => {
    window.open(FORK_BASE, '_blank', 'noreferrer')
  }

  if (step === 'confirm') {
    return (
      <div className="inline-flex flex-col items-stretch gap-2 rounded-xl border border-indigo-500/30 bg-[#0d1527] p-3 text-left shadow-[0_0_20px_rgba(99,102,241,0.15)]">
        <p className="text-xs text-zinc-400">
          After forking, set the repository name to:
        </p>
        {/* Repo name + copy */}
        <div className="flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2">
          <code className="flex-1 text-sm font-mono font-semibold text-cyan-300">{repoName}</code>
          <button
            type="button"
            onClick={copy}
            className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-zinc-400 hover:text-zinc-100 transition"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setStep('idle')}
            className="flex-1 rounded-md border border-zinc-700 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 transition"
          >
            Back
          </button>
          <button
            type="button"
            onClick={goFork}
            className="group relative flex-1 overflow-hidden rounded-md bg-indigo-600 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition flex items-center justify-center gap-1.5"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Go fork →
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setStep('confirm')}
      className={className}
    >
      <GitFork className="h-3.5 w-3.5" /> Fork &amp; make yours
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

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

  // Escape is handled by NavSearch (it dismisses preview first, then closes search)
  // No duplicate listener here.

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
          <ForkButton
            login={user.login}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-indigo-500/40 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 transition hover:bg-indigo-500/20"
          />
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
              Fork the repo — GitHub Actions will auto-build your portfolio with your GitHub data.
            </p>
            <div className="mt-6 flex justify-center">
              <ForkButton
                login={user.login}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-[0_0_30px_rgba(59,130,246,0.35)] transition hover:shadow-[0_0_40px_rgba(59,130,246,0.55)]"
              />
            </div>
          </div>
        </section>

      </div>
    </div>,
    document.body
  )
}
