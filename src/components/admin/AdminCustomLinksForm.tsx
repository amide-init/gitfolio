import type { CustomLink } from '../../types/gitforgeConfig'

type AdminCustomLinksFormProps = {
  links: CustomLink[]
  onUpdate: (index: number, field: keyof CustomLink, value: string) => void
  onAdd: () => void
  onRemove: (index: number) => void
}

export function AdminCustomLinksForm({
  links,
  onUpdate,
  onAdd,
  onRemove,
}: AdminCustomLinksFormProps) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-slate-100">Custom links</h2>
      <p className="mt-1 text-xs text-slate-400">
        Add external links (blog, newsletter, talks) with a short description.
      </p>
      <div className="mt-3 space-y-4">
        {links.map((link, index) => (
          <div
            key={index}
            className="rounded-md border border-slate-800 bg-slate-950/60 p-3"
          >
            <div className="flex items-start gap-2">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  placeholder="Title (e.g. Personal blog)"
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                  value={link.title}
                  onChange={(e) => onUpdate(index, 'title', e.target.value)}
                />
                <input
                  type="url"
                  placeholder="URL (https://…)"
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                  value={link.url}
                  onChange={(e) => onUpdate(index, 'url', e.target.value)}
                />
                <textarea
                  rows={2}
                  placeholder="Short description (optional)"
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                  value={link.description ?? ''}
                  onChange={(e) =>
                    onUpdate(index, 'description', e.target.value)
                  }
                />
              </div>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 text-xs text-slate-300 hover:bg-slate-800"
                aria-label="Remove link"
              >
                ×
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1 rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-800"
        >
          + Add link
        </button>
      </div>
    </section>
  )
}
