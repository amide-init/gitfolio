import type { Project } from '../../types/contentTypes'

type ProjectCardProps = {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-800/60">
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
        {project.title || 'Untitled'}
      </h3>
      {project.description && (
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {project.description}
        </p>
      )}
      {project.links && project.links.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {project.links.map((link, i) =>
            link.url ? (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20"
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
