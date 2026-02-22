import { Link } from 'react-router-dom'
import type { Blog } from '../types/contentTypes'

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
}

export default function BlogCard({ blog, excerptLength = 120 }: BlogCardProps) {
  const excerpt = stripMarkdown(blog.content, excerptLength)

  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition dark:border-white/10 dark:bg-gradient-to-b dark:from-[#181829] dark:to-[#0a0a13] dark:shadow-[0_18px_45px_rgba(0,0,0,0.8)]">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
        <Link
          to={`/blog/${blog.id}`}
          className="hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          {blog.title || 'Untitled'}
        </Link>
      </h3>
      {excerpt && (
        <p className="mt-2 line-clamp-3 text-[13px] text-slate-700 dark:text-slate-300">
          {excerpt}
        </p>
      )}
      <Link
        to={`/blog/${blog.id}`}
        className="mt-3 inline-flex text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        Read more
      </Link>
    </article>
  )
}
