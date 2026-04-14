import { Link } from 'react-router-dom'
import { useSiteData } from '../../hooks/useSiteData'
import VideoCard from './VideoCard'

const PREVIEW_COUNT = 3

export default function VideosSection() {
  const { videos, loading } = useSiteData()
  const preview = videos.slice(0, PREVIEW_COUNT)

  if (loading && preview.length === 0) return null
  if (!loading && videos.length === 0) return null

  return (
    <section id="videos" className="bg-[#0a0a14] py-8" aria-labelledby="videos-title">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="videos-title" className="text-lg font-bold text-white">Videos</h2>
          {videos.length > PREVIEW_COUNT && (
            <Link to="/videos" className="text-xs font-semibold text-indigo-400 hover:underline">
              View all {videos.length} →
            </Link>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {(loading ? [] : preview).map((video, i) => (
            <VideoCard key={video.id} video={video} large={i === 0 && preview.length >= 3} />
          ))}
        </div>
      </div>
    </section>
  )
}
