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
const TOOLTIP_STYLE = { backgroundColor: '#111122', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#e2e8f0' }

export default function StatsSection({ stats }: { stats: Stats | null }) {
  if (!stats) return null
  const { metrics, languageDistribution, activityByYear, commitActivityByYear, topReposByStars } = stats

  const metricTiles = [
    { label: metrics.publicRepos !== undefined && metrics.publicRepos < metrics.totalRepos ? `Repos (${metrics.publicRepos} public)` : 'Repositories', value: metrics.totalRepos, accent: 'text-indigo-400' },
    { label: 'Total Stars', value: metrics.totalStars.toLocaleString(), accent: 'text-amber-400' },
    { label: 'Languages', value: metrics.languagesUsed, accent: 'text-blue-400' },
    { label: 'Followers', value: metrics.followers, accent: 'text-emerald-400' },
  ]

  return (
    <section id="stats" className="bg-[#0a0a14] py-8 pb-16" aria-labelledby="stats-title">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-4">
          <h2 id="stats-title" className="text-lg font-bold text-white">Statistics</h2>
          <p className="mt-0.5 text-sm text-slate-400">Key metrics from GitHub profile data.</p>
        </div>

        {/* Metric tiles */}
        <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          {metricTiles.map(({ label, value, accent }) => (
            <div key={label} className="rounded-3xl border border-white/8 bg-[#111122] p-5 text-center">
              <div className={`text-3xl font-bold ${accent}`}>{value}</div>
              <div className="mt-1 text-xs text-slate-500">{label}</div>
            </div>
          ))}
        </div>

        {/* Chart tiles */}
        <div className="grid gap-4 md:grid-cols-2">
          {languageDistribution.length > 0 && (
            <div className="rounded-3xl border border-white/8 bg-[#111122] p-6">
              <h3 className="mb-4 text-sm font-semibold text-white">Language Distribution</h3>
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
            <div className="rounded-3xl border border-white/8 bg-[#111122] p-6">
              <h3 className="mb-4 text-sm font-semibold text-white">Repository Activity</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={activityByYear}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
                  <XAxis dataKey="year" stroke="#475569" style={{ fontSize: '11px' }} />
                  <YAxis stroke="#475569" style={{ fontSize: '11px' }} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="repos" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {commitActivityByYear && commitActivityByYear.length > 0 && (
            <div className="rounded-3xl border border-white/8 bg-[#111122] p-6">
              <h3 className="mb-4 text-sm font-semibold text-white">Commit Activity</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={commitActivityByYear}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
                  <XAxis dataKey="year" stroke="#475569" style={{ fontSize: '11px' }} />
                  <YAxis stroke="#475569" style={{ fontSize: '11px' }} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="commits" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {topReposByStars.length > 0 && (
            <div className="rounded-3xl border border-white/8 bg-[#111122] p-6">
              <h3 className="mb-4 text-sm font-semibold text-white">Top Repos by Stars</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={topReposByStars} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
                  <XAxis type="number" stroke="#475569" style={{ fontSize: '11px' }} />
                  <YAxis type="category" dataKey="name" stroke="#475569" style={{ fontSize: '11px' }} width={90} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="stars" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
