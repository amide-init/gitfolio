import { useAdminAuthContext } from '../context/AdminAuthContext'
import { usePostsStore } from '../hooks/usePostsStore'
import type { Post } from '../../types/contentTypes'

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

export function AdminPostsPage() {
  const { token } = useAdminAuthContext()
  const store = usePostsStore(token)

  if (store.loading) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8">
        <p className="text-sm text-slate-400">Loading posts…</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Posts</h2>
          <p className="mt-1 text-sm text-slate-400">
            Store in <code className="rounded bg-slate-800 px-1">data/posts.json</code>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={store.add}
            className="rounded-md border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
          >
            + Add post
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
        {store.items.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onUpdate={(u) => store.update(post.id, u)}
            onRemove={() => store.remove(post.id)}
          />
        ))}
        {store.items.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">
            No posts yet. Click "Add post" to create one.
          </p>
        )}
      </div>
    </div>
  )
}

function PostCard({
  post,
  onUpdate,
  onRemove,
}: {
  post: Post
  onUpdate: (u: Partial<Pick<Post, 'title' | 'content'>>) => void
  onRemove: () => void
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <input
            type="text"
            placeholder="Title"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-medium text-slate-100 focus:border-emerald-500 focus:outline-none"
            value={post.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
          />
          <textarea
            rows={6}
            placeholder="Content (markdown supported)"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
            value={post.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
          />
          <p className="text-[11px] text-slate-500">
            Created {formatDate(post.createdAt)} · Updated{' '}
            {formatDate(post.updatedAt)}
          </p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-800 hover:text-rose-400"
          aria-label="Remove post"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
