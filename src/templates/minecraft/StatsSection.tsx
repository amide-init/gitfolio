type LanguageData = { language: string; count: number; percentage: number }
type ActivityData = { year: number; repos: number }
type CommitActivityData = { year: number; commits: number }
type RepoStarsData = { name: string; stars: number; language: string }

import { useInView } from './useInView'

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

/* Ore-themed colors for bars */
const ORE_COLORS = [
  'bg-[#5c7a29]', // emerald
  'bg-[#5CC0D0]', // diamond
  'bg-[#FF5555]', // redstone
  'bg-[#FFAA00]', // gold
  'bg-[#AAAAAA]', // iron
  'bg-[#3b82f6]', // lapis
  'bg-[#6B4226]', // copper
  'bg-[#d946ef]', // amethyst
]

const BAR_WIDTH = 120

function PixelBar({ pct, colorClass, animate, delay }: { pct: number; colorClass: string; animate?: boolean; delay?: number }) {
  const filled = Math.max(2, Math.round((pct / 100) * BAR_WIDTH))
  return (
    <div className="h-3 relative" style={{ width: BAR_WIDTH }}>
      <div className="absolute inset-0 bg-[#3b3b3b] border border-[#2b2b2b]" />
      <div
        className={`absolute top-0 left-0 h-full ${colorClass} border-r border-[#2b2b2b] ${animate ? 'animate-mc-bar-fill' : ''}`}
        style={{ width: filled, imageRendering: 'pixelated', animationDelay: delay ? `${delay}s` : undefined }}
      />
    </div>
  )
}

function MetricSlot({ label, value }: { label: string; value: number }) {
  return (
    <div className="relative border-2 border-[#3b3b3b] bg-[#6b6b6b] p-3 text-center">
      <div className="pointer-events-none absolute inset-0 border-t border-l border-[#9b9b9b]" />
      <div className="pointer-events-none absolute inset-0 border-b border-r border-[#4b4b4b]" />
      <p className="relative text-lg font-bold text-[#ffff55] drop-shadow-[1px_1px_0_#3f3f00]">
        {value.toLocaleString()}
      </p>
      <p className="relative text-[10px] uppercase tracking-wider text-[#c6c6c6]">{label}</p>
    </div>
  )
}

