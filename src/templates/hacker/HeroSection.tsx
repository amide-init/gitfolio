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

type Snapshot = { title: string; items: string[]; subtitle?: string | null }
type HeroSectionProps = { hero: Hero; snapshot: Snapshot; theme: 'dark' | 'light' }

function Prompt({ cmd }: { cmd: string }) {
  return (
    <p className="leading-6">
      <span className="select-none text-green-700">~/profile </span>
      <span className="select-none text-green-500">❯ </span>
      <span className="text-green-300">{cmd}</span>
    </p>
  )
}

function Output({ children }: { children: React.ReactNode }) {
  return <div className="pl-4 text-green-500">{children}</div>
}

export default function HeroSection({ hero, snapshot }: HeroSectionProps) {
  const desc = hero.minorInfo?.trim() || hero.description
  const websiteRaw = hero.contact?.website ?? null
  let websiteDisplay = websiteRaw
  if (websiteRaw) {
    try {
      websiteDisplay = new URL(
        websiteRaw.startsWith('http') ? websiteRaw : `https://${websiteRaw}`,
      ).hostname
    } catch {
      websiteDisplay = websiteRaw
    }
  }

  return (
    <section id="hero" className="bg-[#030d03] py-10 font-mono" aria-labelledby="hero-title">
      <div className="mx-auto max-w-4xl px-6">
        {/* Terminal chrome */}
        <div className="overflow-hidden rounded-none border border-green-900/70 shadow-[0_0_30px_rgba(0,255,65,0.04)]">
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-green-900/70 bg-black px-4 py-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
            <span className="ml-4 flex-1 text-center text-xs text-green-800">
              {hero.contact?.location ?? 'localhost'} — bash — 80×24
            </span>
          </div>

          {/* Terminal body */}
          <div className="space-y-3 bg-black p-6 text-sm leading-relaxed">
            {/* Last login line */}
            <p className="text-green-800 text-xs">
              Last login: {new Date().toDateString()} on ttys000
            </p>

            <Prompt cmd="whoami" />
            <Output>
              <p id="hero-title" className="text-lg font-bold text-green-200">{hero.title}</p>
              {hero.eyebrow && <p className="text-green-700 text-xs mt-0.5">{hero.eyebrow}</p>}
            </Output>

            {desc && (
              <>
                <Prompt cmd="cat README.md" />
                <Output>
                  <p className="max-w-xl text-green-500 leading-relaxed">{desc}</p>
                </Output>
              </>
            )}

            <Prompt cmd={`cat ${snapshot.title.toLowerCase().replace(/\s+/g, '-')}.txt`} />
            <Output>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {snapshot.items.map((item) => (
                  <span key={item}>
                    <span className="text-green-800">→ </span>
                    <span className="text-green-400">{item}</span>
                  </span>
                ))}
              </div>
            </Output>

            {(hero.contact?.email || hero.contact?.location || hero.contact?.company || websiteDisplay) && (
              <>
                <Prompt cmd="env | grep USER_INFO" />
                <Output>
                  <div className="space-y-0.5">
                    {hero.contact?.company && (
                      <p><span className="text-green-800">COMPANY</span><span className="text-green-700">=</span><span className="text-green-400">{hero.contact.company}</span></p>
                    )}
                    {hero.contact?.location && (
                      <p><span className="text-green-800">LOCATION</span><span className="text-green-700">=</span><span className="text-green-400">{hero.contact.location}</span></p>
                    )}
                    {websiteDisplay && (
                      <p><span className="text-green-800">WEBSITE</span><span className="text-green-700">=</span><span className="text-green-400">{websiteDisplay}</span></p>
                    )}
                    {hero.contact?.email && (
                      <p><span className="text-green-800">EMAIL</span><span className="text-green-700">=</span><span className="text-green-400">{hero.contact.email}</span></p>
                    )}
                  </div>
                </Output>
              </>
            )}

            <Prompt cmd="open --url github" />
            <Output>
              <a
                href={hero.primaryCtaHref}
                target="_blank"
                rel="noreferrer"
                className="text-green-300 underline underline-offset-2 transition hover:text-white"
              >
                {hero.primaryCtaHref}
              </a>
              {hero.caption && (
                <span className="ml-3 text-green-800 text-xs"># {hero.caption}</span>
              )}
            </Output>

            {/* Blinking cursor */}
            <div className="flex items-center gap-1 pt-1">
              <span className="select-none text-green-700">~/profile </span>
              <span className="select-none text-green-500">❯ </span>
              <span className="inline-block h-4 w-2 animate-pulse bg-green-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
