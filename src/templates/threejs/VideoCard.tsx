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
  const thumbnail = video.thumbnail || (id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null)

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-blue-900/40 bg-gradient-to-b from-[#0d1220] to-[#080c18] transition hover:-translate-y-0.5 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]">
      {thumbnail && (
        <a
          href={video.videoUrl}
          target="_blank"
          rel="noreferrer"
          className="block aspect-video w-full shrink-0 overflow-hidden bg-[#050509]"
        >
          <img src={thumbnail} alt="" className="h-full w-full object-cover transition hover:opacity-80" />
        </a>
      )}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-semibold text-slate-100">
          <a href={video.videoUrl} target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">
            {video.title || 'Video'}
          </a>
        </h3>
        <a
          href={video.videoUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300"
        >
          Watch on YouTube
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  )
}
