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
}

export default function BlogCard({ blog, excerptLength = 140 }: BlogCardProps) {
  const excerpt = stripMarkdown(blog.content, excerptLength)

  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-800/60">
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
          <Link
            to={`/blog/${blog.id}`}
            className="hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            {blog.title || 'Untitled'}
          </Link>
        </h3>
        {excerpt && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {excerpt}
          </p>
        )}
        <div className="mt-4">
          <Link
            to={`/blog/${blog.id}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Read article
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </article>
  )
}
