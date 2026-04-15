import { useParams, Link } from 'react-router-dom'
import { useSiteData } from '../../hooks/useSiteData'
import { getDOMFromJSON } from 'luxe-edit'
import ReactMarkdown from 'react-markdown'

export default function MinecraftBlogPage() {
  const { id } = useParams<{ id: string }>()
  const { blogs, loading, error } = useSiteData()
  const blog = id ? blogs.find((b) => b.id === id) : null

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] px-6 py-12">
        <p className="text-xs text-[#5c7a29] animate-pulse">Loading world...</p>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] px-6 py-12">
        <p className="text-xs text-[#FF5555]">{error || 'Scroll not found'}</p>
        <Link to="/blogs" className="mt-3 inline-block text-xs text-[#5c7a29] hover:text-[#8acd32]">
          ← Back to scrolls
        </Link>
      </div>
    )
  }

  const date = blog.createdAt?.slice(0, 10) ?? ''

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link to="/blogs" className="text-xs text-[#5c7a29] transition hover:text-[#8acd32]">
          ← Back to scrolls
        </Link>

        {/* Title panel */}
        <div className="mt-6 relative border-2 border-[#3b3b3b] bg-[#8b8b8b] p-4">
          <div className="pointer-events-none absolute inset-0 border-t-2 border-l-2 border-[#c6c6c6]" />
          <div className="pointer-events-none absolute inset-0 border-b-2 border-r-2 border-[#555555]" />
          <div className="relative">
            <p className="text-xs text-[#555555] uppercase tracking-wider">📜 Scroll</p>
            <h1 className="mt-1 text-xl font-bold text-white drop-shadow-[2px_2px_0_#3f3f00]">
              {blog.title || 'Untitled'}
            </h1>
            {date && <p className="mt-1 text-xs text-[#a0a0a0]">{date}</p>}
          </div>
        </div>

        {/* Content panel */}
        <div className="mt-4 relative border-2 border-[#3b3b3b] bg-[#c6c6c6] p-6">
          <div className="pointer-events-none absolute inset-0 border-t-2 border-l-2 border-[#e6e6e6]" />
          <div className="pointer-events-none absolute inset-0 border-b-2 border-r-2 border-[#8b8b8b]" />
          <div className="relative">
            {blog.contentJSON ? (
              <div
                className="minecraft-prose text-sm text-[#3b3b3b] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: getDOMFromJSON(blog.contentJSON) }}
              />
            ) : (
              <div className="text-sm text-[#3b3b3b] leading-relaxed">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="mt-6 mb-2 text-lg font-bold text-[#1a1a2e] drop-shadow-[1px_1px_0_#c6c6c6]">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="mt-4 mb-2 text-base font-bold text-[#1a1a2e]">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="mt-3 mb-1 text-sm font-bold text-[#3b3b3b]">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => <p className="my-3 text-[#555555]">{children}</p>,
                    ul: ({ children }) => <ul className="my-3 space-y-1 pl-4">{children}</ul>,
                    ol: ({ children }) => <ol className="my-3 space-y-1 pl-4">{children}</ol>,
                    li: ({ children }) => (
                      <li className="text-[#555555]">
                        <span className="select-none text-[#5c7a29]">◆ </span>{children}
                      </li>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#5c7a29] underline underline-offset-2 hover:text-[#3a5a19]"
                      >
                        {children}
                      </a>
                    ),
                    code: ({ children }) => (
                      <code className="border border-[#8b8b8b] bg-[#e6e6e6] px-1.5 py-0.5 text-xs text-[#3b3b3b]">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="my-4 overflow-x-auto border-2 border-[#3b3b3b] bg-[#1a1a2e] p-4 text-xs text-[#5c7a29]">
                        {children}
                      </pre>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="my-3 border-l-4 border-[#5c7a29] bg-[#e6e6e6] pl-3 py-1 text-[#555555] italic">
                        {children}
                      </blockquote>
                    ),
                    strong: ({ children }) => <strong className="font-bold text-[#1a1a2e]">{children}</strong>,
                  }}
                >
                  {blog.content || ''}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
