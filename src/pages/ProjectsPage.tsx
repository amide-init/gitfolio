import { githubConfig } from '../generated/githubData'
import MinimalProjectsPage from '../templates/minimal/ProjectsPage'
import ClassicProjectsPage from '../templates/classic/ProjectsPage'
import BentoProjectsPage from '../templates/bento/ProjectsPage'
import HackerProjectsPage from '../templates/hacker/ProjectsPage'
import NetflixProjectsPage from '../templates/netflix/ProjectsPage'
import ThreejsProjectsPage from '../templates/threejs/ProjectsPage'

export default function ProjectsPage() {
  const template = (githubConfig as { template?: string }).template ?? 'hacker'
  if (template === 'classic') return <ClassicProjectsPage />
  if (template === 'bento') return <BentoProjectsPage />
  if (template === 'hacker') return <HackerProjectsPage />
  if (template === 'netflix') return <NetflixProjectsPage />
  if (template === 'threejs') return <ThreejsProjectsPage />
  return <MinimalProjectsPage />
}
