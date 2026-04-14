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
      className="border-b border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900"
      aria-labelledby="projects-title"
    >
      <div className="mx-auto max-w-5xl px-6">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2
              id="projects-title"
              className="text-2xl font-bold text-slate-900 dark:text-slate-50"
            >
              Projects
            </h2>
            <p className="mt-1 text-base text-slate-600 dark:text-slate-300">
              Selected work and side projects.
            </p>
          </div>
          {projects.length > PREVIEW_COUNT && (
            <Link
              to="/projects"
              className="text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              View all {projects.length} →
            </Link>
          )}
        </header>
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {(loading ? [] : preview).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
