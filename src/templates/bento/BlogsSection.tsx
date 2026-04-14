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
    <section id="blogs" className="bg-[#0a0a14] py-8" aria-labelledby="blogs-title">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="blogs-title" className="text-lg font-bold text-white">Blogs</h2>
          {blogs.length > PREVIEW_COUNT && (
            <Link to="/blogs" className="text-xs font-semibold text-indigo-400 hover:underline">
              View all {blogs.length} →
            </Link>
          )}
        </div>
        {/* First post spans full width, rest fill columns */}
        <div className="grid gap-4 md:grid-cols-2">
          {(loading ? [] : preview).map((blog, i) => (
            <BlogCard key={blog.id} blog={blog} large={i === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}
