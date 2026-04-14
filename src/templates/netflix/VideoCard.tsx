import type { Video } from '../../types/contentTypes'

function parseYouTubeId(url: string): string | null {
  if (!url?.trim()) return null
  try {
    const u = new URL(url.trim())
    if (u.hostname === 'www.youtube.com' || u.hostname === 'youtube.com')
      return u.searchParams.get('v')
    if (u.hostname === 'youtu.be')
      return u.pathname.slice(1).split('/')[0] || null
  } catch { /* ignore — invalid or unsupported URLs are expected; fallback to null */ }
  return null
}

type VideoCardProps = {
  video: Video
  large?: boolean
}

export default function VideoCard({ video, large = false }: VideoCardProps) {
  const id = parseYouTubeId(video.videoUrl)
  const thumbnail = video.thumbnail || (id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null)

  return (
    <article
      className={`group relative flex-shrink-0 overflow-hidden rounded-sm bg-[#1f1f1f] transition-transform duration-200 hover:scale-105 hover:z-10 ${
        large ? 'w-72 sm:w-80' : 'w-48 sm:w-56'
      }`}
    >
      <a href={video.videoUrl} target="_blank" rel="noreferrer" className="block">
        {/* Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden bg-[#2a2a2a]">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={video.title || 'Video thumbnail'}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <svg className="h-10 w-10 text-[#e50914]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
            </div>
          )}
          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90">
              <svg className="h-5 w-5 translate-x-0.5 text-black" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="line-clamp-2 text-xs font-semibold text-white">
            {video.title || 'Video'}
          </h3>
          <p className="mt-1 text-[11px] text-[#e50914] font-medium">YouTube</p>
        </div>
      </a>
    </article>
  )
}
