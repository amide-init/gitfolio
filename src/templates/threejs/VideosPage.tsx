import { useSiteData } from '../../hooks/useSiteData'
import VideoCard from './VideoCard'

export default function ThreejsVideosPage() {
  const { videos, loading, error } = useSiteData()

  return (
    <div className="min-h-screen bg-[#050509] px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-blue-400">
            Videos
          </p>
          <h1 className="text-2xl font-bold text-slate-100">Videos &amp; Talks</h1>
          <p className="mt-1 text-sm text-slate-400">YouTube videos and talks.</p>
        </header>
        {error && <p className="text-sm text-rose-400">{error}</p>}
        {loading && <p className="text-sm text-slate-500">Loading…</p>}
        {!loading && !error && videos.length === 0 && (
          <p className="text-sm text-slate-500">No videos yet.</p>
        )}
        {!loading && videos.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
