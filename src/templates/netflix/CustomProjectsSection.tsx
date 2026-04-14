import { Link } from 'react-router-dom'
import { useSiteData } from '../../hooks/useSiteData'
import ProjectCard from './ProjectCard'

const PREVIEW_COUNT = 6

export default function CustomProjectsSection() {
  const { projects, loading } = useSiteData()
  const preview = projects.slice(0, PREVIEW_COUNT)

  if (loading && preview.length === 0) return null
  if (!loading && projects.length === 0) return null

  return (
    <section id="projects" className="bg-[#141414] py-8" aria-labelledby="projects-title">
      <div className="mx-auto max-w-6xl px-6">
        {/* Row header */}
        <div className="mb-4 flex items-baseline gap-4">
          <h2 id="projects-title" className="text-xl font-bold text-white">Projects</h2>
          {projects.length > PREVIEW_COUNT && (
            <Link to="/projects" className="text-xs font-semibold text-[#54b3d6] hover:text-white transition">
              Explore All &rsaquo;
            </Link>
          )}
        </div>

        {/* Horizontal scroll row */}
        <div
          className="flex gap-3 overflow-x-auto pb-4"
          style={{ scrollbarWidth: 'thin' }}
        >
          {(loading ? [] : preview).map((project, i) => (
            <ProjectCard key={project.id} project={project} featured={i === 0 && preview.length >= 3} />
          ))}
        </div>
      </div>
    </section>
  )
}
