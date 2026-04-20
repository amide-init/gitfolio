type ProjectRepo = {
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

export default function RepoCard({ repo }: { repo: ProjectRepo }) {
  const updated = repo.lastUpdated
    ? new Date(repo.lastUpdated).toISOString().slice(0, 10)
    : null

  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noreferrer"
      className="group block border-l-2 border-green-900 bg-black py-2 pl-4 pr-3 font-mono text-sm transition hover:border-green-500 hover:bg-[#030d03]"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-green-300 font-semibold group-hover:text-green-100 transition-colors">
          <span className="text-green-800 select-none">./</span>{repo.name}
          {repo.featured && (
            <span className="ml-2 border border-green-800 px-1 text-[10px] text-green-700">★ featured</span>
          )}
        </span>
        <div className="flex shrink-0 items-center gap-3 text-xs text-green-800">
          <span className="text-green-700">★ {repo.stars ?? 0}</span>
          <span className="text-green-700">⑂ {repo.forks ?? 0}</span>
          {repo.language && <span className="text-green-800">[{repo.language}]</span>}
        </div>
      </div>
      {repo.description && (
        <p className="mt-0.5 text-xs text-green-700 line-clamp-1">
          <span className="select-none text-green-900"># </span>{repo.description}
        </p>
      )}
      {updated && (
        <p className="mt-1 text-[11px] text-green-900">{updated}</p>
      )}
    </a>
  )
}
