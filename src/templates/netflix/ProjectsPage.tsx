import { useSiteData } from '../../hooks/useSiteData'
import ProjectCard from './ProjectCard'

export default function NetflixProjectsPage() {
  const { projects, loading, error } = useSiteData()

  return (
    <div className="min-h-screen bg-[#141414]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#e50914]">Collection</p>
          <h1 className="text-4xl font-black text-white">Projects</h1>
          <p className="mt-2 text-sm text-[#999]">Selected work and side projects.</p>
        </header>
        {error && <p className="text-sm text-rose-400">{error}</p>}
        {loading && <p className="text-sm text-[#999]">Loading…</p>}
        {!loading && !error && projects.length === 0 && (
          <p className="text-sm text-[#999]">No projects yet.</p>
        )}
        {!loading && projects.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} featured={i === 0 && projects.length > 2} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
