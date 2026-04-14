import { lazy, Suspense } from 'react'

const ParticleField = lazy(() => import('./ParticleField'))

type PhilosophyCard = {
  title: string
  body: string
}

type Philosophy = {
  title: string
  body: string
  cards: PhilosophyCard[]
}

export default function PhilosophySection({ philosophy }: { philosophy: Philosophy }) {
  if (!philosophy?.cards?.length) return null
  return (
    <section
      id="philosophy"
      className="relative overflow-hidden border-t border-blue-900/30 bg-[#050509] py-16"
      aria-labelledby="philosophy-title"
    >
      {/* Particle network background */}
      <Suspense fallback={null}>
        <ParticleField count={40} color={0x3b82f6} opacity={0.35} />
      </Suspense>

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <header className="mb-10 max-w-2xl">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-blue-400">
            {philosophy.title}
          </p>
          <p className="text-sm leading-relaxed text-slate-400">{philosophy.body}</p>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          {philosophy.cards.map((card) => (
            <article
              key={card.title}
              className="group rounded-xl border border-blue-900/40 bg-gradient-to-b from-[#0d1220]/80 to-[#080c18]/80 p-5 text-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.18)]"
            >
              {/* Glowing top border accent */}
              <div className="mb-3 h-px w-12 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-60 transition-all group-hover:w-20 group-hover:opacity-100" />
              <h3 className="mb-2 text-sm font-semibold text-slate-100">{card.title}</h3>
              <p className="text-[13px] leading-relaxed text-slate-400">{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
