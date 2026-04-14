import RepoCard from './RepoCard'

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
    <section id="github" className="bg-[#141414] py-8" aria-labelledby="github-title">
      <div className="mx-auto max-w-6xl px-6">
        {/* Row header */}
        <div className="mb-1">
          <h2 id="github-title" className="text-xl font-bold text-white">{title}</h2>
          <p className="text-sm text-[#999]">{body}</p>
        </div>

        {/* Horizontal scroll row */}
        <div
          className="mt-4 flex gap-3 overflow-x-auto pb-4"
          style={{ scrollbarWidth: 'thin' }}
        >
          {repos.map((repo) => (
            <RepoCard key={repo.url} repo={repo} />
          ))}
        </div>
      </div>
    </section>
  )
}
