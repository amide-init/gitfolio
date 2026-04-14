import { useEffect, useRef, useState } from 'react'

interface AnimatedMetricCardProps {
  label: string
  value: number
  displayValue?: string   // optional formatted string (e.g. "1,234")
  sublabel?: string       // e.g. "(88 public)"
  icon: React.ReactNode
  ringColor: string       // CSS colour for the progress ring, e.g. "#3b82f6"
  textColor: string       // tailwind class, e.g. "text-blue-400"
  progress: number        // 0–1, how filled the ring should be
}

const RADIUS = 38
const CIRC = 2 * Math.PI * RADIUS
const STROKE = 4
const SIZE = 96            // svg viewBox dimension

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export default function AnimatedMetricCard({
  label,
  value,
  displayValue,
  sublabel,
  icon,
  ringColor,
  textColor,
  progress,
}: AnimatedMetricCardProps) {
  const [count, setCount]     = useState(0)
  const [fill,  setFill]      = useState(0)   // 0–1 ring progress
  const rafRef  = useRef<number | null>(null)
  const startTs = useRef<number | null>(null)

  const DURATION = 1400   // ms

  useEffect(() => {
    // Kick off on mount (after a tiny delay so it's visible)
    const timeout = setTimeout(() => {
      const tick = (ts: number) => {
        if (!startTs.current) startTs.current = ts
        const elapsed = ts - startTs.current
        const t = Math.min(elapsed / DURATION, 1)
        const eased = easeOutCubic(t)

        setCount(Math.round(eased * value))
        setFill(eased * progress)

        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick)
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }, 150)

    return () => {
      clearTimeout(timeout)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      startTs.current = null
    }
  }, [value, progress])

  const dashOffset = CIRC * (1 - fill)
  const displayed  = displayValue ?? count.toLocaleString()

  return (
    <div className={`group flex flex-col items-center rounded-xl border border-blue-900/40 bg-gradient-to-b from-[#0d1220]/90 to-[#080c18]/90 p-5 backdrop-blur-sm transition hover:border-blue-500/50 hover:shadow-[0_0_28px_rgba(59,130,246,0.18)]`}>
      {/* SVG gauge ring */}
      <div className="relative mb-3">
        <svg
          width={SIZE} height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="-rotate-90"
          aria-hidden="true"
        >
          {/* Track */}
          <circle
            cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
            fill="none"
            stroke="rgba(59,130,246,0.12)"
            strokeWidth={STROKE}
          />
          {/* Glow layer (slightly wider, blurred via filter) */}
          <circle
            cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
            fill="none"
            stroke={ringColor}
            strokeWidth={STROKE + 3}
            strokeDasharray={CIRC}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            opacity={0.25}
            style={{ filter: 'blur(3px)', transition: 'stroke-dashoffset 0.05s linear' }}
          />
          {/* Main ring */}
          <circle
            cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
            fill="none"
            stroke={ringColor}
            strokeWidth={STROKE}
            strokeDasharray={CIRC}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
          />
        </svg>

        {/* Number in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
          <span className={`text-xl font-bold leading-none ${textColor}`}>
            {displayed}
          </span>
          {sublabel && (
            <span className="mt-0.5 text-[9px] text-slate-500 text-center leading-tight px-1">{sublabel}</span>
          )}
        </div>
      </div>

      {/* Icon + label */}
      <div className="flex flex-col items-center gap-1">
        <div className="opacity-70 group-hover:opacity-100 transition-opacity">{icon}</div>
        <p className="text-center text-[11px] leading-tight text-slate-400">{label}</p>
      </div>
    </div>
  )
}
