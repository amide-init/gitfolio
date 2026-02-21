type AdminPlaceholderPageProps = {
  title: string
  description?: string
}

export function AdminPlaceholderPage({
  title,
  description = 'Content management for this section will be available in a future release.',
}: AdminPlaceholderPageProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8">
      <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
      <p className="mt-4 text-xs text-slate-500">
        This portfolio engine will support multiple content types: portfolio settings, projects, blogs, videos, and posts.
      </p>
    </div>
  )
}
