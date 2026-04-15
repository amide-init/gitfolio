import { activeTemplate } from '../lib/activeTemplate'
import MinimalBlogsPage from '../templates/minimal/BlogsPage'
import ClassicBlogsPage from '../templates/classic/BlogsPage'
import BentoBlogsPage from '../templates/bento/BlogsPage'
import HackerBlogsPage from '../templates/hacker/BlogsPage'
import NetflixBlogsPage from '../templates/netflix/BlogsPage'
import ThreejsBlogsPage from '../templates/threejs/BlogsPage'
import MinecraftBlogsPage from '../templates/minecraft/BlogsPage'

export default function BlogsPage() {
  if (activeTemplate === 'classic') return <ClassicBlogsPage />
  if (activeTemplate === 'bento') return <BentoBlogsPage />
  if (activeTemplate === 'hacker') return <HackerBlogsPage />
  if (activeTemplate === 'netflix') return <NetflixBlogsPage />
  if (activeTemplate === 'threejs') return <ThreejsBlogsPage />
  if (activeTemplate === 'minecraft') return <MinecraftBlogsPage />
  return <MinimalBlogsPage />
}
