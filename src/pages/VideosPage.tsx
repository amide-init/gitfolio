import { githubConfig } from '../generated/githubData'
import type { GitforgeConfig } from '../types/gitforgeConfig'
import MinimalVideosPage from '../templates/minimal/VideosPage'

export default function VideosPage() {
  const template = (githubConfig as GitforgeConfig).template ?? 'minimal'
  // 'classic' and 'bento' will be swapped in once those templates are built (#20, #21)
  return <MinimalVideosPage />
}
