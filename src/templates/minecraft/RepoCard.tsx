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
      className="group relative block border-2 border-[#3b3b3b] bg-[#8b8b8b] p-3 transition-all hover:border-[#ffffff80] hover:-translate-y-0.5 active:translate-y-0"
    >
      {/* MC-style bevel edges */}
      <div className="pointer-events-none absolute inset-0 border-t-2 border-l-2 border-[#c6c6c6]" />
      <div className="pointer-events-none absolute inset-0 border-b-2 border-r-2 border-[#555555]" />
      {/* Enchantment glint on featured repos */}
      {repo.featured && (
        <div
          className="pointer-events-none absolute inset-0 animate-mc-enchant opacity-30"
          style={{
            backgroundImage: 'linear-gradient(120deg, transparent 30%, rgba(138,205,50,0.35) 50%, transparent 70%)',
            backgroundSize: '200% 100%',
          }}
        />
      )}

      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <span className="font-bold text-white drop-shadow-[2px_2px_0_#3f3f00] group-hover:text-[#ffff55] transition-colors">
            {repo.name}
            {repo.featured && (
              <span className="ml-2 bg-[#5c7a29] px-1 py-0.5 text-[10px] text-white uppercase tracking-wider">★</span>
            )}
          </span>
          <div className="flex shrink-0 items-center gap-3 text-xs text-[#d4d4d4]">
            {(repo.stars ?? 0) > 0 && <span className="text-[#ffaa00]">★ {repo.stars}</span>}
            {(repo.forks ?? 0) > 0 && <span className="text-[#ffaa00]">⑂ {repo.forks}</span>}
            {repo.language && <span className="text-[#a0a0a0]">[{repo.language}]</span>}
          </div>
        </div>
        {repo.description && (
          <p className="mt-1 text-xs text-[#d4d4d4] line-clamp-1">{repo.description}</p>
        )}
        {updated && (
          <p className="mt-1 text-[11px] text-[#a0a0a0]">{updated}</p>
        )}
      </div>
    </a>
  )
}
