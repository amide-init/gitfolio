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

type RepoCardProps = {
  repo: Repo
}

export default function RepoCard({ repo }: RepoCardProps) {
  return (
    <article
      className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800/60"
      aria-label={`Repository ${repo.name}`}
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
              {repo.name}
            </h3>
            {repo.featured && (
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                Featured
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {repo.description ?? 'Repository on GitHub.'}
          </p>
        </div>
        <a
          className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-indigo-400 hover:text-indigo-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:border-indigo-400 dark:hover:text-indigo-300"
          href={repo.url}
          target="_blank"
          rel="noreferrer"
        >
          View →
        </a>
      </header>

      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <svg className="h-4 w-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          {repo.stars}
        </span>
        <span className="flex items-center gap-1">
          <svg className="h-4 w-4 text-slate-500 dark:text-slate-400" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
          </svg>
          {repo.forks ?? 0}
        </span>
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-indigo-400" aria-hidden />
            {repo.language}
          </span>
        )}
        {repo.lastUpdated && (
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Updated {new Date(repo.lastUpdated).toLocaleDateString()}
          </span>
        )}
      </div>

      {repo.topics && repo.topics.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {repo.topics.map((topic) => (
            <span
              key={topic}
              className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
            >
              {topic}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
