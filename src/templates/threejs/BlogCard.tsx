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

export default function BlogCard({ blog, excerptLength = 120 }: { blog: Blog; excerptLength?: number }) {
  const excerpt = stripMarkdown(blog.content, excerptLength)
  return (
    <article className="flex flex-col rounded-xl border border-blue-900/40 bg-gradient-to-b from-[#0d1220] to-[#080c18] p-5 transition hover:-translate-y-0.5 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]">
      <h3 className="text-sm font-semibold text-slate-100">
        <Link to={`/blog/${blog.id}`} className="hover:text-blue-400 transition-colors">
          {blog.title || 'Untitled'}
        </Link>
      </h3>
      {excerpt && (
        <p className="mt-2 line-clamp-3 text-[13px] text-slate-400">{excerpt}</p>
      )}
      <Link
        to={`/blog/${blog.id}`}
        className="mt-3 inline-flex text-xs font-medium text-blue-400 hover:text-blue-300 hover:underline"
      >
        Read more
      </Link>
    </article>
  )
}
