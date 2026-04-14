import { useParams, Link } from 'react-router-dom'
import { useSiteData } from '../../hooks/useSiteData'
import { getDOMFromJSON } from 'luxe-edit'
import ReactMarkdown from 'react-markdown'

export default function BentoBlogPage() {
  const { id } = useParams<{ id: string }>()
  const { blogs, loading, error } = useSiteData()
  const blog = id ? blogs.find((b) => b.id === id) : null

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a14]">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <p className="text-sm text-slate-500">Loading…</p>
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-[#0a0a14]">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <p className="text-sm text-rose-400">{error || 'Blog not found.'}</p>
          <Link to="/blogs" className="mt-4 inline-block text-sm font-medium text-indigo-400 hover:underline">
            ← Back to blogs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a14]">
      <article className="mx-auto max-w-3xl px-6 py-16">
        <Link to="/blogs" className="mb-8 inline-block text-xs font-semibold uppercase tracking-widest text-slate-500 hover:text-indigo-400">
          ← Blogs
        </Link>

        {/* Article header tile */}
        <div className="mb-10 rounded-3xl border border-white/8 bg-[#111122] px-8 py-8">
          <h1 className="text-3xl font-bold text-white">{blog.title || 'Untitled'}</h1>
        </div>

        {blog.contentJSON ? (
          <div
            className="prose prose-invert max-w-none text-sm text-slate-300"
            dangerouslySetInnerHTML={{ __html: getDOMFromJSON(blog.contentJSON) }}
          />
        ) : (
          <div className="prose prose-invert max-w-none text-sm text-slate-300">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="mb-3 mt-8 text-2xl font-bold text-white">{children}</h1>,
                h2: ({ children }) => <h2 className="mb-2 mt-6 text-xl font-semibold text-white">{children}</h2>,
                p: ({ children }) => <p className="my-4 leading-relaxed text-slate-300">{children}</p>,
                ul: ({ children }) => <ul className="my-4 list-disc pl-6 text-slate-300">{children}</ul>,
                ol: ({ children }) => <ol className="my-4 list-decimal pl-6 text-slate-300">{children}</ol>,
                li: ({ children }) => <li className="my-1">{children}</li>,
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noreferrer" className="font-medium text-indigo-400 hover:underline">{children}</a>
                ),
                code: ({ children }) => (
                  <code className="rounded-lg border border-white/8 bg-[#111122] px-1.5 py-0.5 text-sm text-indigo-300">{children}</code>
                ),
                pre: ({ children }) => (
                  <pre className="my-5 overflow-x-auto rounded-3xl border border-white/8 bg-[#111122] p-6 text-sm">{children}</pre>
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
