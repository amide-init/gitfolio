// src/types/gitforgeConfig.ts
export type ProfileType = 'user' | 'org'

export type ListedRepoSort =
  | 'date'
  | 'star'
  | 'date-then-star'
  | 'star-then-date'

export interface ListedRepoConfig {
  count: number
  sort: ListedRepoSort
}

export interface HeroConfig {
  eyebrow?: string
  minorInfo?: string
  title?: string
  bio?: string
}

export interface CustomLink {
  title: string
  url: string
  description?: string
}

export interface GitforgeConfig {
  githubOwner: string
  profileType: ProfileType
  githubToken?: string | null
  featuredRepos?: string[]
  listedRepo?: ListedRepoConfig
  hero?: HeroConfig
  customLinks?: CustomLink[]
  showStats?: boolean
  stats?: {
    showLanguageChart?: boolean
    showRepoActivityChart?: boolean
    showCommitActivityChart?: boolean
    showTopReposChart?: boolean
  }
  contact?: {
    showCompany?: boolean
    showEmail?: boolean
    showWebsite?: boolean
    showTwitter?: boolean
  }
}
