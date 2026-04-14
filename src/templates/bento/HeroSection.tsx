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

export default function HeroSection({ hero, snapshot }: HeroSectionProps) {
  const mainDescription =
    (hero.minorInfo && hero.minorInfo.trim().length > 0) || !hero.description
      ? hero.minorInfo || hero.description
      : hero.description

  const websiteRaw = hero.contact?.website ?? null
  let websiteUrl: string | null = null
  let websiteLabel: string | null = null

  if (websiteRaw) {
    let normalized = websiteRaw.trim()
    if (normalized && !/^https?:\/\//i.test(normalized)) normalized = `https://${normalized}`
    websiteUrl = normalized
    websiteLabel = websiteRaw.replace(/^https?:\/\//i, '').replace(/\/$/, '')
  }

  const social = Array.isArray(hero.contact?.social)
    ? hero.contact!.social.filter((s) => s && typeof s.url === 'string' && typeof s.provider === 'string')
    : []

  return (
    <section id="hero" className="bg-[#0a0a14] py-16" aria-labelledby="hero-title">
      <div className="mx-auto max-w-5xl px-6">
        {/* Bento grid: large hero cell + contact sidebar */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Main hero tile — spans 2 cols */}
          <div className="flex flex-col justify-between rounded-3xl border border-white/8 bg-[#111122] p-8 md:col-span-2">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-400">
                {hero.eyebrow}
              </p>
              <div className="flex items-center gap-4">
                {hero.avatarUrl && (
                  <img
                    className="h-14 w-14 rounded-2xl border border-white/10 object-cover"
                    src={hero.avatarUrl}
                    alt={`${hero.title} avatar`}
                  />
                )}
                <h1
                  id="hero-title"
                  className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
                >
                  {hero.title}
                </h1>
              </div>
              {mainDescription && (
                <p className="max-w-lg text-sm leading-relaxed text-slate-400">
                  {mainDescription}
                </p>
              )}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={hero.primaryCtaHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-2xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                {hero.primaryCtaLabel}
              </a>
              {hero.caption && (
                <p className="text-xs text-slate-500">{hero.caption}</p>
              )}
            </div>
          </div>

          {/* Right column: snapshot + contact stacked */}
          <div className="flex flex-col gap-4">
            {/* Snapshot tile */}
            <div className="rounded-3xl border border-white/8 bg-[#111122] p-6">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                {snapshot.title}
              </p>
              <div className="flex flex-wrap gap-2">
                {snapshot.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-xl bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-300 ring-1 ring-white/8"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact tile */}
            {hero.contact && (hero.contact.company || websiteUrl || hero.contact.email || hero.contact.twitter || social.length > 0) && (
              <div className="flex-1 rounded-3xl border border-white/8 bg-[#111122] p-6">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Contact</p>
                <div className="space-y-2 text-xs text-slate-400">
                  {hero.contact.company && <p>✺ {hero.contact.company}</p>}
                  {websiteUrl && (
                    <p><a href={websiteUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">⌾ {websiteLabel}</a></p>
                  )}
                  {hero.contact.email && (
                    <p><a href={`mailto:${hero.contact.email}`} className="hover:underline">@ {hero.contact.email}</a></p>
                  )}
                  {hero.contact.twitter && (
                    <p><a href={`https://twitter.com/${hero.contact.twitter}`} target="_blank" rel="noreferrer" className="hover:underline">𝕏 @{hero.contact.twitter}</a></p>
                  )}
                  {social.map((acc) => {
                    const provider = acc.provider.toLowerCase()
                    if ((provider.includes('twitter') || provider === 'x') && hero.contact?.twitter) return null
                    return (
                      <p key={`${acc.provider}-${acc.url}`}>
                        <a href={acc.url} target="_blank" rel="noreferrer" className="hover:underline truncate block">
                          ⌾ {acc.url.replace(/^https?:\/\//i, '').replace(/\/$/, '')}
                        </a>
                      </p>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
