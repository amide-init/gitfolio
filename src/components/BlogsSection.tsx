import { Link } from 'react-router-dom'
import { useSiteData } from '../hooks/useSiteData'
import BlogCard from './BlogCard'

const PREVIEW_COUNT = 3

export default function BlogsSection() {
  const { blogs, loading } = useSiteData()
  const preview = blogs.slice(0, PREVIEW_COUNT)

  if (loading && preview.length === 0) return null
  if (!loading && blogs.length === 0) return null

  return (
    <section
      id="blogs"
      className="border-t border-slate-200 bg-slate-50 py-12 dark:border-slate-800 dark:bg-[#050509]"
      aria-labelledby="blogs-title"
    >
      <div className="mx-auto max-w-5xl px-6">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2
              id="blogs-title"
              className="mb-2 text-xs font-semibold uppercase tracking-[0.26em] text-slate-600 dark:text-slate-300"
            >
              Blogs
            </h2>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              Articles and longer reads.
            </p>
          </div>
          {blogs.length > PREVIEW_COUNT && (
            <Link
              to="/blogs"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              See all ({blogs.length})
            </Link>
          )}
        </header>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {(loading ? [] : preview).map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
    </section>
  )
}
