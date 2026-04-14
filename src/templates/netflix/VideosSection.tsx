import { Link } from 'react-router-dom'
import { useSiteData } from '../../hooks/useSiteData'
import VideoCard from './VideoCard'

const PREVIEW_COUNT = 6

export default function VideosSection() {
  const { videos, loading } = useSiteData()
  const preview = videos.slice(0, PREVIEW_COUNT)

  if (loading && preview.length === 0) return null
  if (!loading && videos.length === 0) return null

  return (
    <section id="videos" className="bg-[#141414] py-8" aria-labelledby="videos-title">
      <div className="mx-auto max-w-6xl px-6">
        {/* Row header */}
        <div className="mb-4 flex items-baseline gap-4">
          <h2 id="videos-title" className="text-xl font-bold text-white">Videos</h2>
          {videos.length > PREVIEW_COUNT && (
            <Link to="/videos" className="text-xs font-semibold text-[#54b3d6] hover:text-white transition">
              Explore All &rsaquo;
            </Link>
          )}
        </div>

        {/* Horizontal scroll row */}
        <div
          className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[#444] scrollbar-track-transparent"
          style={{ scrollbarWidth: 'thin' }}
        >
          {(loading ? [] : preview).map((video, i) => (
            <VideoCard key={video.id} video={video} large={i === 0 && preview.length >= 3} />
          ))}
        </div>
      </div>
    </section>
  )
}
