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

const CHART_COLORS = ['#e50914', '#b81d24', '#f40612', '#ff4d4d', '#cc0000', '#990000', '#ff6666', '#ff8080']
const TOOLTIP_STYLE = { backgroundColor: '#1f1f1f', border: '1px solid rgba(229,9,20,0.3)', borderRadius: '4px', color: '#fff' }

export default function StatsSection({ stats }: { stats: Stats | null }) {
  if (!stats) return null
  const { metrics, languageDistribution, activityByYear, commitActivityByYear, topReposByStars } = stats

  const metricTiles = [
    { label: metrics.publicRepos !== undefined && metrics.publicRepos < metrics.totalRepos ? `Repos (${metrics.publicRepos} public)` : 'Repositories', value: metrics.totalRepos },
    { label: 'Total Stars', value: metrics.totalStars.toLocaleString() },
    { label: 'Languages', value: metrics.languagesUsed },
    { label: 'Followers', value: metrics.followers },
  ]

  return (
    <section id="stats" className="bg-[#141414] py-8 pb-16" aria-labelledby="stats-title">
      <div className="mx-auto max-w-6xl px-6">
        <h2 id="stats-title" className="mb-6 text-xl font-bold text-white">By the Numbers</h2>

        {/* Metric tiles */}
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {metricTiles.map(({ label, value }) => (
            <div key={label} className="rounded-sm bg-[#1f1f1f] p-5 text-center">
              <div className="text-3xl font-black text-[#e50914]">{value}</div>
              <div className="mt-1 text-xs font-medium text-[#999]">{label}</div>
            </div>
          ))}
        </div>

        {/* Chart tiles */}
        <div className="grid gap-4 md:grid-cols-2">
          {languageDistribution.length > 0 && (
            <div className="rounded-sm bg-[#1f1f1f] p-6">
              <h3 className="mb-4 text-sm font-bold text-white">Language Distribution</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={languageDistribution} dataKey="count" nameKey="language" cx="50%" cy="50%" outerRadius={75} label={({ language, percentage }) => `${language} (${percentage}%)`}>
                    {languageDistribution.map((_e, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {activityByYear.length > 0 && (
            <div className="rounded-sm bg-[#1f1f1f] p-6">
              <h3 className="mb-4 text-sm font-bold text-white">Repository Activity</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={activityByYear}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="year" stroke="#666" style={{ fontSize: '11px' }} />
                  <YAxis stroke="#666" style={{ fontSize: '11px' }} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="repos" fill="#e50914" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {commitActivityByYear && commitActivityByYear.length > 0 && (
            <div className="rounded-sm bg-[#1f1f1f] p-6">
              <h3 className="mb-4 text-sm font-bold text-white">Commit Activity</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={commitActivityByYear}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="year" stroke="#666" style={{ fontSize: '11px' }} />
                  <YAxis stroke="#666" style={{ fontSize: '11px' }} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="commits" fill="#b81d24" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {topReposByStars.length > 0 && (
            <div className="rounded-sm bg-[#1f1f1f] p-6">
              <h3 className="mb-4 text-sm font-bold text-white">Top Repos by Stars</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={topReposByStars} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis type="number" stroke="#666" style={{ fontSize: '11px' }} />
                  <YAxis type="category" dataKey="name" stroke="#666" style={{ fontSize: '11px' }} width={90} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="stars" fill="#e50914" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
