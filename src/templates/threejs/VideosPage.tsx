import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { useSiteData } from '../../hooks/useSiteData'
import VideoCard from './VideoCard'

const ParticleField = lazy(() => import('./ParticleField'))

export default function ThreejsVideosPage() {
  const { videos, loading, error } = useSiteData()

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050509]">
      <Suspense fallback={null}>
        <ParticleField count={50} color={0x3b82f6} opacity={0.2} />
      </Suspense>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-16">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-blue-400">Videos</span>
        </div>

        <header className="mb-12">
          {/* Decorative top line */}
          <div className="mb-4 h-px w-12 bg-gradient-to-r from-blue-500 to-cyan-400" />
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-blue-400">
            Videos
          </p>
          <h1 className="text-2xl font-bold text-slate-100">Videos &amp; Talks</h1>
          <p className="mt-1 text-sm text-slate-400">YouTube videos and talks.</p>
          {!loading && videos.length > 0 && (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-blue-900/40 bg-blue-500/10 px-3 py-1 text-[11px] font-medium text-blue-300">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              {videos.length} video{videos.length !== 1 ? 's' : ''}
            </p>
          )}
        </header>

        {error && <p className="text-sm text-rose-400">{error}</p>}
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-video animate-pulse rounded-xl bg-blue-900/10" />
            ))}
          </div>
        )}
        {!loading && !error && videos.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-900/40 bg-blue-500/10">
              <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <p className="text-sm text-slate-500">No videos yet.</p>
          </div>
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
