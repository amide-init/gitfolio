import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'

const RewindScene = lazy(() => import('./RewindScene'))

// ── Types (mirrors StatsSection / HomePage) ───────────────────────────────
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
  languageDistribution: Array<{ language: string; count: number; percentage: number }>
  activityByYear: Array<{ year: number; repos: number }>
  commitActivityByYear?: Array<{ year: number; commits: number }>
  topReposByStars: Array<{ name: string; stars: number; language: string }>
}

// ── Constants ─────────────────────────────────────────────────────────────
const DURATION    = 5000 // ms per slide
const TOTAL       = 6    // number of slides
// CSS colours per slide — must match SLIDE_HEX order in RewindScene
const ACCENT = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#a78bfa'] as const

// ── Count-up hook ─────────────────────────────────────────────────────────
function useCountUp(target: number, active: boolean, delay = 500) {
  const [n, setN] = useState(0)
  const rafRef   = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    if (!active) { setN(0); return }
    const id = setTimeout(() => {
      startRef.current = null
      const tick = (ts: number) => {
        if (!startRef.current) startRef.current = ts
        const t     = Math.min((ts - startRef.current) / 1800, 1)
        const eased = 1 - Math.pow(1 - t, 3)
        setN(Math.round(eased * target))
        if (t < 1) rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    }, delay)
    return () => {
      clearTimeout(id)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [target, active, delay])

  return n
}

// ── Slide 0 — Intro ───────────────────────────────────────────────────────
function SlideIntro({ color, year }: { color: string; year: number }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center select-none">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.4em]" style={{ color }}>
        Developer Rewind
      </p>
      <div
        className="text-[96px] sm:text-[120px] font-black text-white leading-none"
        style={{ textShadow: `0 0 80px ${color}55, 0 0 20px ${color}30` }}
      >
        {year}
      </div>
      <p className="text-xl font-light text-slate-400 mt-1">A year in code</p>
    </div>
  )
}

