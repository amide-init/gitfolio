import type { Project } from '../../types/contentTypes'

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="flex flex-col rounded-xl border border-blue-900/40 bg-gradient-to-b from-[#0d1220] to-[#080c18] p-5 transition hover:-translate-y-0.5 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]">
      <h3 className="text-sm font-semibold text-slate-100">{project.title || 'Untitled'}</h3>
      {project.description && (
        <p className="mt-2 line-clamp-3 text-[13px] text-slate-400">{project.description}</p>
      )}
      {project.links && project.links.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {project.links.map((link, i) =>
            link.url ? (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300 hover:underline"
              >
                {link.label || link.url}
                <span aria-hidden="true">↗</span>
              </a>
            ) : null,
          )}
        </div>
      )}
    </article>
  )
}
