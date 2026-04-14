import { Link } from 'react-router-dom'
import { useSiteData } from '../../hooks/useSiteData'
import ProjectCard from './ProjectCard'

const PREVIEW_COUNT = 3

export default function CustomProjectsSection() {
  const { projects, loading } = useSiteData()
  const preview = projects.slice(0, PREVIEW_COUNT)

  if (loading && preview.length === 0) return null
  if (!loading && projects.length === 0) return null

  return (
    <section
      id="projects"
      className="border-t border-blue-900/30 bg-[#050509] py-16"
      aria-labelledby="projects-title"
    >
      <div className="mx-auto max-w-5xl px-6">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-blue-400">
              Projects
            </p>
            <p className="text-sm leading-relaxed text-slate-400">Selected work and side projects.</p>
          </div>
          {projects.length > PREVIEW_COUNT && (
            <Link
              to="/projects"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400 hover:text-blue-300 hover:underline"
            >
              See all ({projects.length})
            </Link>
          )}
        </header>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {(loading ? [] : preview).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
