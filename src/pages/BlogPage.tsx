import { githubConfig } from '../generated/githubData'
import MinimalBlogPage from '../templates/minimal/BlogPage'

export default function BlogPage() {
  const template = (githubConfig as { template?: string }).template ?? 'minimal'
  // 'classic' and 'bento' templates will be added in future issues
  if (template === 'classic') return <MinimalBlogPage />
  if (template === 'bento') return <MinimalBlogPage />
  return <MinimalBlogPage />
}
