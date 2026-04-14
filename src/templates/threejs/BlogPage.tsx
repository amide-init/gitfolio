import { useParams, Link } from 'react-router-dom'
import { useSiteData } from '../../hooks/useSiteData'
import { getDOMFromJSON } from 'luxe-edit'
import ReactMarkdown from 'react-markdown'

export default function ThreejsBlogPage() {
  const { id } = useParams<{ id: string }>()
  const { blogs, loading, error } = useSiteData()
  const blog = id ? blogs.find((b) => b.id === id) : null

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050509] px-6 py-16">
        <p className="text-sm text-slate-500">Loading…</p>
      </div>
    )
  }
  if (error || !blog) {
    return (
      <div className="min-h-screen bg-[#050509] px-6 py-16">
        <p className="text-sm text-rose-400">{error || 'Blog not found.'}</p>
        <Link to="/blogs" className="mt-4 inline-block text-sm font-medium text-blue-400 hover:underline">
          ← Back to blogs
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050509]">
      <article className="mx-auto max-w-3xl px-6 py-16">
        <Link
          to="/blogs"
          className="mb-6 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 hover:text-blue-400"
        >
          ← Blogs
        </Link>
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-100">{blog.title || 'Untitled'}</h1>
        </header>

        {blog.contentJSON ? (
          <div
            className="prose prose-invert max-w-none text-sm text-slate-300"
            dangerouslySetInnerHTML={{ __html: getDOMFromJSON(blog.contentJSON) }}
          />
        ) : (
          <div className="prose prose-invert max-w-none text-sm text-slate-300">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="mb-2 mt-6 text-lg font-semibold text-slate-100">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="mb-2 mt-4 text-base font-semibold text-slate-100">{children}</h2>
                ),
                p: ({ children }) => <p className="my-3 leading-relaxed text-slate-300">{children}</p>,
                ul: ({ children }) => <ul className="my-3 list-disc pl-6">{children}</ul>,
                ol: ({ children }) => <ol className="my-3 list-decimal pl-6">{children}</ol>,
                li: ({ children }) => <li className="my-0.5">{children}</li>,
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    {children}
                  </a>
                ),
                code: ({ children }) => (
                  <code className="rounded border border-blue-900/40 bg-[#0d1220] px-1.5 py-0.5 text-xs text-blue-300">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="my-4 overflow-x-auto rounded-xl border border-blue-900/40 bg-[#0d1220] p-4 text-xs">
                    {children}
                  </pre>
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
