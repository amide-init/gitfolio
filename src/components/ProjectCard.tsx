import type { Project } from '../types/contentTypes'

type ProjectCardProps = {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition dark:border-white/10 dark:bg-gradient-to-b dark:from-[#181829] dark:to-[#0a0a13] dark:shadow-[0_18px_45px_rgba(0,0,0,0.8)]">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
        {project.title || 'Untitled'}
      </h3>
      {project.description && (
        <p className="mt-2 line-clamp-3 text-[13px] text-slate-700 dark:text-slate-300">
          {project.description}
        </p>
      )}
      {project.links && project.links.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3 text-[13px]">
          {project.links.map((link, i) =>
            link.url ? (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              >
                <span>{link.label || link.url}</span>
                <span aria-hidden>↗</span>
              </a>
            ) : null,
          )}
        </div>
      )}
    </article>
  )
}
