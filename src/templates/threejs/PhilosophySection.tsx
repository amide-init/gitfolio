import { lazy, Suspense } from 'react'
import PhilosophyCard from './PhilosophyCard'

const PhilosophyScene = lazy(() => import('./PhilosophyScene'))

type PhilosophyCardData = { title: string; body: string }
type Philosophy = { title: string; body: string; cards: PhilosophyCardData[] }

export default function PhilosophySection({ philosophy }: { philosophy: Philosophy }) {
  if (!philosophy?.cards?.length) return null

  return (
    <section
      id="philosophy"
      className="relative overflow-hidden border-t border-blue-900/30 bg-[#050509] py-16"
      aria-labelledby="philosophy-title"
    >
      {/* Three.js floating wireframe shapes — one per card */}
      <Suspense fallback={null}>
        <PhilosophyScene count={philosophy.cards.length} />
      </Suspense>

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <header className="mb-10 max-w-2xl">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-blue-400">
            {philosophy.title}
          </p>
          <p className="text-sm leading-relaxed text-slate-400">{philosophy.body}</p>
        </header>

        <div className="grid gap-5 md:grid-cols-2">
          {philosophy.cards.map((card, i) => (
            <PhilosophyCard
              key={card.title}
              title={card.title}
              body={card.body}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
