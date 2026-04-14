import { githubConfig } from '../generated/githubData'
import MinimalHomePage from '../templates/minimal/HomePage'
import ClassicHomePage from '../templates/classic/HomePage'
import BentoHomePage from '../templates/bento/HomePage'
import HackerHomePage from '../templates/hacker/HomePage'
import NetflixHomePage from '../templates/netflix/HomePage'

export default function HomePage() {
  const template = (githubConfig as { template?: string }).template ?? 'hacker'
  if (template === 'classic') return <ClassicHomePage />
  if (template === 'bento') return <BentoHomePage />
  if (template === 'hacker') return <HackerHomePage />
  if (template === 'netflix') return <NetflixHomePage />
  return <MinimalHomePage />
}
