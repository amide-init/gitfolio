import { githubConfig } from '../generated/githubData'
import MinimalBlogsPage from '../templates/minimal/BlogsPage'
import ClassicBlogsPage from '../templates/classic/BlogsPage'
import BentoBlogsPage from '../templates/bento/BlogsPage'

export default function BlogsPage() {
  const template = (githubConfig as { template?: string }).template ?? 'minimal'
  if (template === 'classic') return <ClassicBlogsPage />
  if (template === 'bento') return <BentoBlogsPage />
  return <MinimalBlogsPage />
}
