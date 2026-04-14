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

export default function BlogCard({ blog, excerptLength = 120, large = false }: BlogCardProps) {
  const excerpt = stripMarkdown(blog.content, large ? 200 : excerptLength)

  return (
    <article className={`flex flex-col rounded-3xl border border-white/8 bg-[#111122] p-6 transition hover:border-indigo-500/40 hover:bg-[#13132a] ${large ? 'md:col-span-2' : ''}`}>
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15">
        <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className={`font-semibold text-white ${large ? 'text-base' : 'text-sm'}`}>
        <Link to={`/blog/${blog.id}`} className="hover:text-indigo-300 transition">
          {blog.title || 'Untitled'}
        </Link>
      </h3>
      {excerpt && (
        <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-slate-400">
          {excerpt}
        </p>
      )}
      <div className="mt-auto pt-4">
        <Link
          to={`/blog/${blog.id}`}
          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition"
        >
          Read article →
        </Link>
      </div>
    </article>
  )
}
