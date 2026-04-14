import { useSiteData } from '../../hooks/useSiteData'
import VideoCard from './VideoCard'

export default function HackerVideosPage() {
  const { videos, loading, error } = useSiteData()

  return (
    <div className="min-h-screen bg-black font-mono">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-6">
          <p className="text-xs text-green-700 select-none">~/profile ❯ ls -lt videos/</p>
          <p className="mt-1 text-sm text-green-500">
            <span className="text-green-800">total </span>
            {loading ? '…' : videos.length}
          </p>
        </div>
        {error && <p className="text-xs text-red-700">{error}</p>}
        {loading && <p className="text-xs text-green-800 animate-pulse">loading…</p>}
        {!loading && videos.length === 0 && (
          <p className="text-xs text-green-800">no videos found.</p>
        )}
        <div className="space-y-px">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </div>
  )
}
