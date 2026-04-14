import { useCallback, useState } from 'react'
import { Plus, Trash2, AlertCircle, CheckCircle2, Loader2, RefreshCw } from 'lucide-react'
import { useAdminAuthContext } from '../context/AdminAuthContext'
import { useVideosStore } from '../hooks/useVideosStore'
import type { Video } from '../../types/contentTypes'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardHeader } from '../../components/ui/card'

const NOEMBED_URL = 'https://noembed.com/embed'

/** Fetch title and thumbnail from YouTube via noembed.com. */
async function fetchYouTubeMeta(videoUrl: string): Promise<{ title: string; thumbnail?: string }> {
  const res = await fetch(`${NOEMBED_URL}?url=${encodeURIComponent(videoUrl.trim())}`)
  if (!res.ok) throw new Error('Could not fetch video details')
  const data = (await res.json()) as { title?: string; thumbnail_url?: string; [key: string]: unknown }
  const title = typeof data.title === 'string' ? data.title : ''
  if (!title) throw new Error('No title in response')
  const thumbnail = typeof data.thumbnail_url === 'string' ? data.thumbnail_url : undefined
  return { title, thumbnail }
}

/** Extract YouTube video ID from URL. */
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

export function AdminVideosPage() {
  const { token } = useAdminAuthContext()
  const store = useVideosStore(token)

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
          <Button type="button" variant="outline" size="sm" onClick={store.add} className="gap-1.5 border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100">
            <Plus className="h-3.5 w-3.5" /> Add video
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
        {store.items.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onUpdate={(u) => store.update(video.id, u)}
            onRemove={() => store.remove(video.id)}
          />
        ))}
        {store.items.length === 0 && (
          <p className="rounded-xl border border-dashed border-zinc-800 py-10 text-center text-sm text-zinc-600">
            No videos yet. Click "Add video" and paste a YouTube URL.
          </p>
        )}
      </div>
    </div>
  )
}

function VideoCard({
  video,
  onUpdate,
  onRemove,
}: {
  video: Video
  onUpdate: (u: Partial<Pick<Video, 'title' | 'videoUrl' | 'thumbnail'>>) => void
  onRemove: () => void
}) {
  const [fetching, setFetching] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const youtubeId = parseYouTubeId(video.videoUrl)
  const canFetch = Boolean(youtubeId && video.videoUrl.trim())
  const urlError = video.videoUrl.trim() && !youtubeId
    ? 'Enter a valid YouTube URL (youtube.com/watch?v=… or youtu.be/…)'
    : null

  const fetchMeta = useCallback(async () => {
    if (!canFetch) return
    setFetching(true)
    setFetchError(null)
    try {
      const { title, thumbnail } = await fetchYouTubeMeta(video.videoUrl)
      onUpdate({ title, thumbnail })
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Could not fetch details')
    } finally {
      setFetching(false)
    }
  }, [canFetch, video.videoUrl, onUpdate])

  const handleUrlChange = (value: string) => { setFetchError(null); onUpdate({ videoUrl: value }) }
  const handleUrlBlur = () => { if (canFetch && !video.title.trim() && !fetching) void fetchMeta() }

  const showFetchForm = !video.title.trim()
  const showDetails = youtubeId && (video.title || fetching)

  return (
    <Card className="border-zinc-800 bg-zinc-900">
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500">Video</span>
          <Button type="button" variant="ghost" size="icon" onClick={onRemove} className="h-7 w-7 text-zinc-600 hover:text-red-400 hover:bg-red-950/30">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4">
        {showFetchForm && (
          <div className="space-y-1">
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="Paste YouTube URL (youtube.com/watch?v=… or youtu.be/…)"
                value={video.videoUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
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
        )}
        {showDetails && (
          <div className="flex gap-3">
            {video.thumbnail && (
              <img
                src={video.thumbnail}
                alt=""
                className="h-20 w-36 shrink-0 rounded-md border border-zinc-700 object-cover"
              />
            )}
            <div className="min-w-0 flex-1 space-y-2">
              <Input
                type="text"
                placeholder="Video title"
                value={video.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                className="border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-blue-500"
              />
              {video.videoUrl && (
                <p className="truncate text-xs text-zinc-500">{video.videoUrl}</p>
              )}
            </div>
          </div>
        )}
        <p className="text-[11px] text-zinc-600">Updated {formatDate(video.updatedAt)}</p>
      </CardContent>
    </Card>
  )
}
