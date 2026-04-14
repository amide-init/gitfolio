import { LuxeEditor, getEditorJSON } from 'luxe-edit'
import 'luxe-edit/index.css'
import { Plus, Trash2, AlertCircle, CheckCircle2, Loader2, RefreshCw } from 'lucide-react'
import { useAdminAuthContext } from '../context/AdminAuthContext'
import { useBlogsStore } from '../hooks/useBlogsStore'
import type { Blog } from '../../types/contentTypes'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardHeader } from '../../components/ui/card'

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return iso
  }
}

// ── Minimal markdown → Lexical JSON ──────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────

export function AdminBlogsPage() {
  const { token } = useAdminAuthContext()
  const store = useBlogsStore(token)

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
          <Button type="button" variant="outline" size="sm" onClick={store.add} className="gap-1.5 border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100">
            <Plus className="h-3.5 w-3.5" /> Add blog
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
        {store.items.map((blog) => (
          <BlogCard
            key={blog.id}
            blog={blog}
            onUpdate={(u) => store.update(blog.id, u)}
            onRemove={() => store.remove(blog.id)}
          />
        ))}
        {store.items.length === 0 && (
          <p className="rounded-xl border border-dashed border-zinc-800 py-10 text-center text-sm text-zinc-600">
            No blogs yet. Click "Add blog" to create one.
          </p>
        )}
      </div>
    </div>
  )
}

function BlogCard({
  blog,
  onUpdate,
  onRemove,
}: {
  blog: Blog
  onUpdate: (u: Partial<Pick<Blog, 'title' | 'content' | 'contentJSON'>>) => void
  onRemove: () => void
}) {
  const legacyEditorState =
    blog.contentJSON == null && blog.content ? markdownToLexicalJSON(blog.content) : undefined

  return (
    <Card className="border-zinc-800 bg-zinc-900">
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500">Blog post</span>
          <Button type="button" variant="ghost" size="icon" onClick={onRemove} className="h-7 w-7 text-zinc-600 hover:text-red-400 hover:bg-red-950/30">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4">
        <Input
          type="text"
          placeholder="Title"
          value={blog.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-blue-500"
        />
        <LuxeEditor
          colorScheme="dark"
          initialConfig={{
            namespace: `blog-${blog.id}`,
            ...(legacyEditorState ? { editorState: legacyEditorState } : {}),
          }}
          initialJSON={blog.contentJSON}
          onChange={(editorState) => {
            onUpdate({ contentJSON: getEditorJSON(editorState) })
          }}
          ignoreInitialChange
        />
        <p className="text-[11px] text-zinc-600">
          Created {formatDate(blog.createdAt)} · Updated {formatDate(blog.updatedAt)}
        </p>
      </CardContent>
    </Card>
  )
}
