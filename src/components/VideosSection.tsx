import { Link } from 'react-router-dom'
import { useSiteData } from '../hooks/useSiteData'
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
      className="border-t border-slate-200 bg-slate-50 py-12 dark:border-slate-800 dark:bg-[#050509]"
      aria-labelledby="videos-title"
    >
      <div className="mx-auto max-w-5xl px-6">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2
              id="videos-title"
              className="mb-2 text-xs font-semibold uppercase tracking-[0.26em] text-slate-600 dark:text-slate-300"
            >
              Videos
            </h2>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              YouTube videos and talks.
            </p>
          </div>
          {videos.length > PREVIEW_COUNT && (
            <Link
              to="/videos"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              See all ({videos.length})
            </Link>
          )}
        </header>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {(loading ? [] : preview).map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </section>
  )
}
