import { Link } from 'react-router-dom'
import { useSiteData } from '../../hooks/useSiteData'
import BlogCard from './BlogCard'

const PREVIEW_COUNT = 6

export default function BlogsSection() {
  const { blogs, loading } = useSiteData()
  const preview = blogs.slice(0, PREVIEW_COUNT)

  if (loading && preview.length === 0) return null
  if (!loading && blogs.length === 0) return null

  return (
    <section id="blogs" className="bg-[#141414] py-8" aria-labelledby="blogs-title">
      <div className="mx-auto max-w-6xl px-6">
        {/* Row header */}
        <div className="mb-4 flex items-baseline gap-4">
          <h2 id="blogs-title" className="text-xl font-bold text-white">Articles &amp; Blogs</h2>
          {blogs.length > PREVIEW_COUNT && (
            <Link to="/blogs" className="text-xs font-semibold text-[#54b3d6] hover:text-white transition">
              Explore All &rsaquo;
            </Link>
          )}
        </div>

        {/* Horizontal scroll row */}
        <div
          className="flex gap-3 overflow-x-auto pb-4"
          style={{ scrollbarWidth: 'thin' }}
        >
          {(loading ? [] : preview).map((blog, i) => (
            <BlogCard key={blog.id} blog={blog} large={i === 0 && preview.length >= 3} />
          ))}
        </div>
      </div>
    </section>
  )
}
