import type { CustomLink, GitforgeConfig } from '../../types/gitforgeConfig'
import type { AdminViewState } from '../types'

/** Clean config before sending to API: trim strings, filter empty. */
export function cleanConfigForSave(config: GitforgeConfig): GitforgeConfig {
  return {
    ...config,
    featuredRepos:
      config.featuredRepos?.map((r) => r.trim()).filter(Boolean) ?? [],
    customLinks:
      config.customLinks
        ?.map((link) => ({
          ...link,
          title: link.title.trim(),
          url: link.url.trim(),
          description: link.description?.trim() || undefined,
        }))
        .filter((link) => link.title && link.url) ?? [],
  }
}

/** Parse comma-separated repo names into array. */
export function parseFeaturedReposText(value: string): string[] {
  return value
    .split(',')
    .map((r) => r.trim())
    .filter(Boolean)
}

export function getAdminHeading(viewState: AdminViewState): string {
  switch (viewState) {
    case 'checkingAuth':
      return 'Checking session…'
    case 'authenticating':
      return 'Authenticating with GitHub…'
    case 'checkingPermissions':
      return 'Verifying repository permissions…'
    case 'loadingConfig':
      return 'Loading configuration…'
    case 'saving':
      return 'Saving changes…'
    default:
      return 'Admin – gitfolio'
  }
}

export const DEFAULT_HERO = {
  eyebrow: 'Open-source, developer-first profile',
  minorInfo: '',
} as const

export const DEFAULT_CUSTOM_LINK: CustomLink = {
  title: '',
  url: '',
  description: '',
}
