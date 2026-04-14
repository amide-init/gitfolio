import { useSiteData } from '../../hooks/useSiteData'
import ProjectCard from './ProjectCard'

export default function ClassicProjectsPage() {
  const { projects, loading, error } = useSiteData()

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <header className="mb-10 border-b border-slate-200 pb-8 dark:border-slate-700">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Projects</h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
            Selected work and side projects.
          </p>
        </header>
        {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}
        {loading && <p className="text-base text-slate-500 dark:text-slate-400">Loading…</p>}
        {!loading && !error && projects.length === 0 && (
          <p className="text-base text-slate-500 dark:text-slate-400">No projects yet.</p>
        )}
        {!loading && projects.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
