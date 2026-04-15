import type { Project } from '../../types/contentTypes'

export default function ProjectCard({ project }: { project: Project }) {
  const date = project.createdAt?.slice(0, 10) ?? ''

  return (
    <div className="group relative border-2 border-[#3b3b3b] bg-[#8b8b8b] p-3 transition-all hover:border-[#ffffff80] hover:-translate-y-0.5 active:translate-y-0">
      {/* MC-style bevel edges */}
      <div className="pointer-events-none absolute inset-0 border-t-2 border-l-2 border-[#c6c6c6]" />
      <div className="pointer-events-none absolute inset-0 border-b-2 border-r-2 border-[#555555]" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <p className="font-bold text-white drop-shadow-[2px_2px_0_#3f3f00]">{project.title}</p>
          {date && <span className="shrink-0 text-[11px] text-[#a0a0a0]">{date}</span>}
        </div>
        {project.description && (
          <p className="mt-1 text-xs text-[#d4d4d4] line-clamp-2">{project.description}</p>
        )}
        {project.links?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {project.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="inline-block border-2 border-[#3b3b3b] bg-[#6b6b6b] px-2 py-0.5 text-[11px] text-[#5c7a29] font-bold transition-colors hover:bg-[#555555] hover:text-[#8acd32]"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
