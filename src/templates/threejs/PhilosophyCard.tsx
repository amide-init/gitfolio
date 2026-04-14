import { useRef, useState } from 'react'
import CardShape from './CardShape'
import { SHAPE_KEYS } from './CardShape'

const CARD_COLORS = [
  { hex: '#3b82f6', border: 'hover:border-blue-500/60',    glow: 'hover:shadow-[0_0_32px_rgba(59,130,246,0.22)]',   badge: 'bg-blue-500/15 border-blue-500/40 text-blue-300',    bar: 'from-blue-500 to-cyan-400'    },
  { hex: '#8b5cf6', border: 'hover:border-purple-500/60',  glow: 'hover:shadow-[0_0_32px_rgba(139,92,246,0.22)]',  badge: 'bg-purple-500/15 border-purple-500/40 text-purple-300', bar: 'from-purple-500 to-pink-400'  },
  { hex: '#06b6d4', border: 'hover:border-cyan-500/60',    glow: 'hover:shadow-[0_0_32px_rgba(6,182,212,0.22)]',   badge: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300',      bar: 'from-cyan-500 to-blue-400'    },
  { hex: '#10b981', border: 'hover:border-emerald-500/60', glow: 'hover:shadow-[0_0_32px_rgba(16,185,129,0.22)]',  badge: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300', bar: 'from-emerald-500 to-teal-400' },
  { hex: '#f59e0b', border: 'hover:border-amber-500/60',   glow: 'hover:shadow-[0_0_32px_rgba(245,158,11,0.22)]',  badge: 'bg-amber-500/15 border-amber-500/40 text-amber-300',   bar: 'from-amber-500 to-orange-400' },
  { hex: '#ec4899', border: 'hover:border-pink-500/60',    glow: 'hover:shadow-[0_0_32px_rgba(236,72,153,0.22)]',  badge: 'bg-pink-500/15 border-pink-500/40 text-pink-300',      bar: 'from-pink-500 to-rose-400'    },
]

interface PhilosophyCardProps {
  title: string
  body: string
  index: number
}

export default function PhilosophyCard({ title, body, index }: PhilosophyCardProps) {
  const c = CARD_COLORS[index % CARD_COLORS.length]
  const num = String(index + 1).padStart(2, '0')
  const [isHovered, setIsHovered] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width  // 0..1
    const py = (e.clientY - rect.top)  / rect.height // 0..1
    // Tilt: ±8deg
    setTilt({ x: (py - 0.5) * -8, y: (px - 0.5) * 8 })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTilt({ x: 0, y: 0 })
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: isHovered ? 'transform 0.08s linear' : 'transform 0.35s ease-out',
        animationDelay: `${index * 0.1}s`,
        willChange: 'transform',
      }}
    >
      <article
        className={`group relative overflow-hidden rounded-xl border border-blue-900/40 bg-gradient-to-b from-[#0d1220]/85 to-[#080c18]/85 p-6 backdrop-blur-md transition-shadow duration-300 ${c.border} ${c.glow}`}
      >
        {/* Animated top-bar accent */}
        <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${c.bar} opacity-50 transition-opacity duration-300 group-hover:opacity-100`} />

        {/* Corner glow */}
        <div className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${c.bar} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20`} />

        {/* Spinning 3D wireframe shape — top-right */}
        <div className="absolute right-3 top-3 opacity-60 transition-opacity duration-300 group-hover:opacity-100">
          <CardShape
            index={index % SHAPE_KEYS.length}
            color={c.hex}
            size={72}
            isHovered={isHovered}
          />
        </div>

        {/* Number badge */}
        <div className={`mb-4 inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-widest ${c.badge}`}>
          <span className="opacity-60">#</span>{num}
        </div>

        <h3 className="mb-2.5 pr-16 text-sm font-semibold text-slate-100 transition-colors group-hover:text-white">
          {title}
        </h3>

        <p className="text-[13px] leading-relaxed text-slate-400 transition-colors group-hover:text-slate-300">
          {body}
        </p>

        {/* Bottom accent line — expands on hover */}
        <div className={`mt-4 h-px w-8 bg-gradient-to-r ${c.bar} opacity-50 transition-all duration-300 group-hover:w-full group-hover:opacity-70`} />
      </article>
    </div>
  )
}
