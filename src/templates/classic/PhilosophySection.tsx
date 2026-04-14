type PhilosophyCard = { title: string; body: string }
type Philosophy = { title: string; body: string; cards: PhilosophyCard[] }

export default function PhilosophySection({ philosophy }: { philosophy: Philosophy }) {
  return (
    <section
      id="philosophy"
      className="border-b border-slate-200 bg-slate-50 py-16 dark:border-slate-800 dark:bg-slate-900/50"
      aria-labelledby="philosophy-title"
    >
      <div className="mx-auto max-w-5xl px-6">
        <header className="mb-10 max-w-2xl">
          <h2
            id="philosophy-title"
            className="mb-3 text-2xl font-bold text-slate-900 dark:text-slate-50"
          >
            {philosophy.title}
          </h2>
          <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
            {philosophy.body}
          </p>
        </header>
        <div className="grid gap-5 md:grid-cols-2">
          {philosophy.cards.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800/60"
            >
              <h3 className="mb-2 text-base font-semibold text-slate-900 dark:text-slate-50">
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {card.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
