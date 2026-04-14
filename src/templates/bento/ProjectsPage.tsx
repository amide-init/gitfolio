import { useSiteData } from '../../hooks/useSiteData'
import ProjectCard from './ProjectCard'

export default function BentoProjectsPage() {
  const { projects, loading, error } = useSiteData()

  return (
    <div className="min-h-screen bg-[#0a0a14]">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="mt-1 text-sm text-slate-400">Selected work and side projects.</p>
        </header>
        {error && <p className="text-sm text-rose-400">{error}</p>}
        {loading && <p className="text-sm text-slate-500">Loading…</p>}
        {!loading && !error && projects.length === 0 && (
          <p className="text-sm text-slate-500">No projects yet.</p>
        )}
        {!loading && projects.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} featured={i === 0 && projects.length > 2} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
