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
    <section
      id="videos"
      className="border-b border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900"
      aria-labelledby="videos-title"
    >
      <div className="mx-auto max-w-5xl px-6">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2
              id="videos-title"
              className="text-2xl font-bold text-slate-900 dark:text-slate-50"
            >
              Videos
            </h2>
            <p className="mt-1 text-base text-slate-600 dark:text-slate-300">
              YouTube videos and talks.
            </p>
          </div>
          {videos.length > PREVIEW_COUNT && (
            <Link
              to="/videos"
              className="text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              View all {videos.length} →
            </Link>
          )}
        </header>
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {(loading ? [] : preview).map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </section>
  )
}
