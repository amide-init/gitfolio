import { githubConfig } from '../generated/githubData'
import MinimalBlogsPage from '../templates/minimal/BlogsPage'
import ClassicBlogsPage from '../templates/classic/BlogsPage'
import BentoBlogsPage from '../templates/bento/BlogsPage'
import HackerBlogsPage from '../templates/hacker/BlogsPage'
import NetflixBlogsPage from '../templates/netflix/BlogsPage'
import ThreejsBlogsPage from '../templates/threejs/BlogsPage'

export default function BlogsPage() {
  const template = (githubConfig as { template?: string }).template ?? 'hacker'
  if (template === 'classic') return <ClassicBlogsPage />
  if (template === 'bento') return <BentoBlogsPage />
  if (template === 'hacker') return <HackerBlogsPage />
  if (template === 'netflix') return <NetflixBlogsPage />
  if (template === 'threejs') return <ThreejsBlogsPage />
  return <MinimalBlogsPage />
}
