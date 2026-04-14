import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Blog } from '../../types/contentTypes'

function stripMarkdown(text: string, maxLen: number): string {
  const plain = text
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`[^`]+`/g, '')
    .replace(/\n+/g, ' ')
    .trim()
  if (plain.length <= maxLen) return plain
  return plain.slice(0, maxLen).trim() + '…'
}

function readingTime(text: string): string {
  const words = text.trim().split(/\s+/).length
  const mins = Math.max(1, Math.round(words / 200))
  return `${mins} min read`
}

const ACCENT_COLORS = [
  { bar: 'from-blue-500 to-cyan-400',    dot: 'bg-blue-500',    tag: 'text-blue-400',    glow: 'from-blue-500' },
  { bar: 'from-purple-500 to-pink-400',  dot: 'bg-purple-500',  tag: 'text-purple-400',  glow: 'from-purple-500' },
  { bar: 'from-cyan-500 to-blue-400',    dot: 'bg-cyan-500',    tag: 'text-cyan-400',    glow: 'from-cyan-500' },
  { bar: 'from-emerald-500 to-teal-400', dot: 'bg-emerald-500', tag: 'text-emerald-400', glow: 'from-emerald-500' },
  { bar: 'from-amber-500 to-orange-400', dot: 'bg-amber-500',   tag: 'text-amber-400',   glow: 'from-amber-500' },
  { bar: 'from-pink-500 to-rose-400',    dot: 'bg-pink-500',    tag: 'text-pink-400',    glow: 'from-pink-500' },
]

interface BlogCardProps {
  blog: Blog
  excerptLength?: number
  index?: number
}

export default function BlogCard({ blog, excerptLength = 120, index = 0 }: BlogCardProps) {
  const excerpt = stripMarkdown(blog.content, excerptLength)
  const rt = readingTime(blog.content)
  const c = ACCENT_COLORS[index % ACCENT_COLORS.length]

  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    setTilt({ x: (py - 0.5) * -6, y: (px - 0.5) * 6 })
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }) }}
      style={{
        transform: `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: hovered ? 'transform 0.08s linear' : 'transform 0.35s ease-out',
        willChange: 'transform',
      }}
    >
      <article className="group relative flex flex-col rounded-xl border border-blue-900/40 bg-gradient-to-b from-[#0d1220] to-[#080c18] p-5 transition-shadow duration-300 hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]">
        {/* Animated top-bar accent */}
        <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${c.bar} opacity-40 transition-opacity duration-300 group-hover:opacity-100`} />

        {/* Corner glow */}
        <div className={`pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${c.glow} to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20`} />

        {/* Meta row */}
        <div className="mb-3 flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${c.dot} opacity-70`} />
          <span className={`text-[10px] font-semibold uppercase tracking-widest ${c.tag} opacity-70`}>
            {rt}
          </span>
        </div>

        <h3 className="text-sm font-semibold text-slate-100 leading-snug">
          <Link to={`/blog/${blog.id}`} className="hover:text-blue-300 transition-colors">
            {blog.title || 'Untitled'}
          </Link>
        </h3>

        {excerpt && (
          <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-slate-400 transition-colors group-hover:text-slate-300">
            {excerpt}
          </p>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between">
          <Link
            to={`/blog/${blog.id}`}
            className={`inline-flex items-center gap-1 text-xs font-medium ${c.tag} hover:opacity-100 opacity-70 transition-opacity`}
          >
            Read more
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          {/* Bottom accent line — expands on hover */}
          <div className={`h-px w-6 bg-gradient-to-r ${c.bar} opacity-40 transition-all duration-300 group-hover:w-16 group-hover:opacity-70`} />
        </div>
      </article>
    </div>
  )
}
