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
      className="group relative block border-2 border-[#3b3b3b] bg-[#8b8b8b] p-3 transition-all hover:border-[#ffffff80] hover:-translate-y-0.5 active:translate-y-0"
    >
      {/* MC-style bevel edges */}
      <div className="pointer-events-none absolute inset-0 border-t-2 border-l-2 border-[#c6c6c6]" />
      <div className="pointer-events-none absolute inset-0 border-b-2 border-r-2 border-[#555555]" />

      <div className="relative flex items-start gap-3">
        {/* Thumbnail */}
        <div className="shrink-0 w-28 aspect-video overflow-hidden border-2 border-[#3b3b3b] bg-[#555555]">
          {(video.thumbnail || id) ? (
            <img
              src={video.thumbnail || `https://img.youtube.com/vi/${id}/mqdefault.jpg`}
              alt=""
              className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#c6c6c6] text-xs">
              ▶ Play
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-white drop-shadow-[2px_2px_0_#3f3f00] line-clamp-2">
            {video.title || 'Untitled'}
          </p>
          <p className="mt-1 text-[11px] text-[#a0a0a0]">{date}</p>
        </div>
      </div>
    </a>
  )
}
