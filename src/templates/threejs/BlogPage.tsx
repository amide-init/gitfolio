import { lazy, Suspense } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSiteData } from '../../hooks/useSiteData'
import { getDOMFromJSON } from 'luxe-edit'
import ReactMarkdown from 'react-markdown'

const ParticleField = lazy(() => import('./ParticleField'))

function readingTime(text: string): string {
  const words = text.trim().split(/\s+/).length
  const mins = Math.max(1, Math.round(words / 200))
  return `${mins} min read`
}

export default function ThreejsBlogPage() {
  const { id } = useParams<{ id: string }>()
  const { blogs, loading, error } = useSiteData()
  const blog = id ? blogs.find((b) => b.id === id) : null

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#050509] px-6 py-16">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-blue-900/20" />
          <div className="h-8 w-2/3 animate-pulse rounded bg-blue-900/20" />
          <div className="mt-8 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-3 animate-pulse rounded bg-blue-900/10" style={{ width: `${75 + Math.random() * 25}%` }} />
            ))}
          </div>
        </div>
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

  const rt = readingTime(blog.content)

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050509]">
      <Suspense fallback={null}>
        <ParticleField count={40} color={0x8b5cf6} opacity={0.15} />
      </Suspense>

      <article className="relative z-10 mx-auto max-w-3xl px-6 py-16">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-purple-400 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/blogs" className="hover:text-purple-400 transition-colors">Blogs</Link>
          <span>/</span>
          <span className="truncate max-w-[160px] text-purple-400">{blog.title || 'Article'}</span>
        </div>

        {/* Decorative top line */}
        <div className="mb-6 h-px w-12 bg-gradient-to-r from-purple-500 to-pink-400" />

        <header className="mb-10">
          <h1 className="text-2xl font-bold leading-tight text-slate-100">{blog.title || 'Untitled'}</h1>
          <div className="mt-4 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-900/40 bg-purple-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-purple-300">
              <span className="h-1 w-1 rounded-full bg-purple-400" />
              {rt}
            </span>
          </div>
        </header>

        {/* Horizontal rule with gradient */}
        <div className="mb-8 h-px bg-gradient-to-r from-purple-900/60 via-blue-900/40 to-transparent" />

        {blog.contentJSON ? (
          <div
            className="prose prose-invert max-w-none text-sm text-slate-300 prose-headings:text-slate-100 prose-a:text-blue-400 prose-code:text-blue-300 prose-pre:border prose-pre:border-blue-900/40 prose-pre:bg-[#0d1220]"
            dangerouslySetInnerHTML={{ __html: getDOMFromJSON(blog.contentJSON) }}
          />
        ) : (
          <div className="prose prose-invert max-w-none text-sm text-slate-300">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="mb-2 mt-8 text-lg font-bold text-slate-100 border-b border-blue-900/30 pb-2">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="mb-2 mt-6 text-base font-semibold text-slate-100">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mb-1.5 mt-4 text-sm font-semibold text-slate-200">{children}</h3>
                ),
                p: ({ children }) => <p className="my-3 leading-relaxed text-slate-300">{children}</p>,
                ul: ({ children }) => <ul className="my-3 list-disc pl-6 text-slate-300">{children}</ul>,
                ol: ({ children }) => <ol className="my-3 list-decimal pl-6 text-slate-300">{children}</ol>,
                li: ({ children }) => <li className="my-0.5">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="my-4 border-l-2 border-purple-500/60 pl-4 italic text-slate-400">{children}</blockquote>
                ),
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noreferrer" className="font-medium text-blue-400 hover:text-blue-300 hover:underline">
                    {children}
                  </a>
                ),
                code: ({ children }) => (
                  <code className="rounded border border-blue-900/40 bg-[#0d1220] px-1.5 py-0.5 text-xs text-blue-300 font-mono">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="my-4 overflow-x-auto rounded-xl border border-blue-900/40 bg-[#0d1220] p-4 text-xs font-mono shadow-[inset_0_1px_0_rgba(59,130,246,0.1)]">
                    {children}
                  </pre>
                ),
                hr: () => (
                  <div className="my-6 h-px bg-gradient-to-r from-blue-900/60 via-purple-900/40 to-transparent" />
                ),
              }}
            >
              {blog.content || ''}
            </ReactMarkdown>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 border-t border-blue-900/30 pt-8">
          <Link
            to="/blogs"
            className="group inline-flex items-center gap-2 rounded-lg border border-blue-900/40 bg-gradient-to-b from-[#0d1220]/80 to-[#080c18]/80 px-4 py-2.5 text-xs font-medium text-slate-300 transition hover:border-blue-500/40 hover:text-blue-300"
          >
            <svg className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to all blogs
          </Link>
        </div>
      </article>
    </div>
  )
}
