import { githubConfig } from '../generated/githubData'
import type { GitforgeConfig } from '../types/gitforgeConfig'
import MinimalVideosPage from '../templates/minimal/VideosPage'
import ClassicVideosPage from '../templates/classic/VideosPage'

export default function VideosPage() {
  const template = (githubConfig as GitforgeConfig).template ?? 'minimal'
  if (template === 'classic') return <ClassicVideosPage />
  return <MinimalVideosPage />
}
