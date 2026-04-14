import type { Video } from '../../types/contentTypes'

function parseYouTubeId(url: string): string | null {
  if (!url?.trim()) return null
  try {
    const u = new URL(url.trim())
    if (u.hostname === 'www.youtube.com' || u.hostname === 'youtube.com')
      return u.searchParams.get('v')
    if (u.hostname === 'youtu.be')
      return u.pathname.slice(1).split('/')[0] || null
  } catch {
    // ignore
  }
  return null
}

export default function VideoCard({ video }: { video: Video }) {
  const id = parseYouTubeId(video.videoUrl)
  const date = video.createdAt?.slice(0, 10) ?? ''

  return (
    <a
      href={video.videoUrl}
      target="_blank"
      rel="noreferrer"
      className="group flex items-start gap-3 border-l-2 border-green-900 py-2 pl-4 font-mono text-sm transition hover:border-green-500 hover:bg-[#030d03]"
    >
      {/* Thumbnail or placeholder */}
      <div className="shrink-0 w-24 aspect-video overflow-hidden border border-green-900/40 bg-[#030d03]">
        {(video.thumbnail || id) ? (
          <img
            src={video.thumbnail || `https://img.youtube.com/vi/${id}/mqdefault.jpg`}
            alt=""
            className="h-full w-full object-cover opacity-60 group-hover:opacity-90 transition-opacity"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-green-900 text-xs">
            [video]
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-green-300 leading-snug group-hover:text-green-100 transition-colors line-clamp-2">
          {video.title || 'Untitled'}
        </p>
        <p className="mt-1 text-[11px] text-green-900">{date}</p>
      </div>
    </a>
  )
}
