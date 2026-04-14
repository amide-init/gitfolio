import { useSiteData } from '../../hooks/useSiteData'
import BlogCard from './BlogCard'

export default function ThreejsBlogsPage() {
  const { blogs, loading, error } = useSiteData()

  return (
    <div className="min-h-screen bg-[#050509] px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-blue-400">
            Blogs
          </p>
          <h1 className="text-2xl font-bold text-slate-100">Articles &amp; Reads</h1>
          <p className="mt-1 text-sm text-slate-400">Articles and longer reads.</p>
        </header>
        {error && <p className="text-sm text-rose-400">{error}</p>}
        {loading && <p className="text-sm text-slate-500">Loading…</p>}
        {!loading && !error && blogs.length === 0 && (
          <p className="text-sm text-slate-500">No blogs yet.</p>
        )}
        {!loading && blogs.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} excerptLength={160} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
