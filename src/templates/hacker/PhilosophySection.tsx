type PhilosophyCard = { title: string; body: string }
type Philosophy = { title: string; body: string; cards: PhilosophyCard[] }

export default function PhilosophySection({ philosophy }: { philosophy: Philosophy }) {
  if (!philosophy?.cards?.length && !philosophy?.body) return null

  return (
    <section id="philosophy" className="bg-black py-10 font-mono" aria-labelledby="philosophy-title">
      <div className="mx-auto max-w-4xl px-6">
        <p className="text-xs text-green-700 select-none">~/profile ❯ cat philosophy.md</p>
        <div className="mt-3 border-l-2 border-green-900/60 pl-4 space-y-4">
          <div>
            <p id="philosophy-title" className="text-sm font-semibold text-green-300">
              <span className="select-none text-green-800"># </span>{philosophy.title}
            </p>
            {philosophy.body && (
              <p className="mt-1 text-xs text-green-700 leading-relaxed max-w-xl">{philosophy.body}</p>
            )}
          </div>
          {philosophy.cards.map((card, i) => (
            <div key={card.title}>
              <p className="text-xs font-semibold text-green-400">
                <span className="select-none text-green-800">{'## '}</span>{card.title}
              </p>
              <p className="mt-0.5 text-xs text-green-700 leading-relaxed max-w-xl">{card.body}</p>
              {i < philosophy.cards.length - 1 && (
                <p className="mt-3 text-green-900 text-[10px] select-none">{'─'.repeat(48)}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
