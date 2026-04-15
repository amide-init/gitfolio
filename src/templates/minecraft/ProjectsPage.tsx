import { useSiteData } from '../../hooks/useSiteData'
import ProjectCard from './ProjectCard'

export default function MinecraftProjectsPage() {
  const { projects, loading, error } = useSiteData()

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-[#5c7a29] mb-1">🔨 Crafting Table</p>
          <h1 className="text-2xl font-bold text-white drop-shadow-[2px_2px_0_#3f3f00]">All Projects</h1>
          <p className="mt-1 text-xs text-[#777]">
            {loading ? 'Loading...' : `${projects.length} items crafted`}
          </p>
        </div>
        {error && <p className="text-xs text-[#FF5555]">{error}</p>}
        {loading && <p className="text-xs text-[#5c7a29] animate-pulse">Loading world...</p>}
        {!loading && projects.length === 0 && (
          <p className="text-xs text-[#777]">No projects crafted yet.</p>
        )}
        <div className="grid gap-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  )
}