export default function StatsSection({ stats }: { stats: Stats | null }) {
  const { ref, visible } = useInView()
  if (!stats) return null

  const { metrics, languageDistribution, activityByYear, commitActivityByYear, topReposByStars } = stats

  const maxRepos = Math.max(...activityByYear.map((d) => d.repos), 1)
  const maxCommits = commitActivityByYear?.length
    ? Math.max(...commitActivityByYear.map((d) => d.commits), 1)
    : 1
  const maxStars = Math.max(...topReposByStars.map((d) => d.stars), 1)

  return (
    <section id="stats" className="bg-[#1a1a2e] py-12" aria-labelledby="stats-title">
      <div ref={ref} className="mx-auto max-w-4xl px-6 space-y-8">
        {/* Header */}
        <div>
          <p className="text-xs uppercase tracking-widest text-[#5c7a29] mb-1">📊 Statistics</p>
          <h2 id="stats-title" className="text-xl font-bold text-white drop-shadow-[2px_2px_0_#3f3f00]">
            Player Stats
          </h2>
        </div>

        {/* Metrics — inventory hotbar style */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { label: 'Repos', value: metrics.totalRepos },
            { label: 'Stars', value: metrics.totalStars },
            { label: 'Forks', value: metrics.totalForks },
            { label: 'Followers', value: metrics.followers },
          ].map((m, i) => (
            <div key={m.label} className={visible ? 'animate-mc-place' : 'opacity-0'} style={{ animationDelay: `${i * 0.1}s` }}>
              <MetricSlot label={m.label} value={m.value} />
            </div>
          ))}
        </div>

        {/* Charts in 2-column grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Language distribution */}
          {languageDistribution.length > 0 && (
            <div className="relative border-2 border-[#3b3b3b] bg-[#8b8b8b] p-4">
              <div className="pointer-events-none absolute inset-0 border-t-2 border-l-2 border-[#c6c6c6]" />
              <div className="pointer-events-none absolute inset-0 border-b-2 border-r-2 border-[#555555]" />
              <div className="relative">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#3b3b3b]">Language Ores</p>
                <div className="space-y-2">
                  {languageDistribution.slice(0, 8).map((lang, i) => (
                    <div key={lang.language} className="flex items-center gap-2 text-xs">
                      <span className="w-20 shrink-0 truncate text-[#d4d4d4] font-bold">{lang.language}</span>
                      <PixelBar pct={lang.percentage} colorClass={ORE_COLORS[i % ORE_COLORS.length]} animate={visible} delay={i * 0.1} />
                      <span className="w-8 shrink-0 text-right text-[#a0a0a0]">{lang.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Repo activity by year */}
          {activityByYear.length > 0 && (
            <div className="relative border-2 border-[#3b3b3b] bg-[#8b8b8b] p-4">
              <div className="pointer-events-none absolute inset-0 border-t-2 border-l-2 border-[#c6c6c6]" />
              <div className="pointer-events-none absolute inset-0 border-b-2 border-r-2 border-[#555555]" />
              <div className="relative">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#3b3b3b]">Blocks Placed / Year</p>
                <div className="space-y-2">
                  {activityByYear.map((row) => (
                    <div key={row.year} className="flex items-center gap-2 text-xs">
                      <span className="w-10 shrink-0 text-[#d4d4d4] font-bold">{row.year}</span>
                      <PixelBar pct={(row.repos / maxRepos) * 100} colorClass="bg-[#5CC0D0]" animate={visible} delay={0.2} />
                      <span className="w-6 shrink-0 text-right text-[#a0a0a0]">{row.repos}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Commit activity */}
          {commitActivityByYear && commitActivityByYear.length > 0 && (
            <div className="relative border-2 border-[#3b3b3b] bg-[#8b8b8b] p-4">
              <div className="pointer-events-none absolute inset-0 border-t-2 border-l-2 border-[#c6c6c6]" />
              <div className="pointer-events-none absolute inset-0 border-b-2 border-r-2 border-[#555555]" />
              <div className="relative">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#3b3b3b]">XP Earned / Year</p>
                <div className="space-y-2">
                  {commitActivityByYear.map((row) => (
                    <div key={row.year} className="flex items-center gap-2 text-xs">
                      <span className="w-10 shrink-0 text-[#d4d4d4] font-bold">{row.year}</span>
                      <PixelBar pct={(row.commits / maxCommits) * 100} colorClass="bg-[#5c7a29]" animate={visible} delay={0.2} />
                      <span className="w-10 shrink-0 text-right text-[#a0a0a0]">{row.commits}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Top repos by stars */}
          {topReposByStars.length > 0 && (
            <div className="relative border-2 border-[#3b3b3b] bg-[#8b8b8b] p-4">
              <div className="pointer-events-none absolute inset-0 border-t-2 border-l-2 border-[#c6c6c6]" />
              <div className="pointer-events-none absolute inset-0 border-b-2 border-r-2 border-[#555555]" />
              <div className="relative">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#3b3b3b]">Top Enchanted Repos</p>
                <div className="space-y-2">
                  {topReposByStars.map((repo) => (
                    <div key={repo.name} className="flex items-center gap-2 text-xs">
                      <span className="w-24 shrink-0 truncate text-[#d4d4d4] font-bold">{repo.name}</span>
                      <PixelBar pct={(repo.stars / maxStars) * 100} colorClass="bg-[#FFAA00]" animate={visible} delay={0.2} />
                      <span className="shrink-0 text-[#ffaa00]">★{repo.stars}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
