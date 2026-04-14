import type { Video } from '../../types/contentTypes'

function parseYouTubeId(url: string): string | null {
  if (!url?.trim()) return null
  try {
    const u = new URL(url.trim())
    if (u.hostname === 'www.youtube.com' || u.hostname === 'youtube.com')
      return u.searchParams.get('v')
    if (u.hostname === 'youtu.be')
      return u.pathname.slice(1).split('/')[0] || null
  } catch { /* ignore */ }
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
    <article className={`flex flex-col overflow-hidden rounded-3xl border border-white/8 bg-[#111122] transition hover:border-indigo-500/40 ${large ? 'md:col-span-2' : ''}`}>
      {thumbnail && (
        <a href={video.videoUrl} target="_blank" rel="noreferrer" className="block aspect-video w-full shrink-0 overflow-hidden">
          <img src={thumbnail} alt="" className="h-full w-full object-cover transition hover:opacity-90" />
        </a>
      )}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-sm font-semibold text-white">
          <a href={video.videoUrl} target="_blank" rel="noreferrer" className="hover:text-indigo-300 transition">
            {video.title || 'Video'}
          </a>
        </h3>
        <a
          href={video.videoUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-indigo-400 transition"
        >
          Watch on YouTube ↗
        </a>
      </div>
    </article>
  )
}
