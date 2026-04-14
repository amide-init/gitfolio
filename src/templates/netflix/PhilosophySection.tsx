type PhilosophyCard = { title: string; body: string }
type Philosophy = { title: string; body: string; cards: PhilosophyCard[] }

export default function PhilosophySection({ philosophy }: { philosophy: Philosophy }) {
  if (!philosophy) return null

  return (
    <section id="philosophy" className="bg-[#141414] py-10" aria-labelledby="philosophy-title">
      <div className="mx-auto max-w-6xl px-6">
        {/* Row header */}
        <h2 id="philosophy-title" className="mb-1 text-xl font-bold text-white">
          {philosophy.title}
        </h2>
        <p className="mb-6 text-sm text-[#999]">{philosophy.body}</p>

        {philosophy.cards && philosophy.cards.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {philosophy.cards.map((card) => (
              <article
                key={card.title}
                className="group relative overflow-hidden rounded-sm bg-[#1f1f1f] p-6 transition hover:bg-[#2a2a2a]"
              >
                {/* Red left accent bar */}
                <div className="absolute left-0 top-0 h-full w-1 bg-[#e50914] opacity-0 transition group-hover:opacity-100" />
                <h3 className="mb-2 text-sm font-bold text-white">{card.title}</h3>
                <p className="text-[13px] leading-relaxed text-[#999]">{card.body}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
