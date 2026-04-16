import { lazy, Suspense, useMemo, useState } from 'react'

const PhilosophyScene = lazy(() => import('./PhilosophyScene'))

type PhilosophyCardData = { title: string; body: string }
type Philosophy = { title: string; body: string; cards: PhilosophyCardData[] }

export default function PhilosophySection({ philosophy }: { philosophy: Philosophy }) {
  if (!philosophy?.cards?.length) return null

  const cubeCards = useMemo(
    () => Array.from({ length: 4 }, (_, i) => philosophy.cards[i % philosophy.cards.length]),
    [philosophy.cards],
  )
  const [activeFace, setActiveFace] = useState(0)
  const faceLabels = ['Front', 'Back', 'Left', 'Right']

  return (
    <section
      id="philosophy"
      className="relative overflow-hidden border-t border-blue-900/30 bg-[#050509] py-16"
      aria-labelledby="philosophy-title"
    >
      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <header className="mb-10 max-w-2xl">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-blue-400">
            {philosophy.title}
          </p>
          <p className="text-sm leading-relaxed text-slate-400">{philosophy.body}</p>
        </header>

        <div className="mx-auto mb-8 h-[430px] w-full max-w-3xl overflow-hidden rounded-2xl border border-blue-900/35 bg-[#070d1d]/45 backdrop-blur-sm">
          <Suspense fallback={null}>
            <PhilosophyScene cards={cubeCards} activeIndex={activeFace} onActiveIndexChange={setActiveFace} />
          </Suspense>
        </div>

        <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2">
          {cubeCards.map((card, index) => (
            <button
              key={`${faceLabels[index]}-${card.title}`}
              type="button"
              onClick={() => setActiveFace(index)}
              className={`rounded-xl border px-4 py-3 text-left transition ${
                activeFace === index
                  ? 'border-cyan-400/80 bg-cyan-500/10 shadow-[0_0_24px_rgba(6,182,212,0.18)]'
                  : 'border-blue-900/45 bg-[#060b17]/70 hover:border-blue-500/70 hover:bg-[#0b1428]/75'
              }`}
            >
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300/85">
                {faceLabels[index]}
              </p>
              <p className="text-sm font-semibold text-slate-100">{card.title}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
