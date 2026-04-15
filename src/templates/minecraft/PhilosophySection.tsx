type PhilosophyCard = { title: string; body: string }
type Philosophy = { title: string; body: string; cards: PhilosophyCard[] }

import { useInView } from './useInView'

export default function PhilosophySection({ philosophy }: { philosophy: Philosophy }) {
  const { ref, visible } = useInView()
  if (!philosophy?.cards?.length && !philosophy?.body) return null

  return (
    <section id="philosophy" className="bg-[#1a1a2e] py-12" aria-labelledby="philosophy-title">
      <div ref={ref} className="mx-auto max-w-4xl px-6">
        {/* Section header — enchantment table style */}
        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-[#5c7a29] mb-1">📖 Enchantment Table</p>
          <h2 id="philosophy-title" className="text-xl font-bold text-white drop-shadow-[2px_2px_0_#3f3f00]">
            {philosophy.title}
          </h2>
          {philosophy.body && (
            <p className="mt-2 text-sm text-[#a0a0a0] max-w-xl">{philosophy.body}</p>
          )}
        </div>

        {/* Cards as book pages */}
        <div className="grid gap-3 sm:grid-cols-2">
          {philosophy.cards.map((card, i) => (
            <div
              key={card.title}
              className={`relative border-2 border-[#3b3b3b] bg-[#8b8b8b] p-4 transition-all hover:border-[#ffffff80] hover:-translate-y-0.5 ${visible ? 'animate-mc-place' : 'opacity-0'}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="pointer-events-none absolute inset-0 border-t-2 border-l-2 border-[#c6c6c6]" />
              <div className="pointer-events-none absolute inset-0 border-b-2 border-r-2 border-[#555555]" />
              <div className="relative">
                <p className="font-bold text-[#5c7a29] drop-shadow-[1px_1px_0_#2a3a10]">✦ {card.title}</p>
                <p className="mt-1 text-xs text-[#d4d4d4] leading-relaxed">{card.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
