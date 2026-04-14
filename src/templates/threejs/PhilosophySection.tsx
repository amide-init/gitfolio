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
      className="border-t border-blue-900/30 bg-[#050509] py-16"
      aria-labelledby="philosophy-title"
    >
      <div className="mx-auto max-w-5xl px-6">
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
              className="group rounded-xl border border-blue-900/40 bg-gradient-to-b from-[#0d1220] to-[#080c18] p-5 text-sm transition hover:-translate-y-0.5 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
            >
              <h3 className="mb-2 text-sm font-semibold text-slate-100">{card.title}</h3>
              <p className="text-[13px] leading-relaxed text-slate-400">{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
