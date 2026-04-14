import { githubConfig } from '../generated/githubData'
import MinimalBlogsPage from '../templates/minimal/BlogsPage'
import ClassicBlogsPage from '../templates/classic/BlogsPage'
import BentoBlogsPage from '../templates/bento/BlogsPage'
import HackerBlogsPage from '../templates/hacker/BlogsPage'

export default function BlogsPage() {
  const template = (githubConfig as { template?: string }).template ?? 'hacker'
  if (template === 'classic') return <ClassicBlogsPage />
  if (template === 'bento') return <BentoBlogsPage />
  if (template === 'hacker') return <HackerBlogsPage />
  return <MinimalBlogsPage />
}
