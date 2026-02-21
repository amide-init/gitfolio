import { useCallback } from 'react'
import type { CustomLink, GitforgeConfig } from '../../types/gitforgeConfig'
import { DEFAULT_HERO, DEFAULT_CUSTOM_LINK } from '../utils/configHelpers'

export function useConfigForm(
  config: GitforgeConfig | null,
  setConfig: React.Dispatch<React.SetStateAction<GitforgeConfig | null>>,
) {
  const updateConfigField = useCallback(
    <K extends keyof GitforgeConfig>(key: K, value: GitforgeConfig[K]) => {
      setConfig((prev) => {
        if (!prev) return prev
        return { ...prev, [key]: value }
      })
    },
    [setConfig],
  )

  const handleFeaturedReposChange = useCallback(
    (repos: string[]) => {
      updateConfigField('featuredRepos', repos)
    },
    [updateConfigField],
  )

  const ensureHero = useCallback(() => {
    setConfig((prev) => {
      if (!prev) return prev
      if (prev.hero) return prev
      return { ...prev, hero: { ...DEFAULT_HERO } }
    })
  }, [setConfig])

  const updateHero = useCallback(
    <K extends keyof NonNullable<GitforgeConfig['hero']>>(
      key: K,
      value: NonNullable<GitforgeConfig['hero']>[K],
    ) => {
      ensureHero()
      setConfig((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          hero: {
            ...(prev.hero ?? { ...DEFAULT_HERO }),
            [key]: value,
          },
        }
      })
    },
    [ensureHero, setConfig],
  )

  const updateCustomLink = useCallback(
    (index: number, field: keyof CustomLink, value: string) => {
      setConfig((prev) => {
        if (!prev) return prev
        const current = prev.customLinks ?? []
        const next: CustomLink[] = current.map((item, i) =>
          i === index ? { ...item, [field]: value } : item,
        )
        return { ...prev, customLinks: next }
      })
    },
    [setConfig],
  )

  const addCustomLink = useCallback(() => {
    setConfig((prev) => {
      if (!prev) return prev
      const current = prev.customLinks ?? []
      return {
        ...prev,
        customLinks: [...current, { ...DEFAULT_CUSTOM_LINK }],
      }
    })
  }, [setConfig])

  const removeCustomLink = useCallback(
    (index: number) => {
      setConfig((prev) => {
        if (!prev) return prev
        const current = prev.customLinks ?? []
        const next = current.filter((_, i) => i !== index)
        return { ...prev, customLinks: next }
      })
    },
    [setConfig],
  )

  return {
    updateConfigField,
    handleFeaturedReposChange,
    updateHero,
    updateCustomLink,
    addCustomLink,
    removeCustomLink,
  }
}
