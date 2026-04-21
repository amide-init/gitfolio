import { useCallback, useState } from 'react'
import { Plus, Trash2, Pencil, AlertCircle, CheckCircle2, Loader2, RefreshCw } from 'lucide-react'
import { useAdminAuthContext } from '../context/AdminAuthContext'
import { useVideosStore } from '../hooks/useVideosStore'
import type { Video } from '../../types/contentTypes'
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

const NOEMBED_URL = 'https://noembed.com/embed'

async function fetchYouTubeMeta(videoUrl: string): Promise<{ title: string; thumbnail?: string }> {
  const res = await fetch(`${NOEMBED_URL}?url=${encodeURIComponent(videoUrl.trim())}`)
  if (!res.ok) throw new Error('Could not fetch video details')
  const data = (await res.json()) as { title?: string; thumbnail_url?: string; [key: string]: unknown }
  const title = typeof data.title === 'string' ? data.title : ''
  if (!title) throw new Error('No title in response')
  const thumbnail = typeof data.thumbnail_url === 'string' ? data.thumbnail_url : undefined
  return { title, thumbnail }
}

function parseYouTubeId(url: string): string | null {
  if (!url.trim()) return null
  try {
    const u = new URL(url.trim())
    if (u.hostname === 'www.youtube.com' || u.hostname === 'youtube.com') return u.searchParams.get('v')
    if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('/')[0] || null
  } catch { /* invalid URL */ }
  return null
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return iso
  }
}

type ModalState = { open: false } | { open: true; mode: 'add' } | { open: true; mode: 'edit'; id: string }

export function AdminVideosPage() {
  const { token } = useAdminAuthContext()
  const store = useVideosStore(token)
  const [modal, setModal] = useState<ModalState>({ open: false })

  const editingVideo = modal.open && modal.mode === 'edit'
    ? store.items.find((v) => v.id === modal.id)
    : undefined

  function closeModal() { setModal({ open: false }) }

  function handleApply(draft: { title: string; videoUrl: string; thumbnail?: string }) {
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
          <p className="text-sm text-zinc-400">Loading videos…</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">Videos</h1>
          <p className="mt-1 text-sm text-zinc-400">
            YouTube videos only. Stored in <code className="rounded bg-zinc-800 px-1 text-zinc-300">data/videos.json</code>
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
            <Plus className="h-3.5 w-3.5" /> Add video
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
        {store.items.map((video) => (
          <div
            key={video.id}
            className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {video.thumbnail && (
                <img
                  src={video.thumbnail}
                  alt=""
                  className="h-10 w-16 shrink-0 rounded border border-zinc-700 object-cover"
                />
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-zinc-200">{video.title || <span className="text-zinc-500 italic">Untitled</span>}</p>
                <p className="truncate text-xs text-zinc-500 mt-0.5">{video.videoUrl || 'No URL'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-4">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setModal({ open: true, mode: 'edit', id: video.id })}
                className="h-7 w-7 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => store.remove(video.id)}
                className="h-7 w-7 text-zinc-600 hover:text-red-400 hover:bg-red-950/30"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
        {store.items.length === 0 && (
          <p className="rounded-xl border border-dashed border-zinc-800 py-10 text-center text-sm text-zinc-600">
            No videos yet. Click "Add video" and paste a YouTube URL.
          </p>
        )}
      </div>

      <Dialog open={modal.open} onOpenChange={(v) => !v && closeModal()}>
        <DialogContent className="border-zinc-800 bg-zinc-900 max-w-lg">
          {modal.open && (
            <VideoModalContent
              key={modal.mode === 'edit' ? modal.id : 'new'}
              video={editingVideo}
              onClose={closeModal}
              onApply={handleApply}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function VideoModalContent({
  video,
  onClose,
  onApply,
}: {
  video?: Video
  onClose: () => void
  onApply: (draft: { title: string; videoUrl: string; thumbnail?: string }) => void
}) {
  const [videoUrl, setVideoUrl] = useState(video?.videoUrl ?? '')
  const [title, setTitle] = useState(video?.title ?? '')
  const [thumbnail, setThumbnail] = useState<string | undefined>(video?.thumbnail)
  const [fetching, setFetching] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const youtubeId = parseYouTubeId(videoUrl)
  const canFetch = Boolean(youtubeId && videoUrl.trim())
  const urlError = videoUrl.trim() && !youtubeId
    ? 'Enter a valid YouTube URL (youtube.com/watch?v=… or youtu.be/…)'
    : null

  const fetchMeta = useCallback(async () => {
    if (!canFetch) return
    setFetching(true)
    setFetchError(null)
    try {
      const { title: t, thumbnail: th } = await fetchYouTubeMeta(videoUrl)
      setTitle(t)
      setThumbnail(th)
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Could not fetch details')
    } finally {
      setFetching(false)
    }
  }, [canFetch, videoUrl])

  const handleUrlBlur = () => {
    if (canFetch && !title.trim() && !fetching) void fetchMeta()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-zinc-100">{video ? 'Edit video' : 'New video'}</DialogTitle>
      </DialogHeader>
      <div className="space-y-3 py-1">
        <div className="space-y-1">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Paste YouTube URL (youtube.com/watch?v=… or youtu.be/…)"
              value={videoUrl}
              onChange={(e) => { setFetchError(null); setVideoUrl(e.target.value) }}
              onBlur={handleUrlBlur}
              className="flex-1 border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-blue-500"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void fetchMeta()}
              disabled={!canFetch || fetching}
              className="shrink-0 border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 disabled:opacity-50"
            >
              {fetching ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Fetching…</> : 'Fetch'}
            </Button>
          </div>
          {urlError && <p className="text-xs text-red-400">{urlError}</p>}
          {fetchError && <p className="text-xs text-amber-400">{fetchError}</p>}
        </div>

        {youtubeId && (title || fetching) && (
          <div className="flex gap-3">
            {thumbnail && (
              <img
                src={thumbnail}
                alt=""
                className="h-20 w-36 shrink-0 rounded-md border border-zinc-700 object-cover"
              />
            )}
            <div className="min-w-0 flex-1">
              <Input
                type="text"
                placeholder="Video title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-blue-500"
              />
            </div>
          </div>
        )}

        {!youtubeId && title && (
          <Input
            type="text"
            placeholder="Video title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-blue-500"
          />
        )}

        {video && (
          <p className="text-[11px] text-zinc-600">Updated {formatDate(video.updatedAt)}</p>
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
          onClick={() => onApply({ title, videoUrl, thumbnail })}
          className="bg-blue-600 text-white hover:bg-blue-500"
        >
          Apply
        </Button>
      </DialogFooter>
    </>
  )
}
