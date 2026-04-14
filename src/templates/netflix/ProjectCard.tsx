import type { Project } from '../../types/contentTypes'

type ProjectCardProps = {
  project: Project
  featured?: boolean
}

export default function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const firstLink = project.links?.find((l) => l.url)

  return (
    <article
      className={`group relative flex-shrink-0 overflow-hidden rounded-sm bg-[#1f1f1f] transition-transform duration-200 hover:scale-105 hover:z-10 ${
        featured ? 'w-80 sm:w-96' : 'w-56 sm:w-64'
      }`}
    >
      {/* Banner with project name */}
      <div className="relative flex aspect-video w-full items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e50914]/20">
          <svg className="h-7 w-7 text-[#e50914]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        {featured && (
          <span className="absolute left-3 top-3 rounded-sm bg-[#e50914] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            Featured
          </span>
        )}
        {firstLink && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100">
            <a
              href={firstLink.url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="rounded-sm bg-white/90 px-3 py-1 text-xs font-bold text-black"
            >
              View ↗
            </a>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#e50914] mb-1">Project</p>
        <h3 className="line-clamp-1 text-xs font-semibold text-white">
          {project.title || 'Untitled'}
        </h3>
        {project.description && (
          <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[#999]">
            {project.description}
          </p>
        )}
        {project.links && project.links.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {project.links.slice(0, 2).map((link, i) =>
              link.url ? (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-0.5 text-[10px] font-medium text-[#e50914] hover:text-[#f40612] transition"
                >
                  {link.label || 'Link'} ↗
                </a>
              ) : null,
            )}
          </div>
        )}
      </div>
    </article>
  )
}
