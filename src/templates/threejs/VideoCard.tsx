import { useRef, useState } from 'react'
import type { Video } from '../../types/contentTypes'

function parseYouTubeId(url: string): string | null {
  if (!url?.trim()) return null
  try {
    const u = new URL(url.trim())
    if (u.hostname === 'www.youtube.com' || u.hostname === 'youtube.com')
      return u.searchParams.get('v')
    if (u.hostname === 'youtu.be')
      return u.pathname.slice(1).split('/')[0] || null
  } catch {
    // ignore
  }
  return null
}

export default function VideoCard({ video }: { video: Video }) {
  const id = parseYouTubeId(video.videoUrl)
  const thumbnail = video.thumbnail || (id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null)

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
      className="h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }) }}
      style={{
        transform: `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: hovered ? 'transform 0.08s linear' : 'transform 0.35s ease-out',
        willChange: 'transform',
      }}
    >
      <article className="group relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-xl border border-blue-900/40 bg-gradient-to-b from-[#0d1220] to-[#080c18] transition-shadow duration-300 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]">
        {/* Animated top-bar accent */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-blue-500 to-cyan-400 opacity-40 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Corner glow */}
        <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-15" />

        {thumbnail && (
          <a
            href={video.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="relative block aspect-video w-full shrink-0 overflow-hidden bg-[#050509]"
          >
            <img
              src={thumbnail}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-75"
            />
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/90 ring-2 ring-white/20 shadow-[0_0_24px_rgba(59,130,246,0.6)] backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
                <svg className="ml-0.5 h-5 w-5 fill-white" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            {/* Bottom gradient overlay */}
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#080c18] to-transparent opacity-80" />
          </a>
        )}
        {!thumbnail && (
          <a
            href={video.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="relative block aspect-video w-full shrink-0 overflow-hidden bg-[#070b16]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.2),transparent_45%),radial-gradient(circle_at_80%_78%,rgba(59,130,246,0.22),transparent_40%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/80 ring-2 ring-white/20 shadow-[0_0_24px_rgba(59,130,246,0.5)] backdrop-blur-sm">
                <svg className="ml-0.5 h-5 w-5 fill-white" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </a>
        )}

        <div className="flex flex-1 flex-col p-4">
          <h3 className="text-sm font-semibold text-slate-100 leading-snug">
            <a href={video.videoUrl} target="_blank" rel="noreferrer" className="hover:text-blue-300 transition-colors">
              {video.title || 'Video'}
            </a>
          </h3>
          <a
            href={video.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
              <path fill="#050509" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            Watch on YouTube
            <span aria-hidden="true" className="text-slate-600">↗</span>
          </a>
        </div>

        {/* Bottom accent line */}
        <div className="mx-4 mb-4 h-px w-6 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-40 transition-all duration-300 group-hover:w-full group-hover:opacity-60" />
      </article>
    </div>
  )
}
