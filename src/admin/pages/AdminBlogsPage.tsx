import { useState } from 'react'
import { LuxeEditor, getEditorJSON } from 'luxe-edit'
import 'luxe-edit/index.css'
import { Plus, Trash2, Pencil, AlertCircle, CheckCircle2, Loader2, RefreshCw } from 'lucide-react'
import { useAdminAuthContext } from '../context/AdminAuthContext'
import { useBlogsStore } from '../hooks/useBlogsStore'
import type { Blog } from '../../types/contentTypes'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
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

function makeText(text: string, format = 0) {
  return { detail: 0, format, mode: 'normal', style: '', text, type: 'text', version: 1 }
}

function parseInline(line: string) {
  const nodes: object[] = []
  const re = /(\*\*(.+?)\*\*|\*(.+?)\*|_(.+?)_|~~(.+?)~~|([^*_~]+))/g
  let m: RegExpExecArray | null
  while ((m = re.exec(line)) !== null) {
    if (m[2] != null) nodes.push(makeText(m[2], 1))
    else if (m[3] != null) nodes.push(makeText(m[3], 2))
    else if (m[4] != null) nodes.push(makeText(m[4], 2))
    else if (m[5] != null) nodes.push(makeText(m[5], 4))
    else if (m[6] != null) nodes.push(makeText(m[6], 0))
  }
  return nodes.length ? nodes : [makeText(line, 0)]
}

function makeBlock(type: string, children: object[], tag?: string) {
  return { children, direction: 'ltr', format: '', indent: 0, type, ...(tag ? { tag } : {}), version: 1 }
}

function markdownToLexicalJSON(md: string): string {
  const blocks: object[] = []
  for (const line of md.split('\n')) {
    const hMatch = line.match(/^(#{1,6})\s+(.+)/)
    if (hMatch) {
      blocks.push(makeBlock('heading', parseInline(hMatch[2]), `h${hMatch[1].length}`))
    } else {
      const text = line.trimEnd()
      blocks.push(makeBlock('paragraph', text ? parseInline(text) : []))
    }
  }
  if (!blocks.length) blocks.push(makeBlock('paragraph', []))
  return JSON.stringify({ root: { children: blocks, direction: 'ltr', format: '', indent: 0, type: 'root', version: 1 } })
}

type ModalState = { open: false } | { open: true; mode: 'add' } | { open: true; mode: 'edit'; id: string }

export function AdminBlogsPage() {
  const { token } = useAdminAuthContext()
  const store = useBlogsStore(token)
  const [modal, setModal] = useState<ModalState>({ open: false })

  const editingBlog = modal.open && modal.mode === 'edit'
    ? store.items.find((b) => b.id === modal.id)
    : undefined

  function closeModal() { setModal({ open: false }) }

  function handleApply(draft: { title: string; contentJSON?: string }) {
    if (modal.open && modal.mode === 'edit') {
      store.update(modal.id, draft)
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
          <p className="text-sm text-zinc-400">Loading blogs…</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">Blogs</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Stored in <code className="rounded bg-zinc-800 px-1 text-zinc-300">data/blogs.json</code>
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
            <Plus className="h-3.5 w-3.5" /> Add blog
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
        {store.items.map((blog) => (
          <div
            key={blog.id}
            className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-200">{blog.title || <span className="text-zinc-500 italic">Untitled</span>}</p>
              <p className="text-xs text-zinc-500 mt-0.5">Updated {formatDate(blog.updatedAt)}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-4">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setModal({ open: true, mode: 'edit', id: blog.id })}
                className="h-7 w-7 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => store.remove(blog.id)}
                className="h-7 w-7 text-zinc-600 hover:text-red-400 hover:bg-red-950/30"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
        {store.items.length === 0 && (
          <p className="rounded-xl border border-dashed border-zinc-800 py-10 text-center text-sm text-zinc-600">
            No blogs yet. Click "Add blog" to create one.
          </p>
        )}
      </div>

      <Dialog open={modal.open} onOpenChange={(v) => !v && closeModal()}>
        <DialogContent className="border-zinc-800 bg-zinc-900 max-w-2xl max-h-[90vh] overflow-y-auto">
          {modal.open && (
            <BlogModalContent
              key={modal.mode === 'edit' ? modal.id : 'new'}
              blog={editingBlog}
              onClose={closeModal}
              onApply={handleApply}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function BlogModalContent({
  blog,
  onClose,
  onApply,
}: {
  blog?: Blog
  onClose: () => void
  onApply: (draft: { title: string; contentJSON?: string }) => void
}) {
  const [title, setTitle] = useState(blog?.title ?? '')
  const [contentJSON, setContentJSON] = useState<string | undefined>(blog?.contentJSON)

  const legacyEditorState =
    blog?.contentJSON == null && blog?.content ? markdownToLexicalJSON(blog.content) : undefined

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-zinc-100">{blog ? 'Edit blog' : 'New blog'}</DialogTitle>
      </DialogHeader>
      <div className="space-y-3 py-1">
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-blue-500"
        />
        <LuxeEditor
          colorScheme="dark"
          initialConfig={{
            namespace: `modal-blog-${blog?.id ?? 'new'}`,
            ...(legacyEditorState ? { editorState: legacyEditorState } : {}),
          }}
          initialJSON={blog?.contentJSON}
          onChange={(editorState) => setContentJSON(getEditorJSON(editorState))}
          ignoreInitialChange
        />
        {blog && (
          <p className="text-[11px] text-zinc-600">
            Created {new Date(blog.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })} · Updated {new Date(blog.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
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
          onClick={() => onApply({ title, contentJSON })}
          className="bg-blue-600 text-white hover:bg-blue-500"
        >
          Apply
        </Button>
      </DialogFooter>
    </>
  )
}
