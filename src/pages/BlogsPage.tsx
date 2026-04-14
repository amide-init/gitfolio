import { githubConfig } from '../generated/githubData'
import MinimalBlogsPage from '../templates/minimal/BlogsPage'

export default function BlogsPage() {
  const template = (githubConfig as { template?: string }).template ?? 'minimal'
  // 'classic' and 'bento' templates will be added in future issues
  if (template === 'classic') return <MinimalBlogsPage />
  if (template === 'bento') return <MinimalBlogsPage />
  return <MinimalBlogsPage />
}
