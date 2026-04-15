import { Link } from 'react-router-dom'
import { useSiteData } from '../../hooks/useSiteData'
import ProjectCard from './ProjectCard'
import { useInView } from './useInView'

const PREVIEW_COUNT = 4

export default function CustomProjectsSection() {
  const { projects, loading } = useSiteData()
  const { ref, visible } = useInView()
  const preview = projects.slice(0, PREVIEW_COUNT)

  if (loading && preview.length === 0) return null
  if (!loading && projects.length === 0) return null

  return (
    <section id="projects" className="bg-[#1a1a2e] py-12" aria-labelledby="projects-title">
      <div ref={ref} className="mx-auto max-w-4xl px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#5c7a29] mb-1">🔨 Crafting Table</p>
            <h2 id="projects-title" className="text-xl font-bold text-white drop-shadow-[2px_2px_0_#3f3f00]">
              Projects
            </h2>
            <p className="mt-1 text-xs text-[#777]">{projects.length} items crafted</p>
          </div>
          {projects.length > PREVIEW_COUNT && (
            <Link
              to="/projects"
              className="relative inline-block border-2 border-[#3b3b3b] bg-[#6b6b6b] px-3 py-1 text-xs font-bold text-[#5c7a29] transition-all hover:bg-[#555555] hover:text-[#8acd32]"
            >
              View All →
            </Link>
          )}
        </div>
        <div className="grid gap-2">
          {(loading ? [] : preview).map((project, i) => (
            <div
              key={project.id}
              className={visible ? 'animate-mc-fade-up' : 'opacity-0'}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
