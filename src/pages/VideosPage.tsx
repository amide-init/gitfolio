import { useSiteData } from '../hooks/useSiteData'
import VideoCard from '../components/VideoCard'

export default function VideosPage() {
  const { videos, loading, error } = useSiteData()

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
          Videos
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          YouTube videos and talks.
        </p>
      </header>
      {error && (
        <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
      )}
      {loading && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Loading…
        </p>
      )}
      {!loading && !error && videos.length === 0 && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No videos yet.
        </p>
      )}
      {!loading && videos.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  )
}
