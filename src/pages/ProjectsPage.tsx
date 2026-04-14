import { activeTemplate } from '../lib/activeTemplate'
import MinimalProjectsPage from '../templates/minimal/ProjectsPage'
import ClassicProjectsPage from '../templates/classic/ProjectsPage'
import BentoProjectsPage from '../templates/bento/ProjectsPage'
import HackerProjectsPage from '../templates/hacker/ProjectsPage'
import NetflixProjectsPage from '../templates/netflix/ProjectsPage'
import ThreejsProjectsPage from '../templates/threejs/ProjectsPage'

export default function ProjectsPage() {
  if (activeTemplate === 'classic') return <ClassicProjectsPage />
  if (activeTemplate === 'bento') return <BentoProjectsPage />
  if (activeTemplate === 'hacker') return <HackerProjectsPage />
  if (activeTemplate === 'netflix') return <NetflixProjectsPage />
  if (activeTemplate === 'threejs') return <ThreejsProjectsPage />
  return <MinimalProjectsPage />
}
