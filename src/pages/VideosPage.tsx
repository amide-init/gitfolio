import { githubConfig } from '../generated/githubData'
import MinimalVideosPage from '../templates/minimal/VideosPage'
import ClassicVideosPage from '../templates/classic/VideosPage'
import BentoVideosPage from '../templates/bento/VideosPage'
import HackerVideosPage from '../templates/hacker/VideosPage'
import NetflixVideosPage from '../templates/netflix/VideosPage'
import ThreejsVideosPage from '../templates/threejs/VideosPage'

export default function VideosPage() {
  const template = (githubConfig as { template?: string }).template ?? 'hacker'
  if (template === 'classic') return <ClassicVideosPage />
  if (template === 'bento') return <BentoVideosPage />
  if (template === 'hacker') return <HackerVideosPage />
  if (template === 'netflix') return <NetflixVideosPage />
  if (template === 'threejs') return <ThreejsVideosPage />
  return <MinimalVideosPage />
}
