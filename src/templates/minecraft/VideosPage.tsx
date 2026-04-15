import { useSiteData } from '../../hooks/useSiteData'
import VideoCard from './VideoCard'

export default function MinecraftVideosPage() {
  const { videos, loading, error } = useSiteData()

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-[#5c7a29] mb-1">🎬 Jukebox Recordings</p>
          <h1 className="text-2xl font-bold text-white drop-shadow-[2px_2px_0_#3f3f00]">All Videos</h1>
          <p className="mt-1 text-xs text-[#777]">
            {loading ? 'Loading...' : `${videos.length} recordings found`}
          </p>
        </div>
        {error && <p className="text-xs text-[#FF5555]">{error}</p>}
        {loading && <p className="text-xs text-[#5c7a29] animate-pulse">Loading world...</p>}
        {!loading && videos.length === 0 && (
          <p className="text-xs text-[#777]">No recordings found.</p>
        )}
        <div className="grid gap-2">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </div>
  )
}
