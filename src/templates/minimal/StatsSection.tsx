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

type LanguageData = {
  language: string
  count: number
  percentage: number
}

type ActivityData = {
  year: number
  repos: number
}

type CommitActivityData = {
  year: number
  commits: number
}

type RepoStarsData = {
  name: string
  stars: number
  language: string
}

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

type StatsSectionProps = {
  stats: Stats | null
}

const CHART_COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#f97316',
  '#ec4899',
]

function StatsSection({ stats }: StatsSectionProps) {
  if (!stats) return null

  const {
    metrics,
    languageDistribution,
    activityByYear,
    commitActivityByYear,
    topReposByStars,
  } = stats

  return (
    <section
      id="stats"
      className="border-t border-slate-200 bg-slate-50 py-12 dark:border-slate-800 dark:bg-[#050509]"
      aria-labelledby="stats-title"
    >
      <div className="mx-auto max-w-5xl px-6">
        <header className="mb-8">
          <h2
            id="stats-title"
            className="mb-2 text-xs font-semibold uppercase tracking-[0.26em] text-slate-600 dark:text-slate-300"
          >
            Developer Statistics
          </h2>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            Key metrics and activity insights from GitHub profile data.
          </p>
        </header>

        <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-center dark:border-white/10 dark:bg-gradient-to-b dark:from-[#171824] dark:to-[#10111b]">
            <div className="mb-2 flex justify-center">
              <svg className="h-6 w-6 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{metrics.totalRepos}</div>
            <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              {metrics.publicRepos !== undefined && metrics.publicRepos < metrics.totalRepos
                ? `Total Repos (${metrics.publicRepos} public)`
                : 'Repositories'}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 text-center dark:border-white/10 dark:bg-gradient-to-b dark:from-[#171824] dark:to-[#10111b]">
            <div className="mb-2 flex justify-center">
              <svg className="h-6 w-6 text-amber-500 dark:text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{metrics.totalStars.toLocaleString()}</div>
            <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">Total Stars</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 text-center dark:border-white/10 dark:bg-gradient-to-b dark:from-[#171824] dark:to-[#10111b]">
            <div className="mb-2 flex justify-center">
              <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{metrics.languagesUsed}</div>
            <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">Languages</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 text-center dark:border-white/10 dark:bg-gradient-to-b dark:from-[#171824] dark:to-[#10111b]">
            <div className="mb-2 flex justify-center">
              <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{metrics.followers}</div>
            <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">Followers</div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {languageDistribution.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-gradient-to-b dark:from-[#171824] dark:to-[#10111b]">
              <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-50">Language Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={languageDistribution} dataKey="count" nameKey="language" cx="50%" cy="50%" outerRadius={80} label={({ language, percentage }) => `${language} (${percentage}%)`}>
                    {languageDistribution.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '6px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {activityByYear.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-gradient-to-b dark:from-[#171824] dark:to-[#10111b]">
              <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-50">Repository Activity (Last 5 Years)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={activityByYear}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.2} />
                  <XAxis dataKey="year" stroke="#64748b" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '6px', color: '#fff' }} />
                  <Bar dataKey="repos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {commitActivityByYear && commitActivityByYear.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-gradient-to-b dark:from-[#171824] dark:to-[#10111b]">
              <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-50">Commit Activity (Last 5 Years)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={commitActivityByYear}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.2} />
                  <XAxis dataKey="year" stroke="#64748b" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '6px', color: '#fff' }} />
                  <Bar dataKey="commits" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {topReposByStars.length > 0 && (
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-gradient-to-b dark:from-[#171824] dark:to-[#10111b]">
            <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-50">Top Repositories by Stars</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topReposByStars} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.2} />
                <XAxis type="number" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis type="category" dataKey="name" stroke="#64748b" style={{ fontSize: '12px' }} width={90} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '6px', color: '#fff' }} />
                <Bar dataKey="stars" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </section>
  )
}

export default StatsSection
