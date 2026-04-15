import { activeTemplate } from '../lib/activeTemplate'
import MinimalHomePage from '../templates/minimal/HomePage'
import ClassicHomePage from '../templates/classic/HomePage'
import BentoHomePage from '../templates/bento/HomePage'
import HackerHomePage from '../templates/hacker/HomePage'
import NetflixHomePage from '../templates/netflix/HomePage'
import ThreejsHomePage from '../templates/threejs/HomePage'
import MinecraftHomePage from '../templates/minecraft/HomePage'

export default function HomePage() {
  if (activeTemplate === 'classic') return <ClassicHomePage />
  if (activeTemplate === 'bento') return <BentoHomePage />
  if (activeTemplate === 'hacker') return <HackerHomePage />
  if (activeTemplate === 'netflix') return <NetflixHomePage />
  if (activeTemplate === 'threejs') return <ThreejsHomePage />
  if (activeTemplate === 'minecraft') return <MinecraftHomePage />
  return <MinimalHomePage />
}
