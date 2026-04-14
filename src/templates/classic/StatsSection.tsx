import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

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

const CHART_COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#f97316','#ec4899']

export default function StatsSection({ stats }: { stats: Stats | null }) {
  if (!stats) return null
  const { metrics, languageDistribution, activityByYear, commitActivityByYear, topReposByStars } = stats

  const metricCards = [
    { label: metrics.publicRepos !== undefined && metrics.publicRepos < metrics.totalRepos ? `Total Repos (${metrics.publicRepos} public)` : 'Repositories', value: metrics.totalRepos, color: 'text-indigo-600 dark:text-indigo-400' },
    { label: 'Total Stars', value: metrics.totalStars.toLocaleString(), color: 'text-amber-500' },
    { label: 'Languages', value: metrics.languagesUsed, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Followers', value: metrics.followers, color: 'text-emerald-600 dark:text-emerald-400' },
  ]

  return (
    <section
      id="stats"
      className="border-b border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900"
      aria-labelledby="stats-title"
    >
      <div className="mx-auto max-w-5xl px-6">
        <header className="mb-10">
          <h2 id="stats-title" className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Developer Statistics
          </h2>
          <p className="mt-1 text-base text-slate-600 dark:text-slate-300">
            Key metrics and activity insights from GitHub profile data.
          </p>
        </header>

        <div className="mb-10 grid grid-cols-2 gap-5 md:grid-cols-4">
          {metricCards.map(({ label, value, color }) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
              <div className={`text-3xl font-bold ${color}`}>{value}</div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {languageDistribution.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
              <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-50">Language Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={languageDistribution} dataKey="count" nameKey="language" cx="50%" cy="50%" outerRadius={80} label={({ language, percentage }) => `${language} (${percentage}%)`}>
                    {languageDistribution.map((_e, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {activityByYear.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
              <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-50">Repository Activity</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={activityByYear}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a' }} />
                  <Bar dataKey="repos" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {commitActivityByYear && commitActivityByYear.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
              <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-50">Commit Activity</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={commitActivityByYear}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a' }} />
                  <Bar dataKey="commits" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {topReposByStars.length > 0 && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
            <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-50">Top Repositories by Stars</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topReposByStars} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" style={{ fontSize: '12px' }} width={90} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a' }} />
                <Bar dataKey="stars" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </section>
  )
}
