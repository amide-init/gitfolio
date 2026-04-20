type Repo = {
  name: string
  description: string
  url: string
  stars: number
  forks?: number
  language?: string | null
  topics?: string[]
  lastUpdated?: string
  featured?: boolean
}

export default function RepoCard({ repo }: { repo: Repo }) {
  return (
    <article
      className="flex flex-col rounded-3xl border border-white/8 bg-[#111122] p-6 transition hover:border-indigo-500/40 hover:bg-[#13132a]"
      aria-label={`Repository ${repo.name}`}
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white">{repo.name}</h3>
            {repo.featured && (
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-400 ring-1 ring-emerald-500/20">
                Featured
              </span>
            )}
          </div>
          <p className="mt-1 text-[13px] text-slate-400">{repo.description ?? 'Repository on GitHub.'}</p>
        </div>
        <a
          href={repo.url}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 rounded-xl bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
        >
          View →
        </a>
      </header>

      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          {repo.stars}
        </span>
        <span>Forks {repo.forks ?? 0}</span>
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-400" />
            {repo.language}
          </span>
        )}
      </div>

      {repo.topics && repo.topics.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {repo.topics.map((topic) => (
            <span key={topic} className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-slate-400 ring-1 ring-white/8">
              {topic}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
