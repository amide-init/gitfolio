type AdminLoadingSectionProps = {
  message: string
}

export function AdminLoadingSection({ message }: AdminLoadingSectionProps) {
  return (
    <section className="mt-6 rounded-lg border border-slate-800 bg-slate-900/60 p-6">
      <p className="text-sm text-slate-300">
        {message} This usually only takes a few seconds.
      </p>
    </section>
  )
}
