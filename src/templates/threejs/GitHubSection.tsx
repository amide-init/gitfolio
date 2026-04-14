import { lazy, Suspense } from 'react'
import RepoCard from './RepoCard'

const ParticleField = lazy(() => import('./ParticleField'))

type ProjectRepo = {
  name: string
  description: string
  url: string
  stars: number
  language?: string | null
  topics?: string[]
  lastUpdated?: string
  featured?: boolean
}

type GitHubSectionProps = {
  title?: string
  body?: string
  repos: ProjectRepo[]
}

export default function GitHubSection({
  title = 'GitHub',
  body = 'Repositories from this GitHub profile.',
  repos,
}: GitHubSectionProps) {
  if (!repos?.length) return null
  return (
    <section
      id="github"
      className="relative overflow-hidden border-t border-blue-900/30 bg-[#050509] py-16"
      aria-labelledby="github-title"
    >
      <Suspense fallback={null}>
        <ParticleField count={35} color={0x6366f1} opacity={0.3} />
      </Suspense>

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <header className="mb-10 max-w-2xl">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-blue-400">
            {title}
          </p>
          <p className="text-sm leading-relaxed text-slate-400">{body}</p>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          {repos.map((repo) => (
            <RepoCard key={repo.url} repo={repo} />
          ))}
        </div>
      </div>
    </section>
  )
}
