import { Link } from 'react-router-dom'
import { useSiteData } from '../../hooks/useSiteData'
import BlogCard from './BlogCard'
import { useInView } from './useInView'

const PREVIEW_COUNT = 5

export default function BlogsSection() {
  const { blogs, loading } = useSiteData()
  const { ref, visible } = useInView()
  const preview = blogs.slice(0, PREVIEW_COUNT)

  if (loading && preview.length === 0) return null
  if (!loading && blogs.length === 0) return null

  return (
    <section id="blogs" className="bg-[#1a1a2e] py-12" aria-labelledby="blogs-title">
      <div ref={ref} className="mx-auto max-w-4xl px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#5c7a29] mb-1">📜 Scroll Archive</p>
            <h2 id="blogs-title" className="text-xl font-bold text-white drop-shadow-[2px_2px_0_#3f3f00]">
              Blog Posts
            </h2>
            <p className="mt-1 text-xs text-[#777]">{blogs.length} scrolls found</p>
          </div>
          {blogs.length > PREVIEW_COUNT && (
            <Link
              to="/blogs"
              className="relative inline-block border-2 border-[#3b3b3b] bg-[#6b6b6b] px-3 py-1 text-xs font-bold text-[#5c7a29] transition-all hover:bg-[#555555] hover:text-[#8acd32]"
            >
              View All →
            </Link>
          )}
        </div>
        <div className="grid gap-2">
          {(loading ? [] : preview).map((blog, i) => (
            <div
              key={blog.id}
              className={visible ? 'animate-mc-fade-up' : 'opacity-0'}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <BlogCard blog={blog} featured={i === 0} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
