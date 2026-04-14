import type { Project } from '../../types/contentTypes'

export default function ProjectCard({ project }: { project: Project }) {
  const date = project.createdAt?.slice(0, 10) ?? ''

  return (
    <div className="border-l-2 border-green-900 py-2 pl-4 font-mono text-sm transition hover:border-green-600 hover:bg-[#030d03]">
      <div className="flex items-start justify-between gap-4">
        <p className="font-semibold text-green-300">{project.title}</p>
        {date && <span className="shrink-0 text-[11px] text-green-900">{date}</span>}
      </div>
      {project.description && (
        <p className="mt-0.5 text-xs text-green-700 line-clamp-2">
          <span className="select-none text-green-900"># </span>{project.description}
        </p>
      )}
      {project.links?.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-3">
          {project.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-green-700 transition hover:text-green-400"
            >
              [{link.label} ↗]
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
