import { useParams, Link } from 'react-router-dom'
import { useSiteData } from '../../hooks/useSiteData'
import { getDOMFromJSON } from 'luxe-edit'
import ReactMarkdown from 'react-markdown'

export default function NetflixBlogPage() {
  const { id } = useParams<{ id: string }>()
  const { blogs, loading, error } = useSiteData()
  const blog = id ? blogs.find((b) => b.id === id) : null

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414]">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <p className="text-sm text-[#999]">Loading…</p>
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-[#141414]">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <p className="text-sm text-rose-400">{error || 'Article not found.'}</p>
          <Link to="/blogs" className="mt-4 inline-block text-sm font-semibold text-[#e50914] hover:text-[#f40612] transition">
            ← Back to Articles
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      {/* Cinematic top bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#e50914] to-[#b81d24]" />

      <article className="mx-auto max-w-3xl px-6 py-12">
        <Link
          to="/blogs"
          className="mb-8 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[#999] hover:text-white transition"
        >
          ← Articles
        </Link>

        {/* Article header */}
        <div className="mb-10 border-l-4 border-[#e50914] pl-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#e50914]">Article</p>
          <h1 className="text-4xl font-black text-white leading-tight">{blog.title || 'Untitled'}</h1>
        </div>

        {blog.contentJSON ? (
          <div
            className="prose prose-invert max-w-none text-sm text-[#d2d2d2]"
            dangerouslySetInnerHTML={{ __html: getDOMFromJSON(blog.contentJSON) }}
          />
        ) : (
          <div className="prose prose-invert max-w-none text-sm text-[#d2d2d2]">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="mb-3 mt-8 text-2xl font-black text-white">{children}</h1>,
                h2: ({ children }) => <h2 className="mb-2 mt-6 text-xl font-bold text-white">{children}</h2>,
                p: ({ children }) => <p className="my-4 leading-relaxed text-[#d2d2d2]">{children}</p>,
                ul: ({ children }) => <ul className="my-4 list-disc pl-6 text-[#d2d2d2]">{children}</ul>,
                ol: ({ children }) => <ol className="my-4 list-decimal pl-6 text-[#d2d2d2]">{children}</ol>,
                li: ({ children }) => <li className="my-1">{children}</li>,
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noreferrer" className="font-semibold text-[#e50914] hover:text-[#f40612] transition">{children}</a>
                ),
                code: ({ children }) => (
                  <code className="rounded bg-[#2a2a2a] px-1.5 py-0.5 text-sm text-[#e50914]">{children}</code>
                ),
                pre: ({ children }) => (
                  <pre className="my-5 overflow-x-auto rounded-sm border border-[#333] bg-[#1f1f1f] p-6 text-sm">{children}</pre>
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
