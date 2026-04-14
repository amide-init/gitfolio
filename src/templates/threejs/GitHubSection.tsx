import { lazy, Suspense } from 'react'

const ParticleField = lazy(() => import('./ParticleField'))
const RepoGraph     = lazy(() => import('./RepoGraph'))

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
        <ParticleField count={35} color={0x6366f1} opacity={0.25} />
      </Suspense>

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <header className="mb-8 max-w-2xl">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-blue-400">
            {title}
          </p>
          <p className="text-sm leading-relaxed text-slate-400">{body}</p>
        </header>

        <Suspense fallback={
          <div className="h-[480px] animate-pulse rounded-xl border border-blue-900/40 bg-[#0d1220]/60" />
        }>
          <RepoGraph repos={repos} />
        </Suspense>
      </div>
    </section>
  )
}
