import { githubConfig } from '../generated/githubData'
import MinimalVideosPage from '../templates/minimal/VideosPage'
import ClassicVideosPage from '../templates/classic/VideosPage'
import BentoVideosPage from '../templates/bento/VideosPage'
import HackerVideosPage from '../templates/hacker/VideosPage'

export default function VideosPage() {
  const template = (githubConfig as { template?: string }).template ?? 'minimal'
  if (template === 'classic') return <ClassicVideosPage />
  if (template === 'bento') return <BentoVideosPage />
  if (template === 'hacker') return <HackerVideosPage />
  return <MinimalVideosPage />
}
