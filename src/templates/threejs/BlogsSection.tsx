import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { useSiteData } from '../../hooks/useSiteData'
import BlogCard from './BlogCard'

const ParticleField = lazy(() => import('./ParticleField'))

const PREVIEW_COUNT = 3

export default function BlogsSection() {
  const { blogs, loading } = useSiteData()
  const preview = blogs.slice(0, PREVIEW_COUNT)

  if (loading && preview.length === 0) return null
  if (!loading && blogs.length === 0) return null

  return (
    <section
      id="blogs"
      className="relative overflow-hidden border-t border-blue-900/30 bg-[#050509] py-16"
      aria-labelledby="blogs-title"
    >
      <Suspense fallback={null}>
        <ParticleField count={30} color={0x8b5cf6} opacity={0.18} />
      </Suspense>

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-purple-400">
              Blogs
            </p>
            <p className="text-sm leading-relaxed text-slate-400">Articles and longer reads.</p>
          </div>
          {blogs.length > PREVIEW_COUNT && (
            <Link
              to="/blogs"
              className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-purple-400 hover:text-purple-300 transition-colors"
            >
              See all ({blogs.length})
              <svg className="h-3 w-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </header>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {(loading ? [] : preview).map((blog, i) => (
            <BlogCard key={blog.id} blog={blog} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
