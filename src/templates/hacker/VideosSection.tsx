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
    <section id="videos" className="bg-black py-10 font-mono" aria-labelledby="videos-title">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-green-700 select-none">~/profile ❯ ls videos/</p>
            <p id="videos-title" className="mt-1 text-sm text-green-500">
              <span className="text-green-800">total </span>{videos.length}
            </p>
          </div>
          {videos.length > PREVIEW_COUNT && (
            <Link to="/videos" className="text-xs text-green-700 transition hover:text-green-400">
              view all →
            </Link>
          )}
        </div>
        <div className="space-y-px">
          {(loading ? [] : preview).map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </section>
  )
}
