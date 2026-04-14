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
  body,
  repos,
}: GitHubSectionProps) {
  if (!repos?.length) return null

  return (
    <section id="github" className="bg-black py-10 font-mono" aria-labelledby="github-title">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-4">
          <p className="text-xs text-green-700 select-none">~/profile ❯ ls -la repos/</p>
          <p id="github-title" className="mt-1 text-green-500 text-sm">
            <span className="text-green-800">total </span>{repos.length}
            {body && <span className="ml-3 text-green-900 text-xs"># {body}</span>}
          </p>
        </div>
        <div className="space-y-px">
          {repos.map((repo) => (
            <RepoCard key={repo.url} repo={repo} />
          ))}
        </div>
      </div>
    </section>
  )
}
