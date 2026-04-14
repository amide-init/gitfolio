import { useSiteData } from '../../hooks/useSiteData'
import BlogCard from './BlogCard'

export default function ClassicBlogsPage() {
  const { blogs, loading, error } = useSiteData()

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <header className="mb-10 border-b border-slate-200 pb-8 dark:border-slate-700">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Blogs</h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
            Articles and longer reads.
          </p>
        </header>
        {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}
        {loading && <p className="text-base text-slate-500 dark:text-slate-400">Loading…</p>}
        {!loading && !error && blogs.length === 0 && (
          <p className="text-base text-slate-500 dark:text-slate-400">No blogs yet.</p>
        )}
        {!loading && blogs.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} excerptLength={160} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
