import { useMemo, useRef, useState } from 'react'
import type { Project } from '../../types/contentTypes'
import CardShape, { SHAPE_KEYS } from './CardShape'

const PREVIEW_COLORS = [
  { hex: '#3b82f6', bar: 'from-blue-500 to-cyan-400', glow: 'from-blue-500' },
  { hex: '#8b5cf6', bar: 'from-purple-500 to-pink-400', glow: 'from-purple-500' },
  { hex: '#06b6d4', bar: 'from-cyan-500 to-blue-400', glow: 'from-cyan-500' },
  { hex: '#10b981', bar: 'from-emerald-500 to-teal-400', glow: 'from-emerald-500' },
  { hex: '#f59e0b', bar: 'from-amber-500 to-orange-400', glow: 'from-amber-500' },
  { hex: '#ec4899', bar: 'from-pink-500 to-rose-400', glow: 'from-pink-500' },
]
const MAX_VISIBLE_LINKS = 2
const VALID_HOSTNAME_PATTERN = /^[a-z0-9.-]+$/i
const WORDPRESS_MSHOTS_BASE = 'https://s.wordpress.com/mshots/v1/'
const WEB_PREVIEW_WIDTH = 1200

function hashTitle(title: string): number {
  let hash = 0
  // 31 is a common prime multiplier for lightweight deterministic string hashing.
  for (let i = 0; i < title.length; i += 1) hash = (hash * 31 + title.charCodeAt(i)) >>> 0
  return hash
}

function fallbackLinkText(url: string): string {
  try {
    const { hostname, pathname } = new URL(url)
    const cleanHost = hostname.replace(/^www\./, '')
    const cleanPath = pathname === '/' ? '' : pathname
    return `${cleanHost}${cleanPath}`
  } catch {
    return url
  }
}

function getPreviewImageUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (!['http:', 'https:'].includes(parsed.protocol)) return null

    const host = parsed.hostname.toLowerCase()
    if (host === 'github.com') {
      const [owner, repo] = parsed.pathname.split('/').filter(Boolean)
      if (owner && repo) {
        return `https://opengraph.githubassets.com/1/${owner}/${repo}`
      }
      return null
    }

    return `${WORDPRESS_MSHOTS_BASE}${encodeURIComponent(parsed.toString())}?w=${WEB_PREVIEW_WIDTH}`
  } catch {
    return null
  }
}

export default function ProjectCard({ project }: { project: Project }) {
  const seed = hashTitle(project.title || project.id)
  const color = PREVIEW_COLORS[seed % PREVIEW_COLORS.length]
  const previewLink = project.links?.find((link) => link.url)?.url
  const previewImageUrl = useMemo(
    () => (previewLink ? getPreviewImageUrl(previewLink) : null),
    [previewLink],
  )
  const host = previewLink
    ? (() => {
        try {
          const hostname = new URL(previewLink).hostname.replace(/^www\./, '')
          return VALID_HOSTNAME_PATTERN.test(hostname) ? hostname : null
        } catch {
          // Ignore invalid URLs from user content and continue without hostname text.
          return null
        }
      })()
    : null
  const [failedPreviewUrl, setFailedPreviewUrl] = useState<string | null>(null)
  const previewFailed = !!previewImageUrl && failedPreviewUrl === previewImageUrl

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
      onMouseLeave={() => {
        setHovered(false)
        setTilt({ x: 0, y: 0 })
      }}
      style={{
        transform: `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: hovered ? 'transform 0.08s linear' : 'transform 0.35s ease-out',
        willChange: 'transform',
      }}
    >
      <article className="group relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-xl border border-blue-900/40 bg-gradient-to-b from-[#0d1220] to-[#080c18] transition-shadow duration-300 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]">
        <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${color.bar} opacity-50 transition-opacity duration-300 group-hover:opacity-100`} />
        <div className={`pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${color.glow} to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20`} />

        <div className="relative h-36 overflow-hidden border-b border-blue-900/30 bg-[#070b16]">
          {previewImageUrl && !previewFailed ? (
            <img
              src={previewImageUrl}
              alt={`${project.title || 'Project'} preview`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              referrerPolicy="no-referrer"
              onError={() => setFailedPreviewUrl(previewImageUrl)}
            />
          ) : (
            <>
              <div className={`absolute inset-0 bg-gradient-to-br ${color.bar} opacity-10`} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.18),transparent_46%),radial-gradient(circle_at_85%_78%,rgba(255,255,255,0.12),transparent_42%)]" />
            </>
          )}
          <div className="absolute left-3 top-3 rounded-full border border-blue-300/25 bg-[#070b16]/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-200/85 backdrop-blur-sm">
            Preview
          </div>
          {(!previewImageUrl || previewFailed) && (
            <div className="absolute right-2 top-2 opacity-75 transition-opacity group-hover:opacity-100">
              <CardShape index={seed % SHAPE_KEYS.length} color={color.hex} size={64} isHovered={hovered} />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#080c18] to-transparent" />
          <h3 className="absolute bottom-3 left-3 right-3 line-clamp-2 text-sm font-semibold leading-snug text-slate-100">
            {project.title || 'Untitled'}
          </h3>
        </div>

        <div className="flex flex-1 flex-col p-4">
          {project.description && (
            <p className="line-clamp-3 text-[13px] leading-relaxed text-slate-400 transition-colors group-hover:text-slate-300">
              {project.description}
            </p>
          )}
          {project.links && project.links.length > 0 && (
            <div className="mt-auto flex flex-wrap gap-2 pt-4">
              {project.links.slice(0, MAX_VISIBLE_LINKS).map((link, i) =>
                link.url ? (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-blue-500/25 bg-blue-500/10 px-2.5 py-1 text-[11px] font-medium text-blue-300 transition hover:border-blue-400/40 hover:bg-blue-500/20"
                  >
                    {link.label || fallbackLinkText(link.url)}
                    <span aria-hidden="true">↗</span>
                  </a>
                ) : null,
              )}
            </div>
          )}
          {host && <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-slate-500">{host}</p>}
        </div>
      </article>
    </div>
  )
}
