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
    <section id="projects" className="bg-[#0a0a14] py-8" aria-labelledby="projects-title">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="projects-title" className="text-lg font-bold text-white">Projects</h2>
          {projects.length > PREVIEW_COUNT && (
            <Link to="/projects" className="text-xs font-semibold text-indigo-400 hover:underline">
              View all {projects.length} →
            </Link>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {(loading ? [] : preview).map((project, i) => (
            <ProjectCard key={project.id} project={project} featured={i === 0 && preview.length >= 3} />
          ))}
        </div>
      </div>
    </section>
  )
}
