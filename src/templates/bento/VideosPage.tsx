import { useSiteData } from '../../hooks/useSiteData'
import VideoCard from './VideoCard'

export default function BentoVideosPage() {
  const { videos, loading, error } = useSiteData()

  return (
    <div className="min-h-screen bg-[#0a0a14]">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-white">Videos</h1>
          <p className="mt-1 text-sm text-slate-400">YouTube videos and talks.</p>
        </header>
        {error && <p className="text-sm text-rose-400">{error}</p>}
        {loading && <p className="text-sm text-slate-500">Loading…</p>}
        {!loading && !error && videos.length === 0 && (
          <p className="text-sm text-slate-500">No videos yet.</p>
        )}
        {!loading && videos.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {videos.map((video, i) => (
              <VideoCard key={video.id} video={video} large={i === 0 && videos.length > 2} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
