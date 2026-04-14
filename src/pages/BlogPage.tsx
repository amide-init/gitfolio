import { githubConfig } from '../generated/githubData'
import MinimalBlogPage from '../templates/minimal/BlogPage'
import ClassicBlogPage from '../templates/classic/BlogPage'
import BentoBlogPage from '../templates/bento/BlogPage'

export default function BlogPage() {
  const template = (githubConfig as { template?: string }).template ?? 'minimal'
  if (template === 'classic') return <ClassicBlogPage />
  if (template === 'bento') return <BentoBlogPage />
  return <MinimalBlogPage />
}
