type LanguageData = { language: string; count: number; percentage: number }
type ActivityData = { year: number; repos: number }
type CommitActivityData = { year: number; commits: number }
type RepoStarsData = { name: string; stars: number; language: string }

type Stats = {
  metrics: {
    totalRepos: number
    publicRepos?: number
    totalStars: number
    totalForks: number
    totalOpenIssues: number
    languagesUsed: number
    followers: number
    following: number
  }
  languageDistribution: LanguageData[]
  activityByYear: ActivityData[]
  commitActivityByYear?: CommitActivityData[]
  topReposByStars: RepoStarsData[]
}

const BAR_WIDTH = 22

function AsciiBar({ pct, color = 'text-green-500' }: { pct: number; color?: string }) {
  const filled = Math.round((pct / 100) * BAR_WIDTH)
  const empty = BAR_WIDTH - filled
  return (
    <span className="font-mono text-xs leading-none">
      <span className={color}>{'█'.repeat(filled)}</span>
      <span className="text-green-900/60">{'░'.repeat(empty)}</span>
    </span>
  )
}

const BAR_COLORS = [
  'text-green-400',
  'text-cyan-500',
  'text-blue-500',
  'text-purple-500',
  'text-amber-500',
  'text-pink-500',
  'text-red-500',
  'text-emerald-400',
]

export default function StatsSection({ stats }: { stats: Stats | null }) {
  if (!stats) return null

  const { metrics, languageDistribution, activityByYear, commitActivityByYear, topReposByStars } = stats

  const maxRepos = Math.max(...activityByYear.map((d) => d.repos), 1)
  const maxCommits = commitActivityByYear?.length
    ? Math.max(...commitActivityByYear.map((d) => d.commits), 1)
    : 1
  const maxStars = Math.max(...topReposByStars.map((d) => d.stars), 1)

  return (
    <section id="stats" className="bg-black py-10 font-mono" aria-labelledby="stats-title">
      <div className="mx-auto max-w-4xl px-6 space-y-8">

        {/* Header */}
        <div>
          <p className="text-xs text-green-700 select-none">~/profile ❯ stat --analyze .</p>
          <p id="stats-title" className="mt-1 text-sm text-green-500"># github profile analytics</p>
        </div>

        {/* Metrics row */}
        <div>
          <p className="text-xs text-green-800 mb-2 select-none">{'─'.repeat(52)}</p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs sm:grid-cols-4">
            <Metric label="repos" value={metrics.totalRepos} />
            <Metric label="stars" value={metrics.totalStars} />
            <Metric label="forks" value={metrics.totalForks} />
            <Metric label="followers" value={metrics.followers} />
          </div>
          <p className="text-xs text-green-800 mt-2 select-none">{'─'.repeat(52)}</p>
        </div>

        {/* 2-column chart grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Language distribution */}
          {languageDistribution.length > 0 && (
            <div className="border border-green-900/40 bg-[#030d03] p-4">
              <p className="mb-3 text-xs text-green-600">LANGUAGE_DISTRIBUTION</p>
              <div className="space-y-1.5">
                {languageDistribution.slice(0, 8).map((lang, i) => (
                  <div key={lang.language} className="flex items-center gap-2 text-xs">
                    <span className="w-20 shrink-0 truncate text-green-700">{lang.language}</span>
                    <AsciiBar pct={lang.percentage} color={BAR_COLORS[i % BAR_COLORS.length]} />
                    <span className="w-8 shrink-0 text-right text-green-800">{lang.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Repo activity by year */}
          {activityByYear.length > 0 && (
            <div className="border border-green-900/40 bg-[#030d03] p-4">
              <p className="mb-3 text-xs text-green-600">REPO_ACTIVITY_BY_YEAR</p>
              <div className="space-y-1.5">
                {activityByYear.map((row) => (
                  <div key={row.year} className="flex items-center gap-2 text-xs">
                    <span className="w-10 shrink-0 text-green-700">{row.year}</span>
                    <AsciiBar pct={(row.repos / maxRepos) * 100} color="text-cyan-600" />
                    <span className="w-6 shrink-0 text-right text-green-800">{row.repos}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Commit activity */}
          {commitActivityByYear && commitActivityByYear.length > 0 && (
            <div className="border border-green-900/40 bg-[#030d03] p-4">
              <p className="mb-3 text-xs text-green-600">COMMIT_ACTIVITY_BY_YEAR</p>
              <div className="space-y-1.5">
                {commitActivityByYear.map((row) => (
                  <div key={row.year} className="flex items-center gap-2 text-xs">
                    <span className="w-10 shrink-0 text-green-700">{row.year}</span>
                    <AsciiBar pct={(row.commits / maxCommits) * 100} color="text-emerald-500" />
                    <span className="w-10 shrink-0 text-right text-green-800">{row.commits}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top repos by stars */}
          {topReposByStars.length > 0 && (
            <div className="border border-green-900/40 bg-[#030d03] p-4">
              <p className="mb-3 text-xs text-green-600">TOP_REPOS_BY_STARS</p>
              <div className="space-y-1.5">
                {topReposByStars.map((repo) => (
                  <div key={repo.name} className="flex items-center gap-2 text-xs">
                    <span className="w-24 shrink-0 truncate text-green-700">{repo.name}</span>
                    <AsciiBar pct={(repo.stars / maxStars) * 100} color="text-amber-500" />
                    <span className="shrink-0 text-green-800">★{repo.stars}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-green-900/60 select-none">{'─'.repeat(52)}</p>
      </div>
    </section>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <span className="text-green-800">{label.toUpperCase()}=</span>
      <span className="text-green-400 font-semibold">{value.toLocaleString()}</span>
    </div>
  )
}
