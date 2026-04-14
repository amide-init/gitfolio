import { githubConfig } from '../generated/githubData'
import MinimalProjectsPage from '../templates/minimal/ProjectsPage'
import ClassicProjectsPage from '../templates/classic/ProjectsPage'
import BentoProjectsPage from '../templates/bento/ProjectsPage'

export default function ProjectsPage() {
  const template = (githubConfig as { template?: string }).template ?? 'minimal'
  if (template === 'classic') return <ClassicProjectsPage />
  if (template === 'bento') return <BentoProjectsPage />
  return <MinimalProjectsPage />
}
