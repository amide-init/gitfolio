import { githubConfig } from '../generated/githubData'
import MinimalVideosPage from '../templates/minimal/VideosPage'

export default function VideosPage() {
  const template = (githubConfig as { template?: string }).template ?? 'minimal'
  // 'classic' and 'bento' templates will be added in future issues
  if (template === 'classic') return <MinimalVideosPage />
  if (template === 'bento') return <MinimalVideosPage />
  return <MinimalVideosPage />
}
