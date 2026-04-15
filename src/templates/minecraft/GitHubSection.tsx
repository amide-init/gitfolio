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
  body,
  repos,
}: GitHubSectionProps) {
  if (!repos?.length) return null

  return (
    <section id="github" className="bg-[#1a1a2e] py-12" aria-labelledby="github-title">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-[#5c7a29] mb-1">⛏️ Mining Repos</p>
          <h2 id="github-title" className="text-xl font-bold text-white drop-shadow-[2px_2px_0_#3f3f00]">
            GitHub Repositories
          </h2>
          {body && (
            <p className="mt-1 text-sm text-[#a0a0a0]">{body}</p>
          )}
          <p className="mt-1 text-xs text-[#777]">Found {repos.length} repos in world</p>
        </div>
        <div className="grid gap-2">
          {repos.map((repo) => (
            <RepoCard key={repo.url} repo={repo} />
          ))}
        </div>
      </div>
    </section>
  )
}
