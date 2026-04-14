import { useParams, Link } from 'react-router-dom'
import { useSiteData } from '../../hooks/useSiteData'
import { getDOMFromJSON } from 'luxe-edit'
import ReactMarkdown from 'react-markdown'

export default function HackerBlogPage() {
  const { id } = useParams<{ id: string }>()
  const { blogs, loading, error } = useSiteData()
  const blog = id ? blogs.find((b) => b.id === id) : null

  if (loading) {
    return (
      <div className="min-h-screen bg-black font-mono px-6 py-12">
        <p className="text-xs text-green-800 animate-pulse">reading file…</p>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-black font-mono px-6 py-12">
        <p className="text-xs text-red-700">{error || 'file not found'}</p>
        <Link to="/blogs" className="mt-3 inline-block text-xs text-green-700 hover:text-green-400">
          ← cd ../blogs
        </Link>
      </div>
    )
  }

  const date = blog.createdAt?.slice(0, 10) ?? ''

  return (
    <div className="min-h-screen bg-black font-mono">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link to="/blogs" className="text-xs text-green-800 transition hover:text-green-500">
          ← cd ../blogs
        </Link>

        {/* File header */}
        <div className="mt-6 border border-green-900/60 bg-[#030d03] p-4">
          <p className="text-xs text-green-800">
            <span className="text-green-700">file://</span>blog/{blog.id}
          </p>
          <h1 className="mt-2 text-base font-bold text-green-200">{blog.title || 'Untitled'}</h1>
          {date && <p className="mt-1 text-xs text-green-900">{date}</p>}
        </div>

        {/* Content */}
        <div className="mt-6 border-l-2 border-green-900/40 pl-4">
          {blog.contentJSON ? (
            <div
              className="hacker-prose text-sm text-green-500 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: getDOMFromJSON(blog.contentJSON) }}
            />
          ) : (
            <div className="text-sm text-green-500 leading-relaxed">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="mt-6 mb-2 text-base font-bold text-green-300">
                      <span className="text-green-800 select-none"># </span>{children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="mt-4 mb-2 text-sm font-semibold text-green-300">
                      <span className="text-green-800 select-none">## </span>{children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="mt-3 mb-1 text-sm font-semibold text-green-400">
                      <span className="text-green-800 select-none">### </span>{children}
                    </h3>
                  ),
                  p: ({ children }) => <p className="my-3 text-green-600">{children}</p>,
                  ul: ({ children }) => <ul className="my-3 space-y-1 pl-4">{children}</ul>,
                  ol: ({ children }) => <ol className="my-3 space-y-1 pl-4">{children}</ol>,
                  li: ({ children }) => (
                    <li className="text-green-600">
                      <span className="select-none text-green-800">→ </span>{children}
                    </li>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-green-300 underline underline-offset-2 hover:text-white"
                    >
                      {children}
                    </a>
                  ),
                  code: ({ children }) => (
                    <code className="rounded-none border border-green-900/60 bg-[#030d03] px-1.5 py-0.5 text-xs text-green-400">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="my-4 overflow-x-auto border border-green-900/60 bg-[#030d03] p-4 text-xs text-green-400">
                      {children}
                    </pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="my-3 border-l-2 border-green-800 pl-3 text-green-700 italic">
                      {children}
                    </blockquote>
                  ),
                  strong: ({ children }) => <strong className="font-bold text-green-300">{children}</strong>,
                }}
              >
                {blog.content || ''}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
