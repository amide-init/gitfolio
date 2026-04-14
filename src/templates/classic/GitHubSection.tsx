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
    <section
      id="github"
      className="border-b border-slate-200 bg-slate-50 py-16 dark:border-slate-800 dark:bg-slate-900/50"
      aria-labelledby="github-title"
    >
      <div className="mx-auto max-w-5xl px-6">
        <header className="mb-10">
          <h2
            id="github-title"
            className="text-2xl font-bold text-slate-900 dark:text-slate-50"
          >
            {title}
          </h2>
          <p className="mt-1 text-base text-slate-600 dark:text-slate-300">{body}</p>
        </header>
        <div className="grid gap-5 md:grid-cols-2">
          {repos.map((repo) => (
            <RepoCard key={repo.url} repo={repo} />
          ))}
        </div>
      </div>
    </section>
  )
}
