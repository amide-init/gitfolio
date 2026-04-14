import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'

const HeroScene = lazy(() => import('./HeroScene'))

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

export default function HeroSection({ hero, snapshot }: HeroSectionProps) {
  const desc = hero.minorInfo?.trim() ? hero.minorInfo : hero.description

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
      {/* Three.js WebGL background */}
      <Suspense fallback={<div className="absolute inset-0 bg-[#050509]" />}>
        <HeroScene />
      </Suspense>

      {/* Gradient overlay – fades the 3D scene at the bottom */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050509] to-transparent"
        aria-hidden="true"
      />

      {/* Content overlay */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-24 sm:py-32">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          {hero.eyebrow && (
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-400">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse"
                aria-hidden="true"
              />
              {hero.eyebrow}
            </p>
          )}

          {/* Name / Title */}
          <h1 className="mt-2 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
              {hero.title}
            </span>
          </h1>

          {/* Description */}
          {desc && (
            <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg">
              {desc}
            </p>
          )}

          {/* Snapshot skills */}
          {snapshot?.items?.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {snapshot.items.map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300 backdrop-blur-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          )}

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {hero.primaryCtaHref && (
              <a
                href={hero.primaryCtaHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:from-blue-500 hover:to-cyan-400 hover:shadow-blue-400/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#050509]"
              >
                {hero.primaryCtaLabel || 'View GitHub'}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            )}
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-200 backdrop-blur-sm transition hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-white"
            >
              Projects
            </Link>
          </div>

          {/* Contact info row */}
          <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            {hero.contact?.location && (
              <span className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {hero.contact.location}
              </span>
            )}
            {hero.contact?.email && (
              <a href={`mailto:${hero.contact.email}`} className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                <svg className="h-3.5 w-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {hero.contact.email}
              </a>
            )}
            {websiteUrl && (
              <a href={websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                <svg className="h-3.5 w-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {website}
              </a>
            )}
            {social.map((s) => (
              <a key={s.url} href={s.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-blue-400 transition-colors capitalize">
                {s.provider}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-1 text-[10px] uppercase tracking-widest text-slate-500" aria-hidden="true">
        <span>Scroll</span>
        <svg className="h-4 w-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}
