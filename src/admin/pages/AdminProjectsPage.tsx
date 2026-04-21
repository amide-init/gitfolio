import { useState } from 'react'
import { Plus, Trash2, Pencil, AlertCircle, CheckCircle2, Loader2, RefreshCw, Link } from 'lucide-react'
import { useAdminAuthContext } from '../context/AdminAuthContext'
import { useProjectsStore } from '../hooks/useProjectsStore'
import type { Project, ProjectLink } from '../../types/contentTypes'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Label } from '../../components/ui/label'
import { Card, CardContent } from '../../components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog'

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return iso
  }
}

type ProjectDraft = { title: string; description: string; links: ProjectLink[] }
type ModalState = { open: false } | { open: true; mode: 'add' } | { open: true; mode: 'edit'; id: string }

export function AdminProjectsPage() {
  const { token } = useAdminAuthContext()
  const store = useProjectsStore(token)
  const [modal, setModal] = useState<ModalState>({ open: false })

  const editingProject = modal.open && modal.mode === 'edit'
    ? store.items.find((p) => p.id === modal.id)
    : undefined

  function closeModal() { setModal({ open: false }) }

  function handleApply(draft: ProjectDraft) {
    if (modal.open && modal.mode === 'edit') {
      store.update(modal.id, { title: draft.title, description: draft.description })
      store.updateLinks(modal.id, draft.links)
    } else {
      store.addItem(draft)
    }
    closeModal()
  }

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
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setModal({ open: true, mode: 'add' })}
            className="gap-1.5 border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
          >
            <Plus className="h-3.5 w-3.5" /> Add project
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={store.persist}
            disabled={store.saving}
            className="min-w-16 bg-blue-600 text-white hover:bg-blue-500"
          >
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

      <div className="space-y-2">
        {store.items.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-200">{project.title || <span className="text-zinc-500 italic">Untitled</span>}</p>
              <p className="truncate text-xs text-zinc-500 mt-0.5">
                {project.description
                  ? project.description.slice(0, 80) + (project.description.length > 80 ? '…' : '')
                  : <span className="italic">No description</span>
                }
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-4">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setModal({ open: true, mode: 'edit', id: project.id })}
                className="h-7 w-7 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => store.remove(project.id)}
                className="h-7 w-7 text-zinc-600 hover:text-red-400 hover:bg-red-950/30"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
        {store.items.length === 0 && (
          <p className="rounded-xl border border-dashed border-zinc-800 py-10 text-center text-sm text-zinc-600">
            No projects yet. Click "Add project" to create one.
          </p>
        )}
      </div>

      <Dialog open={modal.open} onOpenChange={(v) => !v && closeModal()}>
        <DialogContent className="border-zinc-800 bg-zinc-900 max-w-lg max-h-[90vh] overflow-y-auto">
          {modal.open && (
            <ProjectModalContent
              key={modal.mode === 'edit' ? modal.id : 'new'}
              project={editingProject}
              onClose={closeModal}
              onApply={handleApply}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ProjectModalContent({
  project,
  onClose,
  onApply,
}: {
  project?: Project
  onClose: () => void
  onApply: (draft: ProjectDraft) => void
}) {
  const [title, setTitle] = useState(project?.title ?? '')
  const [description, setDescription] = useState(project?.description ?? '')
  const [links, setLinks] = useState<ProjectLink[]>(project?.links ?? [])

  const addLink = () => setLinks((prev) => [...prev, { label: '', url: '' }])
  const updateLink = (i: number, field: 'label' | 'url', value: string) => {
    setLinks((prev) => prev.map((l, idx) => idx === i ? { ...l, [field]: value } : l))
  }
  const removeLink = (i: number) => setLinks((prev) => prev.filter((_, idx) => idx !== i))

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-zinc-100">{project ? 'Edit project' : 'New project'}</DialogTitle>
      </DialogHeader>
      <div className="space-y-3 py-1">
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-blue-500"
        />
        <Textarea
          rows={3}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-blue-500"
        />
        <div>
          <Label className="mb-2 block text-xs text-zinc-500">Links</Label>
          <div className="space-y-2">
            {links.map((link, i) => (
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
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLink(i)}
                  className="h-9 w-9 shrink-0 text-zinc-600 hover:text-red-400 hover:bg-red-950/30"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addLink}
              className="gap-1.5 text-zinc-500 hover:text-zinc-300"
            >
              <Link className="h-3 w-3" /> Add link
            </Button>
          </div>
        </div>
        {project && (
          <p className="text-[11px] text-zinc-600">
            Created {formatDate(project.createdAt)} · Updated {formatDate(project.updatedAt)}
          </p>
        )}
      </div>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={() => onApply({ title, description, links })}
          className="bg-blue-600 text-white hover:bg-blue-500"
        >
          Apply
        </Button>
      </DialogFooter>
    </>
  )
}
