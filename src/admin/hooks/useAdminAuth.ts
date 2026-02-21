import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  clearStoredToken,
  getConfig,
  getRepo,
  getStoredToken,
  login,
  updateConfig,
} from '../../api/github'
import type { GitforgeConfig } from '../../types/gitforgeConfig'
import type { AdminUiError, AdminViewState } from '../types'
import { cleanConfigForSave, getAdminHeading } from '../utils/configHelpers'

export function useAdminAuth() {
  const [token, setToken] = useState<string | null>(() => getStoredToken())
  const [viewState, setViewState] = useState<AdminViewState>('checkingAuth')
  const [repoName, setRepoName] = useState<string | null>(null)
  const [config, setConfig] = useState<GitforgeConfig | null>(null)
  const [configSha, setConfigSha] = useState<string | null>(null)
  const [error, setError] = useState<AdminUiError | null>(null)
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      if (!token) {
        setViewState('unauthenticated')
        return
      }

      try {
        setViewState('checkingPermissions')
        const repo = await getRepo(token)
        if (cancelled) return

        setRepoName(repo.full_name)

        if (!repo.permissions?.admin) {
          setViewState('unauthorized')
          return
        }

        setViewState('loadingConfig')
        const { config: loadedConfig, sha } = await getConfig(token)
        if (cancelled) return

        setConfig(loadedConfig)
        setConfigSha(sha)
        setViewState('ready')
      } catch (err) {
        if (cancelled) return
        setError({
          message: 'Failed to verify permissions.',
          details: String(err),
        })
        clearStoredToken()
        setToken(null)
        setViewState('unauthenticated')
      }
    }

    void bootstrap()

    return () => {
      cancelled = true
    }
  }, [token])

  const handleLogin = useCallback(async () => {
    setError(null)
    setSaveSuccess(null)

    try {
      setViewState('authenticating')
      const newToken = await login()
      setToken(newToken)
    } catch (err) {
      setViewState('unauthenticated')
      setError({
        message: 'GitHub login failed.',
        details: String(err),
      })
    }
  }, [])

  const handleLogout = useCallback(() => {
    clearStoredToken()
    setToken(null)
    setConfig(null)
    setConfigSha(null)
    setRepoName(null)
    setViewState('unauthenticated')
    setError(null)
    setSaveSuccess(null)
  }, [])

  const handleSave = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!token || !config) return

      setError(null)
      setSaveSuccess(null)
      setViewState('saving')

      try {
        const cleaned = cleanConfigForSave(config)

        const { sha } = await updateConfig(token, {
          config: cleaned,
          sha: configSha,
          message: 'Update gitfolio config via admin panel',
        })

        setConfig(cleaned)
        setConfigSha(sha)
        setSaveSuccess(
          'Config saved. GitHub Actions will rebuild the site shortly.',
        )
        setViewState('ready')
      } catch (err) {
        setViewState('ready')
        setError({
          message: 'Failed to save configuration.',
          details: String(err),
        })
      }
    },
    [token, config, configSha],
  )

  const isBusy =
    viewState === 'authenticating' ||
    viewState === 'checkingPermissions' ||
    viewState === 'loadingConfig' ||
    viewState === 'saving'

  const heading = useMemo(() => getAdminHeading(viewState), [viewState])

  return {
    token,
    viewState,
    repoName,
    config,
    setConfig,
    configSha,
    setConfigSha,
    error,
    setError,
    saveSuccess,
    setSaveSuccess,
    handleLogin,
    handleLogout,
    handleSave,
    isBusy,
    heading,
  }
}
