import { activeTemplate } from '../lib/activeTemplate'
import MinimalVideosPage from '../templates/minimal/VideosPage'
import ClassicVideosPage from '../templates/classic/VideosPage'
import BentoVideosPage from '../templates/bento/VideosPage'
import HackerVideosPage from '../templates/hacker/VideosPage'
import NetflixVideosPage from '../templates/netflix/VideosPage'
import ThreejsVideosPage from '../templates/threejs/VideosPage'
import MinecraftVideosPage from '../templates/minecraft/VideosPage'

export default function VideosPage() {
  if (activeTemplate === 'classic') return <ClassicVideosPage />
  if (activeTemplate === 'bento') return <BentoVideosPage />
  if (activeTemplate === 'hacker') return <HackerVideosPage />
  if (activeTemplate === 'netflix') return <NetflixVideosPage />
  if (activeTemplate === 'threejs') return <ThreejsVideosPage />
  if (activeTemplate === 'minecraft') return <MinecraftVideosPage />
  return <MinimalVideosPage />
}
