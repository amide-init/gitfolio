import { githubConfig } from '../generated/githubData'
import MinimalHomePage from '../templates/minimal/HomePage'

export default function HomePage() {
  const template = (githubConfig as { template?: string }).template ?? 'minimal'
  // 'classic' and 'bento' templates will be added in future issues
  if (template === 'classic') return <MinimalHomePage />
  if (template === 'bento') return <MinimalHomePage />
  return <MinimalHomePage />
}
