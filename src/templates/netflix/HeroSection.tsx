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
    <section
      id="hero"
      className="relative min-h-[80vh] flex items-end bg-[#141414] overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Cinematic gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />

      {/* Background avatar as large blurred backdrop */}
      {hero.avatarUrl && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-end pr-12 opacity-20">
          <img
            src={hero.avatarUrl}
            alt=""
            aria-hidden="true"
            className="h-full max-h-[600px] w-auto object-cover blur-sm scale-110"
          />
        </div>
      )}

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-20 pt-32">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#e50914]">
            {hero.eyebrow}
          </p>

          {/* Avatar + Title row */}
          <div className="flex items-center gap-5 mb-4">
            {hero.avatarUrl && (
              <img
                src={hero.avatarUrl}
                alt={`${hero.title} avatar`}
                className="h-20 w-20 rounded-full border-2 border-white/20 object-cover shadow-2xl shrink-0"
              />
            )}
            <h1
              id="hero-title"
              className="text-5xl font-black tracking-tight text-white sm:text-6xl leading-none"
            >
              {hero.title}
            </h1>
          </div>

          {/* Description */}
          {mainDescription && (
            <p className="mb-6 max-w-lg text-base leading-relaxed text-[#d2d2d2]">
              {mainDescription}
            </p>
          )}

          {/* Tech snapshot pills */}
          {snapshot.items.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-2">
              {snapshot.items.map((item) => (
                <span
                  key={item}
                  className="rounded-sm bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          )}

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={hero.primaryCtaHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-sm bg-[#e50914] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#f40612] active:scale-95"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
              {hero.primaryCtaLabel}
            </a>

            {(hero.contact?.email || websiteUrl) && (
              <a
                href={hero.contact?.email ? `mailto:${hero.contact.email}` : websiteUrl!}
                target={hero.contact?.email ? undefined : '_blank'}
                rel={hero.contact?.email ? undefined : 'noreferrer'}
                className="inline-flex items-center gap-2 rounded-sm bg-white/20 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/30 active:scale-95"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
                </svg>
                More Info
              </a>
            )}
          </div>

          {/* Caption & contact row */}
          {(hero.caption || hero.contact?.company || hero.contact?.location || hero.contact?.twitter || social.length > 0 || websiteLabel) && (
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#999]">
              {hero.caption && <span>{hero.caption}</span>}
              {hero.contact?.company && <span>· {hero.contact.company}</span>}
              {hero.contact?.location && <span>· {hero.contact.location}</span>}
              {hero.contact?.twitter && (
                <a
                  href={`https://twitter.com/${hero.contact.twitter}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition"
                >
                  · @{hero.contact.twitter}
                </a>
              )}
              {websiteLabel && websiteUrl && (
                <a href={websiteUrl} target="_blank" rel="noreferrer" className="hover:text-white transition">
                  · {websiteLabel}
                </a>
              )}
              {social.map((acc) => {
                const provider = acc.provider.toLowerCase()
                if ((provider.includes('twitter') || provider === 'x') && hero.contact?.twitter) return null
                return (
                  <a
                    key={`${acc.provider}-${acc.url}`}
                    href={acc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition truncate"
                  >
                    · {acc.url.replace(/^https?:\/\//i, '').replace(/\/$/, '')}
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
