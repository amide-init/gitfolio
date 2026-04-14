import { Link } from 'react-router-dom'
import { useSiteData } from '../../hooks/useSiteData'
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
      className="border-b border-slate-200 bg-slate-50 py-16 dark:border-slate-800 dark:bg-slate-900/50"
      aria-labelledby="blogs-title"
    >
      <div className="mx-auto max-w-5xl px-6">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2
              id="blogs-title"
              className="text-2xl font-bold text-slate-900 dark:text-slate-50"
            >
              Blogs
            </h2>
            <p className="mt-1 text-base text-slate-600 dark:text-slate-300">
              Articles and longer reads.
            </p>
          </div>
          {blogs.length > PREVIEW_COUNT && (
            <Link
              to="/blogs"
              className="text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              View all {blogs.length} →
            </Link>
          )}
        </header>
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {(loading ? [] : preview).map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
    </section>
  )
}
