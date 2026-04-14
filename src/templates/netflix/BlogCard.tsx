import { Link } from 'react-router-dom'
import type { Blog } from '../../types/contentTypes'

function stripMarkdown(text: string, maxLen: number): string {
  const plain = text
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`[^`]+`/g, '')
    .replace(/\n+/g, ' ')
    .trim()
  if (plain.length <= maxLen) return plain
  return plain.slice(0, maxLen).trim() + '…'
}

type BlogCardProps = {
  blog: Blog
  excerptLength?: number
  large?: boolean
}

export default function BlogCard({ blog, excerptLength = 100, large = false }: BlogCardProps) {
  const excerpt = stripMarkdown(blog.content, large ? 180 : excerptLength)

  return (
    <article
      className={`group relative flex-shrink-0 overflow-hidden rounded-sm bg-[#1f1f1f] transition-transform duration-200 hover:scale-105 hover:z-10 ${
        large ? 'w-72 sm:w-80' : 'w-48 sm:w-56'
      }`}
    >
      <Link to={`/blog/${blog.id}`} className="block">
        {/* Banner */}
        <div className="relative flex aspect-video w-full items-center justify-center bg-gradient-to-br from-[#e50914]/80 to-[#8b0000]/80">
          <span className="text-3xl font-black text-white/20 select-none uppercase tracking-wider line-clamp-2 text-center px-2">
            {blog.title || 'Blog'}
          </span>
          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition group-hover:opacity-100">
            <span className="rounded-sm bg-white/90 px-3 py-1 text-xs font-bold text-black">Read</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#e50914] mb-1">Article</p>
          <h3 className="line-clamp-2 text-xs font-semibold text-white">
            {blog.title || 'Untitled'}
          </h3>
          {excerpt && (
            <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[#999]">
              {excerpt}
            </p>
          )}
        </div>
      </Link>
    </article>
  )
}
