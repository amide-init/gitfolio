import { useParams, Link } from 'react-router-dom'
import { useSiteData } from '../hooks/useSiteData'
import ReactMarkdown from 'react-markdown'

export default function BlogPage() {
  const { id } = useParams<{ id: string }>()
  const { blogs, loading, error } = useSiteData()
  const blog = id ? blogs.find((b) => b.id === id) : null

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-sm text-slate-500">Loading…</p>
      </div>
    )
  }
  if (error || !blog) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-sm text-rose-600 dark:text-rose-400">
          {error || 'Blog not found.'}
        </p>
        <Link
          to="/blogs"
          className="mt-4 inline-block text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          ← Back to blogs
        </Link>
      </div>
    )
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <Link
        to="/blogs"
        className="mb-6 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
      >
        ← Blogs
      </Link>
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          {blog.title || 'Untitled'}
        </h1>
      </header>
      <div className="prose prose-slate dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="mb-2 mt-6 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="mb-2 mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">
                {children}
              </h2>
            ),
            p: ({ children }) => <p className="my-3 leading-relaxed">{children}</p>,
            ul: ({ children }) => <ul className="my-3 list-disc pl-6">{children}</ul>,
            ol: ({ children }) => <ol className="my-3 list-decimal pl-6">{children}</ol>,
            li: ({ children }) => <li className="my-0.5">{children}</li>,
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {children}
              </a>
            ),
            code: ({ children }) => (
              <code className="rounded bg-slate-200 px-1.5 py-0.5 text-xs dark:bg-slate-800">
                {children}
              </code>
            ),
            pre: ({ children }) => (
              <pre className="my-4 overflow-x-auto rounded-lg bg-slate-200 p-4 text-xs dark:bg-slate-800">
                {children}
              </pre>
            ),
          }}
        >
          {blog.content || ''}
        </ReactMarkdown>
      </div>
    </article>
  )
}
