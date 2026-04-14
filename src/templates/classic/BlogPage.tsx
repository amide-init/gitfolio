import { useParams, Link } from 'react-router-dom'
import { useSiteData } from '../../hooks/useSiteData'
import { getDOMFromJSON } from 'luxe-edit'
import ReactMarkdown from 'react-markdown'

export default function ClassicBlogPage() {
  const { id } = useParams<{ id: string }>()
  const { blogs, loading, error } = useSiteData()
  const blog = id ? blogs.find((b) => b.id === id) : null

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 min-h-screen">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <p className="text-base text-slate-500">Loading…</p>
        </div>
      </div>
    )
  }
  if (error || !blog) {
    return (
      <div className="bg-white dark:bg-slate-900 min-h-screen">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <p className="text-base text-rose-600 dark:text-rose-400">{error || 'Blog not found.'}</p>
          <Link to="/blogs" className="mt-4 inline-block text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
            ← Back to blogs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen">
      <article className="mx-auto max-w-3xl px-6 py-16">
        <Link
          to="/blogs"
          className="mb-8 inline-block text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
        >
          ← All blogs
        </Link>
        <header className="mb-10 border-b border-slate-200 pb-8 dark:border-slate-700">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
            {blog.title || 'Untitled'}
          </h1>
        </header>

        {blog.contentJSON ? (
          <div
            className="prose prose-slate dark:prose-invert max-w-none text-base text-slate-700 dark:text-slate-300"
            dangerouslySetInnerHTML={{ __html: getDOMFromJSON(blog.contentJSON) }}
          />
        ) : (
          <div className="prose prose-slate dark:prose-invert max-w-none text-base text-slate-700 dark:text-slate-300">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="mb-3 mt-8 text-2xl font-bold text-slate-900 dark:text-slate-100">{children}</h1>,
                h2: ({ children }) => <h2 className="mb-2 mt-6 text-xl font-semibold text-slate-900 dark:text-slate-100">{children}</h2>,
                p: ({ children }) => <p className="my-4 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="my-4 list-disc pl-6">{children}</ul>,
                ol: ({ children }) => <ol className="my-4 list-decimal pl-6">{children}</ol>,
                li: ({ children }) => <li className="my-1">{children}</li>,
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noreferrer" className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">{children}</a>
                ),
                code: ({ children }) => (
                  <code className="rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-sm dark:border-slate-700 dark:bg-slate-800">{children}</code>
                ),
                pre: ({ children }) => (
                  <pre className="my-5 overflow-x-auto rounded-xl border border-slate-200 bg-slate-100 p-5 text-sm dark:border-slate-700 dark:bg-slate-800">{children}</pre>
                ),
              }}
            >
              {blog.content || ''}
            </ReactMarkdown>
          </div>
        )}
      </article>
    </div>
  )
}
