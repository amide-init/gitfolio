import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899']

const TOOLTIP_STYLE = {
  backgroundColor: 'rgba(5,5,15,0.95)',
  border: '1px solid rgba(59,130,246,0.3)',
  borderRadius: '8px',
  color: '#e2e8f0',
  fontSize: '12px',
}

const metricCards = (m: Stats['metrics']) => [
  {
    label: m.publicRepos !== undefined && m.publicRepos < m.totalRepos
      ? `Total Repos (${m.publicRepos} public)`
      : 'Repositories',
    value: m.totalRepos,
    icon: (
      <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
  },
  {
    label: 'Total Stars',
    value: m.totalStars.toLocaleString(),
    icon: (
      <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    label: 'Languages',
    value: m.languagesUsed,
    icon: (
      <svg className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    label: 'Followers',
    value: m.followers,
    icon: (
      <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

export default function StatsSection({ stats }: { stats: Stats | null }) {
  if (!stats) return null
  const { metrics, languageDistribution, activityByYear, commitActivityByYear, topReposByStars } = stats

  return (
    <section
      id="stats"
      className="border-t border-blue-900/30 bg-[#050509] py-16"
      aria-labelledby="stats-title"
    >
      <div className="mx-auto max-w-5xl px-6">
        <header className="mb-10">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-blue-400">
            Developer Statistics
          </p>
          <p className="text-sm leading-relaxed text-slate-400">
            Key metrics and activity insights from GitHub profile data.
          </p>
        </header>

        {/* Metric cards */}
        <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {metricCards(metrics).map(({ label, value, icon }) => (
            <div
              key={label}
              className="rounded-xl border border-blue-900/40 bg-gradient-to-b from-[#0d1220] to-[#080c18] p-4 text-center"
            >
              <div className="mb-2 flex justify-center">{icon}</div>
              <div className="text-2xl font-bold text-slate-100">{value}</div>
              <div className="mt-1 text-[11px] text-slate-400">{label}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          {languageDistribution.length > 0 && (
            <div className="rounded-xl border border-blue-900/40 bg-gradient-to-b from-[#0d1220] to-[#080c18] p-6">
              <h3 className="mb-4 text-sm font-semibold text-slate-100">Language Distribution</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={languageDistribution} dataKey="count" nameKey="language" cx="50%" cy="50%" outerRadius={80} label={({ language, percentage }: LanguageData) => `${language} (${percentage}%)`}>
                    {languageDistribution.map((_entry, i) => (
                      <Cell key={`cell-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {activityByYear.length > 0 && (
            <div className="rounded-xl border border-blue-900/40 bg-gradient-to-b from-[#0d1220] to-[#080c18] p-6">
              <h3 className="mb-4 text-sm font-semibold text-slate-100">Repository Activity</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={activityByYear}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" opacity={0.4} />
                  <XAxis dataKey="year" stroke="#475569" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#475569" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="repos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {commitActivityByYear && commitActivityByYear.length > 0 && (
            <div className="rounded-xl border border-blue-900/40 bg-gradient-to-b from-[#0d1220] to-[#080c18] p-6">
              <h3 className="mb-4 text-sm font-semibold text-slate-100">Commit Activity</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={commitActivityByYear}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" opacity={0.4} />
                  <XAxis dataKey="year" stroke="#475569" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#475569" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="commits" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {topReposByStars.length > 0 && (
          <div className="mt-6 rounded-xl border border-blue-900/40 bg-gradient-to-b from-[#0d1220] to-[#080c18] p-6">
            <h3 className="mb-4 text-sm font-semibold text-slate-100">Top Repositories by Stars</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={topReposByStars} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" opacity={0.4} />
                <XAxis type="number" stroke="#475569" style={{ fontSize: '12px' }} />
                <YAxis type="category" dataKey="name" stroke="#475569" style={{ fontSize: '12px' }} width={90} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="stars" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </section>
  )
}
