import { githubConfig } from '../generated/githubData'
import type { GitforgeConfig } from '../types/gitforgeConfig'
import MinimalHomePage from '../templates/minimal/HomePage'
import ClassicHomePage from '../templates/classic/HomePage'
import BentoHomePage from '../templates/bento/HomePage'

export default function HomePage() {
  const template = (githubConfig as GitforgeConfig).template ?? 'minimal'
  if (template === 'classic') return <ClassicHomePage />
  if (template === 'bento') return <BentoHomePage />
  return <MinimalHomePage />
}
