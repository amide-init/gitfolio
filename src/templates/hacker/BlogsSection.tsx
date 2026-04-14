import { Link } from 'react-router-dom'
import { useSiteData } from '../../hooks/useSiteData'
import BlogCard from './BlogCard'

const PREVIEW_COUNT = 5

export default function BlogsSection() {
  const { blogs, loading } = useSiteData()
  const preview = blogs.slice(0, PREVIEW_COUNT)

  if (loading && preview.length === 0) return null
  if (!loading && blogs.length === 0) return null

  return (
    <section id="blogs" className="bg-black py-10 font-mono" aria-labelledby="blogs-title">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-green-700 select-none">~/profile ❯ ls -t blog/</p>
            <p id="blogs-title" className="mt-1 text-sm text-green-500">
              <span className="text-green-800">total </span>{blogs.length}
            </p>
          </div>
          {blogs.length > PREVIEW_COUNT && (
            <Link to="/blogs" className="text-xs text-green-700 transition hover:text-green-400">
              view all →
            </Link>
          )}
        </div>
        <div className="space-y-px">
          {(loading ? [] : preview).map((blog, i) => (
            <BlogCard key={blog.id} blog={blog} featured={i === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}
