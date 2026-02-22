import { useOutletContext } from 'react-router-dom'
import siteContent from '../siteContent.json'
import type { LayoutContext } from '../App'
import HeroSection from '../components/HeroSection'
import PhilosophySection from '../components/PhilosophySection'
import VideosSection from '../components/VideosSection'
import BlogsSection from '../components/BlogsSection'
import CustomProjectsSection from '../components/CustomProjectsSection'
import GitHubSection from '../components/GitHubSection'
import StatsSection from '../components/StatsSection'

const stats = (siteContent as { stats?: unknown }).stats as {
  metrics: { totalRepos: number; totalStars: number; totalForks: number; totalOpenIssues: number; languagesUsed: number; followers: number; following: number }
  languageDistribution: Array<{ language: string; count: number; percentage: number }>
  activityByYear: Array<{ year: number; repos: number }>
  topReposByStars: Array<{ name: string; stars: number; language: string }>
} | null | undefined

export default function HomePage() {
  const { theme } = useOutletContext<LayoutContext>()
  const { hero, snapshot, philosophy, projects, footer } = siteContent as {
    hero: unknown
    snapshot: unknown
    philosophy: unknown
    projects: { title?: string; body?: string; repos: unknown[] }
    footer: unknown
  }

  return (
    <main>
      <HeroSection hero={hero} snapshot={snapshot} theme={theme} />
      <PhilosophySection philosophy={philosophy} />
      <VideosSection />
      <BlogsSection />
      <CustomProjectsSection />
      <GitHubSection
        title={projects?.title ?? 'GitHub'}
        body={projects?.body ?? 'Repositories from this GitHub profile.'}
        repos={projects?.repos ?? []}
      />
      <StatsSection stats={stats ?? null} />
    </main>
  )
}
