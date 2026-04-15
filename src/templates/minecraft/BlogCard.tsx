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
  return plain.length <= maxLen ? plain : plain.slice(0, maxLen).trim() + '…'
}

export default function BlogCard({ blog, featured }: { blog: Blog; featured?: boolean }) {
  const date = blog.createdAt?.slice(0, 10) ?? '????-??-??'
  const excerpt = stripMarkdown(blog.content, 100)

  return (
    <Link
      to={`/blog/${blog.id}`}
      className="group relative block border-2 border-[#3b3b3b] bg-[#8b8b8b] p-3 transition-all hover:border-[#ffffff80] hover:-translate-y-0.5 active:translate-y-0"
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Highlight edge (top & left) */}
      <div className="pointer-events-none absolute inset-0 border-t-2 border-l-2 border-[#c6c6c6]" />
      {/* Shadow edge (bottom & right) */}
      <div className="pointer-events-none absolute inset-0 border-b-2 border-r-2 border-[#555555]" />
      {/* Enchantment glint on featured posts */}
      {featured && (
        <div
          className="pointer-events-none absolute inset-0 animate-mc-enchant opacity-30"
          style={{
            backgroundImage: 'linear-gradient(120deg, transparent 30%, rgba(138,205,50,0.35) 50%, transparent 70%)',
            backgroundSize: '200% 100%',
          }}
        />
      )}

      <div className="relative flex items-start gap-2">
        <span className="mt-0.5 shrink-0 text-[#5c7a29] text-lg leading-none">⬛</span>
        <div className="min-w-0">
          <p className="font-bold text-white drop-shadow-[2px_2px_0_#3f3f00]">
            {featured && (
              <span className="mr-1.5 bg-[#5c7a29] px-1 py-0.5 text-[10px] text-white uppercase tracking-wider">★ Featured</span>
            )}
            {blog.title || 'Untitled'}
          </p>
          {excerpt && (
            <p className="mt-1 text-xs text-[#d4d4d4] line-clamp-2">{excerpt}</p>
          )}
          <p className="mt-1 text-[11px] text-[#a0a0a0]">{date}</p>
        </div>
      </div>
    </Link>
  )
}
