import { githubConfig } from '../generated/githubData'
import MinimalProjectsPage from '../templates/minimal/ProjectsPage'

export default function ProjectsPage() {
  const template = (githubConfig as { template?: string }).template ?? 'minimal'
  // 'classic' and 'bento' templates will be added in future issues
  if (template === 'classic') return <MinimalProjectsPage />
  if (template === 'bento') return <MinimalProjectsPage />
  return <MinimalProjectsPage />
}
