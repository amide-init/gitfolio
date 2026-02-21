type AdminFeaturedReposFormProps = {
  value: string
  onChange: (value: string) => void
}

export function AdminFeaturedReposForm({
  value,
  onChange,
}: AdminFeaturedReposFormProps) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-slate-100">
        Featured repositories
      </h2>
      <p className="mt-1 text-xs text-slate-400">
        Comma-separated list of repo names that should always be featured.
        Example: <code>gitfolio, my-awesome-repo</code>
      </p>
      <textarea
        rows={2}
        className="mt-3 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </section>
  )
}
