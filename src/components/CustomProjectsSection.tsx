import { Link } from 'react-router-dom'
import { useSiteData } from '../hooks/useSiteData'
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
      className="border-t border-slate-200 bg-slate-50 py-12 dark:border-slate-800 dark:bg-[#050509]"
      aria-labelledby="projects-title"
    >
      <div className="mx-auto max-w-5xl px-6">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2
              id="projects-title"
              className="mb-2 text-xs font-semibold uppercase tracking-[0.26em] text-slate-600 dark:text-slate-300"
            >
              Projects
            </h2>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              Selected work and side projects.
            </p>
          </div>
          {projects.length > PREVIEW_COUNT && (
            <Link
              to="/projects"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 hover:underline"
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
