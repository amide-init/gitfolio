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
  return plain.length <= maxLen ? plain : plain.slice(0, maxLen).trim() + '…'
}

export default function BlogCard({ blog, featured }: { blog: Blog; featured?: boolean }) {
  const date = blog.createdAt?.slice(0, 10) ?? '????-??-??'
  const excerpt = stripMarkdown(blog.content, 100)

  return (
    <Link
      to={`/blog/${blog.id}`}
      className="group block border-l-2 border-green-900 py-2 pl-4 font-mono text-sm transition hover:border-green-500 hover:bg-[#030d03]"
    >
      <div className="flex items-start gap-2">
        <span className="mt-0.5 shrink-0 select-none text-green-800">▸</span>
        <div className="min-w-0">
          <p className="text-green-300 leading-snug group-hover:text-green-100 transition-colors">
            {featured && (
              <span className="mr-1.5 border border-amber-900 px-1 text-[10px] text-amber-700">PIN</span>
            )}
            {blog.title || 'Untitled'}
          </p>
          {excerpt && (
            <p className="mt-0.5 text-xs text-green-800 line-clamp-1">{excerpt}</p>
          )}
          <p className="mt-0.5 text-[11px] text-green-900">{date}</p>
        </div>
      </div>
    </Link>
  )
}
