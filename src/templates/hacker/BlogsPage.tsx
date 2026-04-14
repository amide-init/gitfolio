import { useSiteData } from '../../hooks/useSiteData'
import BlogCard from './BlogCard'

export default function HackerBlogsPage() {
  const { blogs, loading, error } = useSiteData()

  return (
    <div className="min-h-screen bg-black font-mono">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-6">
          <p className="text-xs text-green-700 select-none">~/profile ❯ ls -lt blog/</p>
          <p className="mt-1 text-sm text-green-500">
            <span className="text-green-800">total </span>
            {loading ? '…' : blogs.length}
            <span className="ml-3 text-green-900 text-xs"># all posts</span>
          </p>
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        {loading && <p className="text-xs text-green-800 animate-pulse">loading…</p>}
        {!loading && blogs.length === 0 && (
          <p className="text-xs text-green-800">no files found.</p>
        )}
        <div className="space-y-px">
          {blogs.map((blog, i) => (
            <BlogCard key={blog.id} blog={blog} featured={i === 0} />
          ))}
        </div>
      </div>
    </div>
  )
}
