import { activeTemplate } from '../lib/activeTemplate'
import MinimalBlogPage from '../templates/minimal/BlogPage'
import ClassicBlogPage from '../templates/classic/BlogPage'
import BentoBlogPage from '../templates/bento/BlogPage'
import HackerBlogPage from '../templates/hacker/BlogPage'
import NetflixBlogPage from '../templates/netflix/BlogPage'
import ThreejsBlogPage from '../templates/threejs/BlogPage'
import MinecraftBlogPage from '../templates/minecraft/BlogPage'

export default function BlogPage() {
  if (activeTemplate === 'classic') return <ClassicBlogPage />
  if (activeTemplate === 'bento') return <BentoBlogPage />
  if (activeTemplate === 'hacker') return <HackerBlogPage />
  if (activeTemplate === 'netflix') return <NetflixBlogPage />
  if (activeTemplate === 'threejs') return <ThreejsBlogPage />
  if (activeTemplate === 'minecraft') return <MinecraftBlogPage />
  return <MinimalBlogPage />
}
