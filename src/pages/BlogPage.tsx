import { githubConfig } from '../generated/githubData'
import type { GitforgeConfig } from '../types/gitforgeConfig'
import MinimalBlogPage from '../templates/minimal/BlogPage'
import ClassicBlogPage from '../templates/classic/BlogPage'

export default function BlogPage() {
  const template = (githubConfig as GitforgeConfig).template ?? 'minimal'
  if (template === 'classic') return <ClassicBlogPage />
  return <MinimalBlogPage />
}
