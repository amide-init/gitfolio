import { lazy, Suspense, useMemo, useState } from 'react'

const PhilosophyScene = lazy(() => import('./PhilosophyScene'))
const CUBE_FACE_COUNT = 4

type PhilosophyCardData = { title: string; body: string }
type Philosophy = { title: string; body: string; cards: PhilosophyCardData[] }
const EMPTY_FACE_CARD: PhilosophyCardData = {
  title: 'More to come',
  body: 'Add another philosophy item to fill this cube face.',
}

export default function PhilosophySection({ philosophy }: { philosophy: Philosophy }) {
  const cards = philosophy?.cards
  const cubeCards = useMemo(
    () => {
      if (!cards?.length) return []
      const filled = cards.slice(0, CUBE_FACE_COUNT)
      while (filled.length < CUBE_FACE_COUNT) filled.push(EMPTY_FACE_CARD)
      return filled
    },
    [cards],
  )
  const [activeFace, setActiveFace] = useState(0)
  if (!cards?.length) return null

  return (
    <section
      id="philosophy"
      className="relative overflow-hidden border-t border-blue-900/30 bg-[#050509] py-16"
      aria-labelledby="philosophy-title"
    >
      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <header className="max-w-xl">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-400/90">
              Philosophy
            </p>
            <h2 id="philosophy-title" className="text-3xl font-semibold leading-tight text-slate-100 sm:text-4xl">
              {philosophy.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-300">{philosophy.body}</p>
          </header>

          <div className="h-[430px] w-full overflow-hidden rounded-2xl border border-blue-900/35 bg-[#070d1d]/45 backdrop-blur-sm">
            <Suspense fallback={null}>
              <PhilosophyScene cards={cubeCards} activeIndex={activeFace} onActiveIndexChange={setActiveFace} />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  )
}
