import { useState, useEffect, useRef } from 'react'
import FloatingParticles from './FloatingParticles'

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

/* Minecraft dirt-like colors */
const BLOCK_COLORS = [
  '#6B8E3E', // grass green
  '#8B6E4E', // dirt brown
  '#7B7B7B', // stone gray
  '#4A6B2F', // dark grass
  '#5D4037', // dark wood
  '#9E9E6E', // sand
  '#5C6BC0', // diamond
  '#3E7E3E', // leaves
]

function BlockGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const BLOCK_SIZE = 16
    let cols = Math.ceil(canvas.width / BLOCK_SIZE)
    let rows = Math.ceil(canvas.height / BLOCK_SIZE)

    // Generate block grid
    let grid: number[][] = []
    function initGrid() {
      cols = Math.ceil(canvas!.width / BLOCK_SIZE)
      rows = Math.ceil(canvas!.height / BLOCK_SIZE)
      grid = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => Math.floor(Math.random() * BLOCK_COLORS.length))
      )
    }

    function resize() {
      canvas!.width = canvas!.offsetWidth
      canvas!.height = canvas!.offsetHeight
      initGrid()
    }

    resize()
    window.addEventListener('resize', resize)

    let t = 0
    function draw() {
      animRef.current = requestAnimationFrame(draw)
      t++

      // Slowly change random blocks
      if (t % 8 === 0) {
        const r = Math.floor(Math.random() * rows)
        const c = Math.floor(Math.random() * cols)
        if (grid[r]) grid[r][c] = Math.floor(Math.random() * BLOCK_COLORS.length)
      }

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const colorIdx = grid[r]?.[c] ?? 0
          ctx!.fillStyle = BLOCK_COLORS[colorIdx]
          ctx!.globalAlpha = 0.08
          ctx!.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1)
        }
      }
      // Fade overlay
      ctx!.globalAlpha = 0.03
      ctx!.fillStyle = '#1a1a2e'
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height)
      ctx!.globalAlpha = 1
    }

    draw()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}

/* Typewriter text animation */
function TypewriterText({ text, speed = 50 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    setDisplayed('')
    setDone(false)
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        setDone(true)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed])

  return (
    <span>
      {displayed}
      {!done && <span className="ml-0.5 inline-block w-2.5 h-5 bg-[#5c7a29] animate-pulse align-middle" />}
    </span>
  )
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

  return (
    <section id="hero" className="relative bg-[#1a1a2e] py-16 overflow-hidden" aria-labelledby="hero-title">
      <BlockGrid />
      <FloatingParticles />

      {/* Dirt block border at the top */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#6B8E3E] via-[#8B6E4E] to-[#6B8E3E]" style={{ imageRendering: 'pixelated' }} />

      <div className="relative mx-auto max-w-4xl px-6">
        {/* Main panel — styled like the Minecraft inventory UI */}
        <div className="relative border-4 border-[#3b3b3b] bg-[#c6c6c6] p-1 animate-mc-fade-up">
          {/* Inner bevel */}
          <div className="border-2 border-t-[#ffffff80] border-l-[#ffffff80] border-b-[#555555] border-r-[#555555] bg-[#8b8b8b] p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Avatar block */}
              {hero.avatarUrl && (
                <div className="shrink-0">
                  <div className="relative border-4 border-[#3b3b3b] bg-[#555555]">
                    <div className="pointer-events-none absolute inset-0 border-t-2 border-l-2 border-[#7b7b7b]" />
                    <img
                      src={hero.avatarUrl}
                      alt=""
                      className="h-24 w-24 sm:h-32 sm:w-32 object-cover"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>
                </div>
              )}

              <div className="flex-1 min-w-0">
                {hero.eyebrow && (
                  <p className="text-xs uppercase tracking-widest text-[#555555] mb-1">{hero.eyebrow}</p>
                )}
                <h1 id="hero-title" className="text-2xl sm:text-3xl font-bold text-white drop-shadow-[2px_2px_0_#3f3f00]">
                  <TypewriterText text={hero.title} speed={60} />
                </h1>
                {desc && (
                  <p className="mt-3 text-sm text-[#d4d4d4] leading-relaxed max-w-lg">{desc}</p>
                )}

                {/* Skills as inventory slots */}
                {snapshot.items.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-[#555555] uppercase tracking-wider mb-2">{snapshot.title}</p>
                    <div className="flex flex-wrap gap-1">
                      {snapshot.items.map((item, i) => (
                        <span
                          key={item}
                          className="relative inline-block border-2 border-[#3b3b3b] bg-[#6b6b6b] px-2 py-1 text-xs text-[#5c7a29] font-bold animate-mc-place hover:animate-mc-item-bob"
                          style={{ animationDelay: `${0.5 + i * 0.06}s` }}
                        >
                          <span className="pointer-events-none absolute inset-0 border-t border-l border-[#9b9b9b]" />
                          <span className="pointer-events-none absolute inset-0 border-b border-r border-[#4b4b4b]" />
                          <span className="relative">{item}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact info & CTA */}
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <a
                    href={hero.primaryCtaHref}
                    target="_blank"
                    rel="noreferrer"
                    className="relative inline-block border-2 border-[#3b3b3b] bg-[#5c7a29] px-4 py-2 text-sm font-bold text-white transition-all hover:bg-[#6b8e3e] hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span className="pointer-events-none absolute inset-0 border-t-2 border-l-2 border-[#8acd32]" />
                    <span className="pointer-events-none absolute inset-0 border-b-2 border-r-2 border-[#3a5a19]" />
                    <span className="relative">{hero.primaryCtaLabel}</span>
                  </a>

                  {hero.contact?.location && (
                    <span className="text-xs text-[#a0a0a0]">📍 {hero.contact.location}</span>
                  )}
                  {hero.contact?.company && (
                    <span className="text-xs text-[#a0a0a0]">🏢 {hero.contact.company}</span>
                  )}
                  {websiteDisplay && (
                    <span className="text-xs text-[#a0a0a0]">🌐 {websiteDisplay}</span>
                  )}
                </div>

                {hero.caption && (
                  <p className="mt-3 text-[11px] text-[#777]">{hero.caption}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dirt block border at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#8B6E4E] via-[#6B8E3E] to-[#8B6E4E]" style={{ imageRendering: 'pixelated' }} />
    </section>
  )
}
