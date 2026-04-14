import { useSiteData } from '../../hooks/useSiteData'
import BlogCard from './BlogCard'

export default function BentoBlogsPage() {
  const { blogs, loading, error } = useSiteData()

  return (
    <div className="min-h-screen bg-[#0a0a14]">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-white">Blogs</h1>
          <p className="mt-1 text-sm text-slate-400">Articles and longer reads.</p>
        </header>
        {error && <p className="text-sm text-rose-400">{error}</p>}
        {loading && <p className="text-sm text-slate-500">Loading…</p>}
        {!loading && !error && blogs.length === 0 && (
          <p className="text-sm text-slate-500">No blogs yet.</p>
        )}
        {!loading && blogs.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {blogs.map((blog, i) => (
              <BlogCard key={blog.id} blog={blog} excerptLength={160} large={i === 0 && blogs.length > 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
