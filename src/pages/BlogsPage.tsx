import { githubConfig } from '../generated/githubData'
import type { GitforgeConfig } from '../types/gitforgeConfig'
import MinimalBlogsPage from '../templates/minimal/BlogsPage'
import ClassicBlogsPage from '../templates/classic/BlogsPage'

export default function BlogsPage() {
  const template = (githubConfig as GitforgeConfig).template ?? 'minimal'
  if (template === 'classic') return <ClassicBlogsPage />
  return <MinimalBlogsPage />
}
