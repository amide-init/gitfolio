import { lazy, Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const HeroScene   = lazy(() => import('./HeroScene'))
const ProfileAvatar = lazy(() => import('./ProfileAvatar'))

type Hero = {
  eyebrow: string
  title: string
  description: string
  minorInfo?: string | null
  primaryCtaLabel: string
  primaryCtaHref: string
  caption: string
  avatarUrl?: string
  contact?: {
    email?: string | null
    location?: string | null
    company?: string | null
    website?: string | null
    twitter?: string | null
    social?: { provider: string; url: string }[]
  }
}

type Snapshot = {
  title: string
  items: string[]
  subtitle?: string | null
}

type HeroSectionProps = {
  hero: Hero
  snapshot: Snapshot
}

// Cycling tag accent colours (border / glow / text)
const TAG_ACCENTS = [
  { border: 'border-blue-500/30',    bg: 'bg-blue-500/10',    text: 'text-blue-300',    glow: 'hover:shadow-[0_0_10px_rgba(59,130,246,0.35)]'   },
  { border: 'border-cyan-500/30',    bg: 'bg-cyan-500/10',    text: 'text-cyan-300',    glow: 'hover:shadow-[0_0_10px_rgba(6,182,212,0.35)]'    },
  { border: 'border-purple-500/30',  bg: 'bg-purple-500/10',  text: 'text-purple-300',  glow: 'hover:shadow-[0_0_10px_rgba(139,92,246,0.35)]'   },
  { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-300', glow: 'hover:shadow-[0_0_10px_rgba(16,185,129,0.35)]'   },
  { border: 'border-pink-500/30',    bg: 'bg-pink-500/10',    text: 'text-pink-300',    glow: 'hover:shadow-[0_0_10px_rgba(236,72,153,0.35)]'   },
  { border: 'border-amber-500/30',   bg: 'bg-amber-500/10',   text: 'text-amber-300',   glow: 'hover:shadow-[0_0_10px_rgba(245,158,11,0.35)]'   },
]

// Social provider → SVG icon
function SocialIcon({ provider }: { provider: string }) {
  const p = provider.toLowerCase()
  if (p === 'github') return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
  if (p === 'twitter' || p === 'x') return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zM17.083 20.5h1.834L7.017 4.127H5.05L17.083 20.5z" />
    </svg>
  )
  if (p === 'linkedin') return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
  if (p === 'youtube') return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
  if (p === 'instagram') return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
  // Generic link icon
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  )
}

// Typewriter hook
function useTypewriter(text: string, speed = 18) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    setDisplayed('')
    setDone(false)
    if (!text) return
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) { clearInterval(id); setDone(true) }
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])
  return { displayed, done }
}

