import { Plus, Trash2, AlertCircle, CheckCircle2, Loader2, RefreshCw, Link } from 'lucide-react'
import { useAdminAuthContext } from '../context/AdminAuthContext'
import { useProjectsStore } from '../hooks/useProjectsStore'
import type { Project, ProjectLink } from '../../types/contentTypes'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader } from '../../components/ui/card'

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return iso
  }
}

export function AdminProjectsPage() {
  const { token } = useAdminAuthContext()
  const store = useProjectsStore(token)

  const updateLinks = (id: string, links: ProjectLink[]) => store.updateLinks(id, links)

  if (store.loading) {
    return (
      <Card className="border-zinc-800 bg-zinc-900">
        <CardContent className="flex items-center gap-3 py-8">
          <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
          <p className="text-sm text-zinc-400">Loading projects…</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">Projects</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Stored in <code className="rounded bg-zinc-800 px-1 text-zinc-300">data/projects.json</code>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={store.add} className="gap-1.5 border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100">
            <Plus className="h-3.5 w-3.5" /> Add project
          </Button>
          <Button type="button" size="sm" onClick={store.persist} disabled={store.saving} className="min-w-16 bg-blue-600 text-white hover:bg-blue-500">
            {store.saving ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</> : 'Save'}
          </Button>
        </div>
      </div>

      {store.error && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-800/50 bg-red-950/30 px-3 py-2.5 text-sm text-red-400">
          <span className="flex items-start gap-2"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{store.error}</span>
          <Button type="button" variant="ghost" size="sm" onClick={store.reload} className="shrink-0 gap-1.5 text-red-300 hover:bg-red-950/50 hover:text-red-200">
            <RefreshCw className="h-3 w-3" /> Reload
          </Button>
        </div>
      )}
      {store.success && (
        <div className="flex items-start gap-2 rounded-lg border border-green-800/50 bg-green-950/30 px-3 py-2.5 text-sm text-green-400">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />{store.success}
        </div>
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
          <p className="rounded-xl border border-dashed border-zinc-800 py-10 text-center text-sm text-zinc-600">
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
  const addLink = () => onUpdateLinks([...project.links, { label: '', url: '' }])
  const updateLink = (i: number, field: 'label' | 'url', value: string) => {
    const next = [...project.links]
    next[i] = { ...next[i], [field]: value }
    onUpdateLinks(next)
  }
  const removeLink = (i: number) => onUpdateLinks(project.links.filter((_, idx) => idx !== i))

  return (
    <Card className="border-zinc-800 bg-zinc-900">
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500">Project</span>
          <Button type="button" variant="ghost" size="icon" onClick={onRemove} className="h-7 w-7 text-zinc-600 hover:text-red-400 hover:bg-red-950/30">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4">
        <Input
          type="text"
          placeholder="Title"
          value={project.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-blue-500"
        />
        <Textarea
          rows={2}
          placeholder="Description"
          value={project.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          className="border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-blue-500"
        />
        <div>
          <Label className="mb-2 block text-xs text-zinc-500">Links</Label>
          <div className="space-y-2">
            {project.links.map((link, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Label"
                  value={link.label}
                  onChange={(e) => updateLink(i, 'label', e.target.value)}
                  className="w-28 border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-blue-500"
                />
                <Input
                  type="url"
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => updateLink(i, 'url', e.target.value)}
                  className="flex-1 border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-blue-500"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeLink(i)} className="h-9 w-9 shrink-0 text-zinc-600 hover:text-red-400 hover:bg-red-950/30">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="ghost" size="sm" onClick={addLink} className="gap-1.5 text-zinc-500 hover:text-zinc-300">
              <Link className="h-3 w-3" /> Add link
            </Button>
          </div>
        </div>
        <p className="text-[11px] text-zinc-600">
          Created {formatDate(project.createdAt)} · Updated {formatDate(project.updatedAt)}
        </p>
      </CardContent>
    </Card>
  )
}
