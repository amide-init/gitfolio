import { useSiteData } from '../../hooks/useSiteData'
import BlogCard from './BlogCard'

export default function NetflixBlogsPage() {
  const { blogs, loading, error } = useSiteData()

  return (
    <div className="min-h-screen bg-[#141414]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#e50914]">Collection</p>
          <h1 className="text-4xl font-black text-white">Articles &amp; Blogs</h1>
          <p className="mt-2 text-sm text-[#999]">Long reads, tutorials, and thoughts.</p>
        </header>
        {error && <p className="text-sm text-rose-400">{error}</p>}
        {loading && <p className="text-sm text-[#999]">Loading…</p>}
        {!loading && !error && blogs.length === 0 && (
          <p className="text-sm text-[#999]">No articles yet.</p>
        )}
        {!loading && blogs.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {blogs.map((blog, i) => (
              <BlogCard key={blog.id} blog={blog} excerptLength={120} large={i === 0 && blogs.length > 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
