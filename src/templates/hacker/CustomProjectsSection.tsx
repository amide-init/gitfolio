import { Link } from 'react-router-dom'
import { useSiteData } from '../../hooks/useSiteData'
import ProjectCard from './ProjectCard'

const PREVIEW_COUNT = 4

export default function CustomProjectsSection() {
  const { projects, loading } = useSiteData()
  const preview = projects.slice(0, PREVIEW_COUNT)

  if (loading && preview.length === 0) return null
  if (!loading && projects.length === 0) return null

  return (
    <section id="projects" className="bg-black py-10 font-mono" aria-labelledby="projects-title">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-green-700 select-none">~/profile ❯ ls projects/</p>
            <p id="projects-title" className="mt-1 text-sm text-green-500">
              <span className="text-green-800">total </span>{projects.length}
            </p>
          </div>
          {projects.length > PREVIEW_COUNT && (
            <Link to="/projects" className="text-xs text-green-700 transition hover:text-green-400">
              view all →
            </Link>
          )}
        </div>
        <div className="space-y-px">
          {(loading ? [] : preview).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
