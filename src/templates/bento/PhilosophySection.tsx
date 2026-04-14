type PhilosophyCard = { title: string; body: string }
type Philosophy = { title: string; body: string; cards: PhilosophyCard[] }

export default function PhilosophySection({ philosophy }: { philosophy: Philosophy }) {
  return (
    <section id="philosophy" className="bg-[#0a0a14] py-8" aria-labelledby="philosophy-title">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header tile */}
        <div className="mb-4 rounded-3xl border border-white/8 bg-[#111122] px-8 py-6">
          <h2 id="philosophy-title" className="text-lg font-bold text-white">{philosophy.title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-400">{philosophy.body}</p>
        </div>
        {/* Cards mosaic */}
        <div className="grid gap-4 md:grid-cols-2">
          {philosophy.cards.map((card) => (
            <article
              key={card.title}
              className="rounded-3xl border border-white/8 bg-[#111122] p-6 transition hover:border-indigo-500/30 hover:bg-[#13132a]"
            >
              <h3 className="mb-2 text-sm font-semibold text-white">{card.title}</h3>
              <p className="text-[13px] leading-relaxed text-slate-400">{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
