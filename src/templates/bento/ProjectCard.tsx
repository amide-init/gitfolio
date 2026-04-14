import type { Project } from '../../types/contentTypes'

type ProjectCardProps = {
  project: Project
  featured?: boolean
}

export default function ProjectCard({ project, featured = false }: ProjectCardProps) {
  return (
    <article
      className={`flex flex-col rounded-3xl border border-white/8 bg-[#111122] p-6 transition hover:border-indigo-500/40 hover:bg-[#13132a] dark:border-white/8 dark:bg-[#111122] ${
        featured ? 'md:col-span-2' : ''
      }`}
    >
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15">
        <svg className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h10" />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-white">
        {project.title || 'Untitled'}
      </h3>
      {project.description && (
        <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-slate-400">
          {project.description}
        </p>
      )}
      {project.links && project.links.length > 0 && (
        <div className="mt-auto pt-4 flex flex-wrap gap-2">
          {project.links.map((link, i) =>
            link.url ? (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300 ring-1 ring-indigo-500/20 transition hover:bg-indigo-500/20"
              >
                {link.label || link.url}
                <span aria-hidden>↗</span>
              </a>
            ) : null,
          )}
        </div>
      )}
    </article>
  )
}
