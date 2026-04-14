import { githubConfig } from '../generated/githubData'
import MinimalBlogPage from '../templates/minimal/BlogPage'
import ClassicBlogPage from '../templates/classic/BlogPage'
import BentoBlogPage from '../templates/bento/BlogPage'
import HackerBlogPage from '../templates/hacker/BlogPage'
import NetflixBlogPage from '../templates/netflix/BlogPage'
import ThreejsBlogPage from '../templates/threejs/BlogPage'

export default function BlogPage() {
  const template = (githubConfig as { template?: string }).template ?? 'hacker'
  if (template === 'classic') return <ClassicBlogPage />
  if (template === 'bento') return <BentoBlogPage />
  if (template === 'hacker') return <HackerBlogPage />
  if (template === 'netflix') return <NetflixBlogPage />
  if (template === 'threejs') return <ThreejsBlogPage />
  return <MinimalBlogPage />
}
