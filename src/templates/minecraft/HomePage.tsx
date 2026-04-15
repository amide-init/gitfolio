import { useOutletContext } from 'react-router-dom'
import siteContent from '../../siteContent.json'
import { githubConfig } from '../../generated/githubData'
import type { LayoutContext } from '../../App'
import HeroSection from './HeroSection'
import PhilosophySection from './PhilosophySection'
import VideosSection from './VideosSection'
import BlogsSection from './BlogsSection'
import CustomProjectsSection from './CustomProjectsSection'
import GitHubSection from './GitHubSection'
import StatsSection from './StatsSection'

const stats = (siteContent as { stats?: unknown }).stats as {
  metrics: { totalRepos: number; totalStars: number; totalForks: number; totalOpenIssues: number; languagesUsed: number; followers: number; following: number }
  languageDistribution: Array<{ language: string; count: number; percentage: number }>
  activityByYear: Array<{ year: number; repos: number }>
  commitActivityByYear?: Array<{ year: number; commits: number }>
  topReposByStars: Array<{ name: string; stars: number; language: string }>
} | null | undefined

export default function MinecraftHomePage() {
  const { theme } = useOutletContext<LayoutContext>()
  const { hero, snapshot, philosophy, projects } = siteContent as any

  const sectionsConfig = githubConfig as {
    showVideosSection?: boolean
    showBlogsSection?: boolean
    showProjectsSection?: boolean
  }

  const showVideos = sectionsConfig.showVideosSection !== false
  const showBlogs = sectionsConfig.showBlogsSection !== false
  const showProjects = sectionsConfig.showProjectsSection !== false

  return (
    <div className="bg-[#1a1a2e] divide-y-2 divide-[#3b3b3b]">
      <HeroSection hero={hero} snapshot={snapshot} theme={theme} />
      <PhilosophySection philosophy={philosophy} />
      {showVideos && <VideosSection />}
      {showBlogs && <BlogsSection />}
      {showProjects && <CustomProjectsSection />}
      <GitHubSection
        title={projects?.title ?? 'GitHub'}
        body={projects?.body ?? 'Repositories from this GitHub profile.'}
        repos={projects?.repos ?? []}
      />
      <StatsSection stats={stats ?? null} />
    </div>
  )
}