export default function HeroSection({ hero, snapshot }: HeroSectionProps) {
  const desc = hero.minorInfo?.trim() ? hero.minorInfo : hero.description
  const { displayed: typedDesc, done: typeDone } = useTypewriter(desc, 16)

  const website = hero.contact?.website ?? null
  let websiteUrl: string | null = null
  if (website) {
    websiteUrl = /^https?:\/\//i.test(website) ? website : `https://${website}`
  }

  const social = Array.isArray(hero.contact?.social)
    ? hero.contact!.social.filter((s) => s?.url && s?.provider)
    : []

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden bg-[#050509]"
      aria-label="Hero"
    >
      {/* Three.js WebGL background globe */}
      <Suspense fallback={<div className="absolute inset-0 bg-[#050509]" />}>
        <HeroScene location={hero.contact?.location} />
      </Suspense>

      {/* Subtle tech-grid overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 20% 50%, black 30%, transparent 100%)',
        }}
      />

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050509] to-transparent" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-24 sm:py-32">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-12">

          {/* ── Left: text ── */}
          <div className="flex-1 min-w-0">

            {/* Eyebrow */}
            {hero.eyebrow && (
              <p
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-400"
                style={{ animation: 'fadeInRight 0.6s 0.1s ease-out both' }}
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" aria-hidden="true" />
                {hero.eyebrow}
              </p>
            )}

            {/* Name */}
            <h1
              className="mt-2 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl"
              style={{ animation: 'fadeInUp 0.7s 0.2s ease-out both' }}
            >
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #60a5fa 0%, #a5f3fc 40%, #c084fc 100%)',
                  backgroundSize: '200% auto',
                  animation: 'shimmer 4s linear infinite',
                }}
              >
                {hero.title}
              </span>
            </h1>

            {/* Status / available badge */}
            <div
              className="mt-4 inline-flex items-center gap-2"
              style={{ animation: 'fadeInUp 0.7s 0.3s ease-out both' }}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" style={{ animation: 'blink 2s ease-in-out infinite' }} />
                Available
              </span>
              {hero.contact?.company && (
                <span className="text-[11px] text-slate-500">
                  @ <span className="text-slate-400">{hero.contact.company}</span>
                </span>
              )}
            </div>

            {/* Description — typewriter */}
            {desc && (
              <p
                className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg"
                style={{ animation: 'fadeInUp 0.7s 0.4s ease-out both' }}
              >
                {typedDesc}
                {!typeDone && (
                  <span
                    className="ml-0.5 inline-block h-[1.1em] w-0.5 bg-blue-400 align-middle"
                    style={{ animation: 'blink 0.8s step-end infinite' }}
                    aria-hidden="true"
                  />
                )}
              </p>
            )}

            {/* Skill tags */}
            {snapshot?.items?.length > 0 && (
              <div
                className="mt-5 flex flex-wrap gap-2"
                style={{ animation: 'fadeInUp 0.7s 0.55s ease-out both' }}
              >
                {snapshot.items.map((item, i) => {
                  const a = TAG_ACCENTS[i % TAG_ACCENTS.length]
                  return (
                    <span
                      key={item}
                      className={`rounded-md border ${a.border} ${a.bg} px-2.5 py-1 text-xs font-medium ${a.text} ${a.glow} backdrop-blur-sm transition-all duration-200 cursor-default`}
                    >
                      {item}
                    </span>
                  )
                })}
              </div>
            )}

            {/* CTA buttons */}
            <div
              className="mt-8 flex flex-wrap items-center gap-3"
              style={{ animation: 'fadeInUp 0.7s 0.65s ease-out both' }}
            >
              {hero.primaryCtaHref && (
                <a
                  href={hero.primaryCtaHref}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:shadow-blue-400/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#050509]"
                >
                  {/* Shimmer sweep on hover */}
                  <span
                    className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-500 group-hover:translate-x-[150%]"
                    aria-hidden="true"
                  />
                  {hero.primaryCtaLabel || 'View GitHub'}
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              )}
              <Link
                to="/projects"
                className="group inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-200 backdrop-blur-sm transition hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-white"
              >
                Projects
                <svg className="h-3.5 w-3.5 opacity-50 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Contact + social row */}
            <div
              className="mt-7 flex flex-wrap items-center gap-3 text-xs text-slate-400"
              style={{ animation: 'fadeInUp 0.7s 0.75s ease-out both' }}
            >
              {hero.contact?.location && (
                <span className="flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {hero.contact.location}
                </span>
              )}
              {hero.contact?.email && (
                <a href={`mailto:${hero.contact.email}`} className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                  <svg className="h-3.5 w-3.5 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {hero.contact.email}
                </a>
              )}
              {websiteUrl && (
                <a href={websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                  <svg className="h-3.5 w-3.5 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {website}
                </a>
              )}
              {/* Divider before social links */}
              {social.length > 0 && (hero.contact?.location || hero.contact?.email || websiteUrl) && (
                <span className="h-3 w-px bg-slate-700" aria-hidden="true" />
              )}
              {social.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 capitalize hover:text-blue-400 transition-colors"
                  aria-label={s.provider}
                >
                  <SocialIcon provider={s.provider} />
                  <span className="hidden sm:inline">{s.provider}</span>
                </a>
              ))}
            </div>
          </div>

          {/* ── Right: Three.js profile avatar ── */}
          <div
            className="shrink-0 w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80"
            style={{ animation: 'fadeInUp 0.8s 0.3s ease-out both' }}
          >
            <Suspense fallback={
              <div className="w-full h-full rounded-full border border-blue-500/20 bg-blue-900/10 animate-pulse" />
            }>
              <ProfileAvatar avatarUrl={hero.avatarUrl} />
            </Suspense>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-1.5"
        aria-hidden="true"
        style={{ animation: 'fadeInUp 0.7s 1.1s ease-out both' }}
      >
        <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-slate-600">Scroll</span>
        <div className="flex h-8 w-5 items-start justify-center rounded-full border border-slate-700 pt-1.5">
          <div
            className="h-1.5 w-1 rounded-full bg-blue-400"
            style={{ animation: 'fadeInUp 1.2s ease-in-out infinite' }}
          />
        </div>
      </div>
    </section>
  )
}
