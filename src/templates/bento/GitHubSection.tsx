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
    <section id="github" className="bg-[#0a0a14] py-8" aria-labelledby="github-title">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-4">
          <h2 id="github-title" className="text-lg font-bold text-white">{title}</h2>
          <p className="mt-0.5 text-sm text-slate-400">{body}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {repos.map((repo) => (
            <RepoCard key={repo.url} repo={repo} />
          ))}
        </div>
      </div>
    </section>
  )
}
