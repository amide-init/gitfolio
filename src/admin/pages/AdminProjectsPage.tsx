import { useAdminAuthContext } from '../context/AdminAuthContext'
import { useProjectsStore } from '../hooks/useProjectsStore'
import type { Project, ProjectLink } from '../../types/contentTypes'

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return iso
  }
}

export function AdminProjectsPage() {
  const { token } = useAdminAuthContext()
  const store = useProjectsStore(token)

  const updateLinks = (id: string, links: ProjectLink[]) => {
    store.updateLinks(id, links)
  }

  if (store.loading) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8">
        <p className="text-sm text-slate-400">Loading projects…</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Projects</h2>
          <p className="mt-1 text-sm text-slate-400">
            Store in <code className="rounded bg-slate-800 px-1">data/projects.json</code>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={store.add}
            className="rounded-md border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
          >
            + Add project
          </button>
          <button
            type="button"
            onClick={store.persist}
            disabled={store.saving}
            className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
          >
            {store.saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {store.error && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-rose-800 bg-rose-950/40 p-3 text-sm text-rose-400">
          <span>{store.error}</span>
          <button
            type="button"
            onClick={store.reload}
            className="shrink-0 rounded px-2 py-1 text-xs font-medium text-rose-200 hover:bg-rose-900/60"
          >
            Reload
          </button>
        </div>
      )}
      {store.success && (
        <p className="rounded-lg border border-emerald-800 bg-emerald-950/40 p-3 text-sm text-emerald-400">
          {store.success}
        </p>
      )}

      <div className="space-y-4">
        {store.items.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onUpdate={(u) => store.update(project.id, u)}
            onUpdateLinks={(links) => updateLinks(project.id, links)}
            onRemove={() => store.remove(project.id)}
          />
        ))}
        {store.items.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">
            No projects yet. Click "Add project" to create one.
          </p>
        )}
      </div>
    </div>
  )
}

function ProjectCard({
  project,
  onUpdate,
  onUpdateLinks,
  onRemove,
}: {
  project: Project
  onUpdate: (u: Partial<Pick<Project, 'title' | 'description'>>) => void
  onUpdateLinks: (links: ProjectLink[]) => void
  onRemove: () => void
}) {
  const addLink = () => {
    onUpdateLinks([...project.links, { label: '', url: '' }])
  }
  const updateLink = (i: number, field: 'label' | 'url', value: string) => {
    const next = [...project.links]
    next[i] = { ...next[i], [field]: value }
    onUpdateLinks(next)
  }
  const removeLink = (i: number) => {
    onUpdateLinks(project.links.filter((_, idx) => idx !== i))
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <input
            type="text"
            placeholder="Title"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
            value={project.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
          />
          <textarea
            rows={2}
            placeholder="Description"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
            value={project.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
          />
          <div>
            <p className="mb-2 text-xs font-medium text-slate-400">Links</p>
            <div className="space-y-2">
              {project.links.map((link, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Label"
                    className="w-28 rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs focus:border-emerald-500 focus:outline-none"
                    value={link.label}
                    onChange={(e) => updateLink(i, 'label', e.target.value)}
                  />
                  <input
                    type="url"
                    placeholder="URL"
                    className="flex-1 rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs focus:border-emerald-500 focus:outline-none"
                    value={link.url}
                    onChange={(e) => updateLink(i, 'url', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeLink(i)}
                    className="rounded px-2 text-slate-500 hover:bg-slate-800 hover:text-rose-400"
                    aria-label="Remove link"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addLink}
                className="text-xs text-slate-500 hover:text-emerald-400"
              >
                + Add link
              </button>
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            Created {formatDate(project.createdAt)} · Updated{' '}
            {formatDate(project.updatedAt)}
          </p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-800 hover:text-rose-400"
          aria-label="Remove project"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
