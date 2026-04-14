import { lazy, Suspense } from 'react'
import type { BarDatum } from './ThreeBarChart'
import { PIE_COLORS } from './ThreePieChart'
import AnimatedMetricCard from './AnimatedMetricCard'

const ParticleField = lazy(() => import('./ParticleField'))
const ThreeBarChart = lazy(() => import('./ThreeBarChart'))
const ThreePieChart = lazy(() => import('./ThreePieChart'))

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



export default function StatsSection({ stats }: { stats: Stats | null }) {
  if (!stats) return null
  const { metrics, languageDistribution, activityByYear, commitActivityByYear, topReposByStars } = stats

  const pieData = languageDistribution.map((d) => ({
    label: d.language,
    value: d.count,
    percentage: d.percentage,
  }))

  const repoActivityData: BarDatum[] = activityByYear.map((d) => ({
    label: String(d.year),
    value: d.repos,
  }))

  const commitActivityData: BarDatum[] = (commitActivityByYear ?? []).map((d) => ({
    label: String(d.year),
    value: d.commits,
  }))

  const topReposData: BarDatum[] = topReposByStars.map((d) => ({
    label: d.name,
    value: d.stars,
  }))

  return (
    <section
      id="stats"
      className="relative overflow-hidden border-t border-blue-900/30 bg-[#050509] py-16"
      aria-labelledby="stats-title"
    >
      <Suspense fallback={null}>
        <ParticleField count={45} color={0x3b82f6} opacity={0.25} />
      </Suspense>

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <header className="mb-10">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-blue-400">
            Developer Statistics
          </p>
          <p className="text-sm leading-relaxed text-slate-400">
            Key metrics and activity insights from GitHub profile data.
          </p>
        </header>

        {/* Metric cards — animated gauge rings */}
        <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          <AnimatedMetricCard
            label="Repositories"
            value={metrics.totalRepos}
            sublabel={metrics.publicRepos !== undefined && metrics.publicRepos < metrics.totalRepos ? `${metrics.publicRepos} public` : undefined}
            progress={Math.min(metrics.totalRepos / 150, 1)}
            ringColor="#3b82f6"
            textColor="text-blue-400"
            icon={
              <svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            }
          />
          <AnimatedMetricCard
            label="Total Stars"
            value={metrics.totalStars}
            progress={Math.min(metrics.totalStars / 500, 1)}
            ringColor="#f59e0b"
            textColor="text-amber-400"
            icon={
              <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            }
          />
          <AnimatedMetricCard
            label="Languages"
            value={metrics.languagesUsed}
            progress={Math.min(metrics.languagesUsed / 20, 1)}
            ringColor="#06b6d4"
            textColor="text-cyan-400"
            icon={
              <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            }
          />
          <AnimatedMetricCard
            label="Followers"
            value={metrics.followers}
            progress={Math.min(metrics.followers / 500, 1)}
            ringColor="#10b981"
            textColor="text-emerald-400"
            icon={
              <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
        </div>

        {/* Charts grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Language distribution — Three.js 3D pie + animated skill bars */}
          {pieData.length > 0 && (
            <div className="rounded-xl border border-blue-900/40 bg-gradient-to-b from-[#0d1220]/90 to-[#080c18]/90 p-6 backdrop-blur-sm">
              <h3 className="mb-1 text-sm font-semibold text-slate-100">Language Distribution</h3>
              <p className="mb-4 text-[11px] text-slate-500">Repos by primary language — hover slices for details</p>
              <Suspense fallback={<div className="h-[260px] animate-pulse rounded-lg bg-blue-900/10" />}>
                <ThreePieChart data={pieData} colors={PIE_COLORS} height={260} />
              </Suspense>

              {/* Animated skill bars */}
              <div className="mt-5 space-y-2.5">
                {pieData.slice(0, 6).map((d, i) => {
                  const barColor = `#${PIE_COLORS[i % PIE_COLORS.length].toString(16).padStart(6, '0')}`
                  return (
                    <div key={d.label}>
                      <div className="mb-1 flex justify-between text-[11px]">
                        <span className="font-medium text-slate-300">{d.label}</span>
                        <span className="text-slate-500">{d.percentage}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${d.percentage}%`,
                            background: `linear-gradient(90deg, ${barColor}99, ${barColor})`,
                            boxShadow: `0 0 6px ${barColor}80`,
                            animation: `growBar 1.2s ${i * 0.08}s ease-out both`,
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Repository Activity — Three.js 3D bars */}
          {repoActivityData.length > 0 && (
            <div className="rounded-xl border border-blue-900/40 bg-gradient-to-b from-[#0d1220]/90 to-[#080c18]/90 p-6 backdrop-blur-sm">
              <h3 className="mb-1 text-sm font-semibold text-slate-100">Repository Activity</h3>
              <p className="mb-4 text-[11px] text-slate-500">New repos created per year — hover bars for details</p>
              <Suspense fallback={<div className="h-[260px] animate-pulse rounded-lg bg-blue-900/10" />}>
                <ThreeBarChart data={repoActivityData} barColor={0x3b82f6} accentColor={0x06b6d4} height={260} />
              </Suspense>
            </div>
          )}

          {/* Commit Activity — Three.js 3D bars */}
          {commitActivityData.length > 0 && (
            <div className="rounded-xl border border-blue-900/40 bg-gradient-to-b from-[#0d1220]/90 to-[#080c18]/90 p-6 backdrop-blur-sm">
              <h3 className="mb-1 text-sm font-semibold text-slate-100">Commit Activity</h3>
              <p className="mb-4 text-[11px] text-slate-500">Commits per year — hover bars for details</p>
              <Suspense fallback={<div className="h-[260px] animate-pulse rounded-lg bg-emerald-900/10" />}>
                <ThreeBarChart data={commitActivityData} barColor={0x10b981} accentColor={0x34d399} height={260} />
              </Suspense>
            </div>
          )}
        </div>

        {/* Top repos by stars — Three.js 3D bars (full width) */}
        {topReposData.length > 0 && (
          <div className="mt-6 rounded-xl border border-blue-900/40 bg-gradient-to-b from-[#0d1220]/90 to-[#080c18]/90 p-6 backdrop-blur-sm">
            <h3 className="mb-1 text-sm font-semibold text-slate-100">Top Repositories by Stars</h3>
            <p className="mb-4 text-[11px] text-slate-500">Hover bars to see star count</p>
            <Suspense fallback={<div className="h-[260px] animate-pulse rounded-lg bg-purple-900/10" />}>
              <ThreeBarChart data={topReposData} barColor={0x8b5cf6} accentColor={0xa78bfa} height={260} />
            </Suspense>
          </div>
        )}
      </div>
    </section>
  )
}
