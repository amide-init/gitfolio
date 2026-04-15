import { Link } from 'react-router-dom'
import { useSiteData } from '../../hooks/useSiteData'
import VideoCard from './VideoCard'
import { useInView } from './useInView'

const PREVIEW_COUNT = 3

export default function VideosSection() {
  const { videos, loading } = useSiteData()
  const { ref, visible } = useInView()
  const preview = videos.slice(0, PREVIEW_COUNT)

  if (loading && preview.length === 0) return null
  if (!loading && videos.length === 0) return null

  return (
    <section id="videos" className="bg-[#1a1a2e] py-12" aria-labelledby="videos-title">
      <div ref={ref} className="mx-auto max-w-4xl px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#5c7a29] mb-1">🎬 Jukebox Recordings</p>
            <h2 id="videos-title" className="text-xl font-bold text-white drop-shadow-[2px_2px_0_#3f3f00]">
              Videos
            </h2>
            <p className="mt-1 text-xs text-[#777]">{videos.length} recordings found</p>
          </div>
          {videos.length > PREVIEW_COUNT && (
            <Link
              to="/videos"
              className="relative inline-block border-2 border-[#3b3b3b] bg-[#6b6b6b] px-3 py-1 text-xs font-bold text-[#5c7a29] transition-all hover:bg-[#555555] hover:text-[#8acd32]"
            >
              View All →
            </Link>
          )}
        </div>
        <div className="grid gap-2">
          {(loading ? [] : preview).map((video, i) => (
            <div
              key={video.id}
              className={visible ? 'animate-mc-fade-up' : 'opacity-0'}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <VideoCard video={video} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
