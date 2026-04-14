import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { useSiteData } from '../../hooks/useSiteData'
import BlogCard from './BlogCard'

const ParticleField = lazy(() => import('./ParticleField'))

export default function ThreejsBlogsPage() {
  const { blogs, loading, error } = useSiteData()

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050509]">
      <Suspense fallback={null}>
        <ParticleField count={50} color={0x8b5cf6} opacity={0.2} />
      </Suspense>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-16">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-purple-400 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-purple-400">Blogs</span>
        </div>

        <header className="mb-12">
          <div className="mb-4 h-px w-12 bg-gradient-to-r from-purple-500 to-pink-400" />
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-purple-400">
            Blogs
          </p>
          <h1 className="text-2xl font-bold text-slate-100">Articles &amp; Reads</h1>
          <p className="mt-1 text-sm text-slate-400">Articles and longer reads.</p>
          {!loading && blogs.length > 0 && (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-purple-900/40 bg-purple-500/10 px-3 py-1 text-[11px] font-medium text-purple-300">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
              {blogs.length} article{blogs.length !== 1 ? 's' : ''}
            </p>
          )}
        </header>

        {error && <p className="text-sm text-rose-400">{error}</p>}
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-xl bg-purple-900/10" />
            ))}
          </div>
        )}
        {!loading && !error && blogs.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-purple-900/40 bg-purple-500/10">
              <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <p className="text-sm text-slate-500">No blogs yet.</p>
          </div>
        )}
        {!loading && blogs.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {blogs.map((blog, i) => (
              <BlogCard key={blog.id} blog={blog} excerptLength={160} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
