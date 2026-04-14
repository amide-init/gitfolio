import { useState, useEffect, useRef, type ReactNode } from 'react'

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

type Block = { cmd: string; output: ReactNode }

const TYPING_SPEED = 48   // ms per character
const OUTPUT_DELAY  = 220 // ms after cmd finishes before output appears
const NEXT_DELAY    = 550 // ms after output before next cmd starts

function PromptLine({ cmd, partial }: { cmd: string; partial?: boolean }) {
  return (
    <p className="leading-6">
      <span className="select-none text-green-700">~/profile </span>
      <span className="select-none text-green-500">❯ </span>
      <span className="text-green-300">{cmd}</span>
      {partial && (
        <span className="ml-px inline-block h-[14px] w-2 translate-y-[2px] animate-pulse bg-green-400" />
      )}
    </p>
  )
}

function Output({ children }: { children: ReactNode }) {
  return <div className="pl-4 text-green-500">{children}</div>
}

export default function HeroSection({ hero, snapshot }: HeroSectionProps) {
  const desc = hero.minorInfo?.trim() || hero.description

  let websiteDisplay = hero.contact?.website ?? null
  if (websiteDisplay) {
    try {
      websiteDisplay = new URL(
        websiteDisplay.startsWith('http') ? websiteDisplay : `https://${websiteDisplay}`,
      ).hostname
    } catch {
      /* keep raw */
    }
  }

  // Build blocks once — data is static after mount
  const blocksRef = useRef<Block[] | null>(null)
  if (!blocksRef.current) {
    const b: Block[] = []

    b.push({
      cmd: 'whoami',
      output: (
        <Output>
          <p id="hero-title" className="text-lg font-bold text-green-200">{hero.title}</p>
          {hero.eyebrow && <p className="mt-0.5 text-xs text-green-700">{hero.eyebrow}</p>}
        </Output>
      ),
    })

    if (desc) {
      b.push({
        cmd: 'cat README.md',
        output: (
          <Output>
            <p className="max-w-xl leading-relaxed text-green-500">{desc}</p>
          </Output>
        ),
      })
    }

    b.push({
      cmd: `cat ${snapshot.title.toLowerCase().replace(/\s+/g, '-')}.txt`,
      output: (
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
      ),
    })

    const hasContact =
      hero.contact?.email ||
      hero.contact?.location ||
      hero.contact?.company ||
      websiteDisplay

    if (hasContact) {
      b.push({
        cmd: 'env | grep USER_INFO',
        output: (
          <Output>
            <div className="space-y-0.5">
              {hero.contact?.company && (
                <p>
                  <span className="text-green-800">COMPANY</span>
                  <span className="text-green-700">=</span>
                  <span className="text-green-400">{hero.contact.company}</span>
                </p>
              )}
              {hero.contact?.location && (
                <p>
                  <span className="text-green-800">LOCATION</span>
                  <span className="text-green-700">=</span>
                  <span className="text-green-400">{hero.contact.location}</span>
                </p>
              )}
              {websiteDisplay && (
                <p>
                  <span className="text-green-800">WEBSITE</span>
                  <span className="text-green-700">=</span>
                  <span className="text-green-400">{websiteDisplay}</span>
                </p>
              )}
              {hero.contact?.email && (
                <p>
                  <span className="text-green-800">EMAIL</span>
                  <span className="text-green-700">=</span>
                  <span className="text-green-400">{hero.contact.email}</span>
                </p>
              )}
            </div>
          </Output>
        ),
      })
    }

    b.push({
      cmd: 'open --url github',
      output: (
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
            <span className="ml-3 text-xs text-green-800"># {hero.caption}</span>
          )}
        </Output>
      ),
    })

    blocksRef.current = b
  }
  const blocks = blocksRef.current

  // Animation state
  const [doneCount, setDoneCount] = useState(0)   // fully completed blocks
  const [typedChars, setTypedChars] = useState(0) // chars typed for current block
  const [showOutput, setShowOutput] = useState(false)
  const cancelRef = useRef(false)

  useEffect(() => {
    if (doneCount >= blocks.length) return

    cancelRef.current = false
    setTypedChars(0)
    setShowOutput(false)

    const cmd = blocks[doneCount].cmd
    let i = 0

    const tick = setInterval(() => {
      if (cancelRef.current) { clearInterval(tick); return }
      i++
      setTypedChars(i)
      if (i >= cmd.length) {
        clearInterval(tick)
        setTimeout(() => {
          if (cancelRef.current) return
          setShowOutput(true)
          setTimeout(() => {
            if (cancelRef.current) return
            setDoneCount((c) => c + 1)
          }, NEXT_DELAY)
        }, OUTPUT_DELAY)
      }
    }, TYPING_SPEED)

    return () => {
      cancelRef.current = true
      clearInterval(tick)
    }
  }, [doneCount, blocks])

  const allDone = doneCount >= blocks.length

  return (
    <section id="hero" className="bg-[#030d03] py-10 font-mono" aria-labelledby="hero-title">
      <div className="mx-auto max-w-4xl px-6">
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
            <p className="text-xs text-green-800">
              Last login: {new Date().toDateString()} on ttys000
            </p>

            {/* Completed blocks */}
            {blocks.slice(0, doneCount).map((block, i) => (
              <div key={i}>
                <PromptLine cmd={block.cmd} />
                {block.output}
              </div>
            ))}

            {/* Currently typing block */}
            {!allDone && (
              <div>
                <PromptLine
                  cmd={blocks[doneCount].cmd.slice(0, typedChars)}
                  partial
                />
                {showOutput && blocks[doneCount].output}
              </div>
            )}

            {/* Final idle cursor */}
            {allDone && (
              <div className="flex items-center gap-1 pt-1">
                <span className="select-none text-green-700">~/profile </span>
                <span className="select-none text-green-500">❯ </span>
                <span className="inline-block h-4 w-2 animate-pulse bg-green-400" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