// ── Slide 1 — Top Repository ──────────────────────────────────────────────
function SlideTopRepo({
  color,
  repo,
}: {
  color: string
  repo: { name: string; stars: number; language: string } | undefined
}) {
  if (!repo) return <p className="text-slate-500 text-sm">No repository data available.</p>
  return (
    <div className="flex flex-col items-center gap-5 text-center select-none">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.4em]" style={{ color }}>
        Your Top Repository
      </p>
      <div
        className="rounded-2xl px-10 py-7 max-w-sm w-full"
        style={{
          background: `${color}09`,
          border: `1px solid ${color}35`,
          boxShadow: `0 0 50px ${color}18`,
        }}
      >
        <h3
          className="text-3xl sm:text-4xl font-black text-white mb-4 break-all"
          style={{ textShadow: `0 0 30px ${color}70` }}
        >
          {repo.name}
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="flex items-center gap-1.5 font-bold text-amber-400 text-lg">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {repo.stars.toLocaleString()} stars
          </span>
          {repo.language && (
            <span
              className="text-sm font-semibold rounded-full px-3 py-1"
              style={{ background: `${color}18`, color }}
            >
              {repo.language}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Slide 2 — Top Language ────────────────────────────────────────────────
function SlideTopLanguage({
  color,
  lang,
}: {
  color: string
  lang: { language: string; percentage: number } | undefined
}) {
  const [bar, setBar] = useState(0)
  useEffect(() => {
    const id = setTimeout(() => setBar(lang?.percentage ?? 0), 500)
    return () => clearTimeout(id)
  }, [lang])

  if (!lang) return <p className="text-slate-500 text-sm">No language data available.</p>
  return (
    <div className="flex flex-col items-center gap-5 text-center select-none">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.4em]" style={{ color }}>
        Most Used Language
      </p>
      <div
        className="text-5xl sm:text-7xl font-black text-white"
        style={{ textShadow: `0 0 50px ${color}70` }}
      >
        {lang.language}
      </div>
      <div className="w-72 mt-1">
        <div className="flex justify-between text-xs text-slate-500 mb-2">
          <span>Usage share</span>
          <span style={{ color }}>{lang.percentage}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${bar}%`,
              background: `linear-gradient(90deg, ${color}70, ${color})`,
              boxShadow: `0 0 12px ${color}80`,
              transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1)',
            }}
          />
        </div>
        <p className="mt-3 text-sm text-slate-400">of your repositories</p>
      </div>
    </div>
  )
}

// ── Slide 3 — Total Stars ─────────────────────────────────────────────────
function SlideTotalStars({ color, stats, active }: { color: string; stats: Stats; active: boolean }) {
  const n = useCountUp(stats.metrics.totalStars, active)
  return (
    <div className="flex flex-col items-center gap-4 text-center select-none">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.4em]" style={{ color }}>
        Total Stars Earned
      </p>
      <div className="flex items-center gap-4 mt-2">
        <svg
          className="w-14 h-14"
          fill={color}
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{ filter: `drop-shadow(0 0 24px ${color}90)` }}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span
          className="text-7xl sm:text-8xl font-black text-white leading-none tabular-nums"
          style={{ textShadow: `0 0 50px ${color}60` }}
        >
          {n.toLocaleString()}
        </span>
      </div>
      <p className="text-slate-400 text-base mt-1">
        across {stats.metrics.totalRepos} repositories
      </p>
    </div>
  )
}

// ── Slide 4 — Most Active Year ────────────────────────────────────────────
function SlideMostActiveYear({ color, stats, active }: { color: string; stats: Stats; active: boolean }) {
  const peak = [...stats.activityByYear].sort((a, b) => b.repos - a.repos)[0]
  const n    = useCountUp(peak?.repos ?? 0, active)
  if (!peak) return null
  return (
    <div className="flex flex-col items-center gap-4 text-center select-none">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.4em]" style={{ color }}>
        Most Active Year
      </p>
      <div
        className="text-[96px] sm:text-[112px] font-black text-white leading-none"
        style={{ textShadow: `0 0 70px ${color}50` }}
      >
        {peak.year}
      </div>
      <p className="text-2xl text-slate-300">
        <span className="font-black text-3xl" style={{ color }}>{n}</span>{' '}
        repositories shipped
      </p>
    </div>
  )
}

// ── Slide 5 — Outro ───────────────────────────────────────────────────────
function SlideOutro({ color, stats, name }: { color: string; stats: Stats; name?: string }) {
  const year = new Date().getFullYear()
  return (
    <div className="flex flex-col items-center gap-6 text-center select-none">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.4em]" style={{ color }}>
        The Year That Was
      </p>
      <div
        className="text-4xl sm:text-5xl font-black text-white"
        style={{ textShadow: `0 0 50px ${color}50` }}
      >
        Keep shipping.
      </div>
      <div className="grid grid-cols-3 gap-3 mt-1">
        {[
          { label: 'Repos',     val: stats.metrics.totalRepos },
          { label: 'Stars',     val: stats.metrics.totalStars },
          { label: 'Followers', val: stats.metrics.followers },
        ].map(({ label, val }) => (
          <div
            key={label}
            className="rounded-xl px-4 py-3 min-w-[72px]"
            style={{ background: `${color}0d`, border: `1px solid ${color}22` }}
          >
            <div className="text-xl sm:text-2xl font-black" style={{ color }}>
              {val.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider">{label}</div>
          </div>
        ))}
      </div>
      {name && <p className="text-xs text-slate-600 mt-1">{name} · {year}</p>}
    </div>
  )
}

// ── Main section ──────────────────────────────────────────────────────────
export default function RewindSection({
  stats,
  name,
}: {
  stats: Stats | null
  name?: string
}) {
  if (!stats) return null

  const [slide,   setSlide]   = useState(0)
  const [shown,   setShown]   = useState(0)   // lags by fade-out duration
  const [fade,    setFade]    = useState(true) // true = content visible
  const [playing, setPlaying] = useState(true)

  const slideRef   = useRef(0)
  const playingRef = useRef(true)

  useEffect(() => { slideRef.current   = slide   }, [slide])
  useEffect(() => { playingRef.current = playing }, [playing])

  const goTo = useCallback((idx: number) => {
    setFade(false)
    setTimeout(() => {
      setShown(idx)
      setSlide(idx)
      setFade(true)
    }, 280)
  }, [])

  // Auto-advance: restarts whenever `slide` or `playing` changes
  useEffect(() => {
    if (!playing) return
    const id = setTimeout(() => {
      goTo((slideRef.current + 1) % TOTAL)
    }, DURATION)
    return () => clearTimeout(id)
  }, [slide, playing, goTo])

  // Derive display year from data (fallback: current year)
  const year =
    stats.activityByYear.length > 0
      ? Math.max(...stats.activityByYear.map(d => d.year))
      : new Date().getFullYear()

  const color = ACCENT[slide % ACCENT.length]

  // Render the active slide content
  const slideContent = (() => {
    switch (shown) {
      case 0: return <SlideIntro          color={ACCENT[0]} year={year} />
      case 1: return <SlideTopRepo        color={ACCENT[1]} repo={stats.topReposByStars[0]} />
      case 2: return <SlideTopLanguage    color={ACCENT[2]} lang={stats.languageDistribution[0]} />
      case 3: return <SlideTotalStars     color={ACCENT[3]} stats={stats} active={shown === 3} />
      case 4: return <SlideMostActiveYear color={ACCENT[4]} stats={stats} active={shown === 4} />
      case 5: return <SlideOutro          color={ACCENT[5]} stats={stats} name={name} />
      default: return null
    }
  })()

  return (
    <section
      id="rewind"
      className="relative overflow-hidden border-t border-blue-900/30 bg-[#050509]"
      aria-labelledby="rewind-heading"
    >
      {/* CSS keyframe for progress bar */}
      <style>{`
        @keyframes rewindProgress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>

      {/* Three.js background — lazy-loaded, colour-reacts to slide */}
      <Suspense fallback={null}>
        <RewindScene slideIndex={slide} />
      </Suspense>

      {/* Foreground content */}
      <div className="relative z-10 flex min-h-[600px] flex-col">

        {/* Section label */}
        <div className="px-6 pt-14 text-center">
          <p
            id="rewind-heading"
            className="text-[10px] font-bold uppercase tracking-[0.35em] text-blue-400/70"
          >
            Rewind
          </p>
        </div>

        {/* Slide content — fade transition */}
        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div
            style={{
              opacity:   fade ? 1 : 0,
              transform: fade ? 'translateY(0)' : 'translateY(14px)',
              transition: 'opacity 0.28s ease, transform 0.28s ease',
            }}
          >
            {slideContent}
          </div>
        </div>

        {/* Controls row */}
        <div className="flex flex-col items-center gap-4 pb-10 px-6">

          {/* Dot navigation */}
          <div className="flex items-center gap-2.5" role="tablist" aria-label="Rewind slides">
            {Array.from({ length: TOTAL }).map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === slide}
                aria-label={`Slide ${i + 1}`}
                onClick={() => goTo(i)}
                className="rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                style={{
                  width:      i === slide ? '22px' : '6px',
                  height:     '6px',
                  background: i === slide ? color : 'rgba(255,255,255,0.18)',
                  boxShadow:  i === slide ? `0 0 8px ${color}80` : 'none',
                }}
              />
            ))}
          </div>

          {/* Progress bar + play / pause */}
          <div className="flex w-full max-w-xs items-center gap-3">
            <button
              onClick={() => setPlaying(p => !p)}
              className="flex-shrink-0 rounded-full p-1.5 text-slate-500 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              aria-label={playing ? 'Pause rewind' : 'Play rewind'}
            >
              {playing ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Animated progress bar — key forces restart on slide/play change */}
            <div
              className="relative h-px flex-1 rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <div
                key={`${slide}-${playing}`}
                className="absolute inset-y-0 left-0 w-full origin-left rounded-full"
                style={{
                  background:            color,
                  boxShadow:             `0 0 6px ${color}90`,
                  animationName:         playing ? 'rewindProgress' : 'none',
                  animationDuration:     `${DURATION}ms`,
                  animationTimingFunction: 'linear',
                  animationFillMode:     'forwards',
                  transform:             'scaleX(0)',
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
