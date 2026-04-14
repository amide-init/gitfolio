import { useSiteData } from '../../hooks/useSiteData'
import ProjectCard from './ProjectCard'

export default function HackerProjectsPage() {
  const { projects, loading, error } = useSiteData()

  return (
    <div className="min-h-screen bg-black font-mono">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-6">
          <p className="text-xs text-green-700 select-none">~/profile ❯ ls -la projects/</p>
          <p className="mt-1 text-sm text-green-500">
            <span className="text-green-800">total </span>
            {loading ? '…' : projects.length}
          </p>
        </div>
        {error && <p className="text-xs text-red-700">{error}</p>}
        {loading && <p className="text-xs text-green-800 animate-pulse">loading…</p>}
        {!loading && projects.length === 0 && (
          <p className="text-xs text-green-800">no projects found.</p>
        )}
        <div className="space-y-px">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  )
}
