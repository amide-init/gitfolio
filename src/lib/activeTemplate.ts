import { githubConfig } from '../generated/githubData'

export type TemplateName = 'minimal' | 'classic' | 'bento' | 'hacker' | 'netflix' | 'threejs' | 'minecraft'

export const DEFAULT_TEMPLATE: TemplateName = 'threejs'

export const activeTemplate: TemplateName =
  ((githubConfig as { template?: string }).template as TemplateName | undefined) ?? DEFAULT_TEMPLATE
