import { githubConfig } from '../generated/githubData'
import type { GitforgeConfig } from '../types/gitforgeConfig'
import MinimalHomePage from '../templates/minimal/HomePage'
import ClassicHomePage from '../templates/classic/HomePage'

export default function HomePage() {
  const template = (githubConfig as GitforgeConfig).template ?? 'minimal'
  if (template === 'classic') return <ClassicHomePage />
  // 'bento' will be swapped in once #21 is built
  return <MinimalHomePage />
}
