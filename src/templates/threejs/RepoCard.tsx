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
      className="flex flex-col rounded-xl border border-blue-900/40 bg-gradient-to-b from-[#0d1220] to-[#080c18] p-5 text-sm transition hover:-translate-y-0.5 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
      aria-label={`Repository ${repo.name}`}
    >
      <header className="mb-3 flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-100">{repo.name}</h3>
            {repo.featured && (
              <span className="inline-flex items-center rounded-full border border-cyan-400/40 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                Featured
              </span>
            )}
          </div>
          <p className="text-[13px] text-slate-400">{repo.description ?? 'Repository on GitHub.'}</p>
        </div>
        <a
          href={repo.url}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 inline-flex items-center rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-300 transition hover:border-blue-400/60 hover:bg-blue-500/20 hover:text-blue-200"
        >
          View
        </a>
      </header>
      <dl className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-slate-400">
        <div className="flex items-center gap-1">
          <dt className="font-semibold text-slate-300">Stars</dt>
          <dd>{repo.stars}</dd>
        </div>
        <div className="flex items-center gap-1">
          <dt className="font-semibold text-slate-300">Forks</dt>
          <dd>{repo.forks ?? 0}</dd>
        </div>
        {repo.language && (
          <div className="flex items-center gap-1">
            <dt className="font-semibold text-slate-300">Language</dt>
            <dd>{repo.language}</dd>
          </div>
        )}
        {repo.lastUpdated && (
          <div className="flex items-center gap-1">
            <dt className="font-semibold text-slate-300">Updated</dt>
            <dd>{new Date(repo.lastUpdated).toLocaleDateString()}</dd>
          </div>
        )}
      </dl>
      {repo.topics && repo.topics.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {repo.topics.map((t) => (
            <span
              key={t}
              className="rounded-full border border-blue-500/25 bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-300"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
