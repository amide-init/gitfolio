type PhilosophyCard = {
  title: string
  body: string
}

type Philosophy = {
  title: string
  body: string
  cards: PhilosophyCard[]
}

type PhilosophySectionProps = {
  philosophy: Philosophy
}

function PhilosophySection({ philosophy }: PhilosophySectionProps) {
  return (
    <section
      id="philosophy"
      className="border-t border-slate-200 bg-slate-50 py-12 dark:border-slate-800 dark:bg-[#050509]"
      aria-labelledby="philosophy-title"
    >
      <div className="mx-auto max-w-5xl px-6">
        <header className="mb-8 max-w-2xl">
          <h2
            id="philosophy-title"
            className="mb-2 text-xs font-semibold uppercase tracking-[0.26em] text-slate-600 dark:text-slate-300"
          >
            {philosophy.title}
          </h2>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {philosophy.body}
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {philosophy.cards.map((card) => (
            <article
              key={card.title}
              className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-400/60 hover:shadow-[0_18px_40px_rgba(49,130,206,0.35)] dark:border-white/10 dark:bg-gradient-to-b dark:from-[#171824] dark:to-[#10111b] dark:text-slate-200 dark:shadow-[0_18px_40px_rgba(0,0,0,0.75)] dark:hover:border-indigo-400/80 dark:hover:shadow-[0_18px_50px_rgba(49,130,206,0.85)]"
            >
              <h3 className="mb-1.5 text-sm font-semibold text-slate-900 dark:text-slate-50">
                {card.title}
              </h3>
              <p className="text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">
                {card.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PhilosophySection
