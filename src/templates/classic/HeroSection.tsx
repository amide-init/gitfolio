import type React from 'react'

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
  theme: 'dark' | 'light'
}

export default function HeroSection({ hero, snapshot, theme }: HeroSectionProps) {
  const isDark = theme === 'dark'

  const mainDescription =
    (hero.minorInfo && hero.minorInfo.trim().length > 0) || !hero.description
      ? hero.minorInfo || hero.description
      : hero.description

  const websiteRaw = hero.contact?.website ?? null
  let websiteUrl: string | null = null
  let websiteLabel: string | null = null
  let websiteKind: 'linkedin' | 'instagram' | 'twitter' | 'website' | null = null

  const social = Array.isArray(hero.contact?.social)
    ? hero.contact!.social.filter(
        (s) => s && typeof s.url === 'string' && typeof s.provider === 'string',
      )
    : []

  if (websiteRaw) {
    let normalized = websiteRaw.trim()
    if (normalized && !/^https?:\/\//i.test(normalized)) {
      normalized = `https://${normalized}`
    }
    websiteUrl = normalized
    websiteLabel = websiteRaw.replace(/^https?:\/\//i, '').replace(/\/$/, '')
    try {
      const host = new URL(normalized).hostname.toLowerCase()
      if (host.includes('linkedin.com')) websiteKind = 'linkedin'
      else if (host.includes('instagram.com')) websiteKind = 'instagram'
      else if (host.includes('twitter.com') || host.includes('x.com')) websiteKind = 'twitter'
      else websiteKind = 'website'
    } catch {
      websiteKind = 'website'
    }
  }

  return (
    <section
      id="hero"
      className="border-b border-slate-200 bg-white pb-16 pt-20 dark:border-slate-800 dark:bg-slate-900"
      aria-labelledby="hero-title"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:gap-16">
          {/* Left: text content */}
          <div className="flex-1 space-y-6">
            {hero.avatarUrl && (
              <img
                className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-lg dark:border-slate-700"
                src={hero.avatarUrl}
                alt={`${hero.title} avatar`}
              />
            )}
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                {hero.eyebrow}
              </p>
              <h1
                id="hero-title"
                className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl"
              >
                {hero.title}
              </h1>
            </div>
            {mainDescription && (
              <p className="max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
                {mainDescription}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={hero.primaryCtaHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                {hero.primaryCtaLabel}
              </a>
              {hero.caption && (
                <p className="text-sm text-slate-500 dark:text-slate-400">{hero.caption}</p>
              )}
            </div>
          </div>

          {/* Right: profile card */}
          <aside
            className="w-full max-w-xs shrink-0 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/60"
            aria-label="Profile summary"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {snapshot.title}
            </p>
            {snapshot.subtitle && (
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{snapshot.subtitle}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {snapshot.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                >
                  {item}
                </span>
              ))}
            </div>

            {hero.contact && (hero.contact.company || websiteUrl || hero.contact.email || hero.contact.twitter || social.length > 0) && (
              <div className="mt-5 space-y-2 border-t border-slate-200 pt-4 text-sm dark:border-slate-700">
                {hero.contact.company && (
                  <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <span className="text-slate-400">✺</span>
                    {hero.contact.company}
                  </p>
                )}
                {websiteUrl && websiteKind && (
                  <p className="flex items-center gap-2">
                    <SocialBadge kind={websiteKind} />
                    <a href={websiteUrl} target="_blank" rel="noreferrer" className="truncate text-indigo-600 hover:underline dark:text-indigo-400">
                      {websiteLabel}
                    </a>
                  </p>
                )}
                {hero.contact.email && (
                  <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <span className="text-slate-400">@</span>
                    <a href={`mailto:${hero.contact.email}`} className="hover:underline">{hero.contact.email}</a>
                  </p>
                )}
                {hero.contact.twitter && (
                  <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <SocialBadge kind="twitter" />
                    <a href={`https://twitter.com/${hero.contact.twitter}`} target="_blank" rel="noreferrer" className="hover:underline">
                      @{hero.contact.twitter}
                    </a>
                  </p>
                )}
                {social.map((acc) => {
                  const provider = acc.provider.toLowerCase()
                  if ((provider.includes('twitter') || provider === 'x') && hero.contact?.twitter) return null
                  const kind: 'linkedin' | 'instagram' | 'twitter' | 'website' =
                    provider.includes('linkedin') ? 'linkedin'
                    : provider.includes('instagram') ? 'instagram'
                    : provider.includes('twitter') || provider === 'x' ? 'twitter'
                    : 'website'
                  return (
                    <p key={`${acc.provider}-${acc.url}`} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <SocialBadge kind={kind} />
                      <a href={acc.url} target="_blank" rel="noreferrer" className="truncate hover:underline">
                        {acc.url.replace(/^https?:\/\//i, '').replace(/\/$/, '')}
                      </a>
                    </p>
                  )
                })}
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  )
}

function SocialBadge({ kind }: { kind: 'linkedin' | 'instagram' | 'twitter' | 'website' }): React.ReactElement {
  if (kind === 'linkedin') return <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-sky-700 text-[9px] font-bold text-white">in</span>
  if (kind === 'instagram') return <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-gradient-to-tr from-pink-500 to-amber-400 text-[9px] text-white">⧖</span>
  if (kind === 'twitter') return <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-black text-[9px] font-bold text-white">X</span>
  return <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[9px] text-white">⌾</span>
}
