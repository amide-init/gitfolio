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

type VideoCardProps = {
  video: Video
}

export default function VideoCard({ video }: VideoCardProps) {
  const id = parseYouTubeId(video.videoUrl)
  const thumbnail =
    video.thumbnail ||
    (id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null)

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-800/60">
      {thumbnail && (
        <a
          href={video.videoUrl}
          target="_blank"
          rel="noreferrer"
          className="block aspect-video w-full shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-900"
        >
          <img
            src={thumbnail}
            alt=""
            className="h-full w-full object-cover transition hover:opacity-90"
          />
        </a>
      )}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          <a
            href={video.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            {video.title || 'Video'}
          </a>
        </h3>
        <a
          href={video.videoUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
        >
          Watch on YouTube
          <span aria-hidden>↗</span>
        </a>
      </div>
    </article>
  )
}
