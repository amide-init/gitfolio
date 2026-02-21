import { createContext, useContext, type ReactNode } from 'react'
import type { GitforgeConfig } from '../../types/gitforgeConfig'
import type { AdminUiError, AdminViewState } from '../types'

type AdminAuthContextValue = {
  token: string | null
  viewState: AdminViewState
  repoName: string | null
  config: GitforgeConfig | null
  setConfig: React.Dispatch<React.SetStateAction<GitforgeConfig | null>>
  error: AdminUiError | null
  saveSuccess: string | null
  handleLogin: () => Promise<void>
  handleLogout: () => void
  handleSave: (e: React.FormEvent) => Promise<void>
  isBusy: boolean
  heading: string
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

export function AdminAuthProvider({
  value,
  children,
}: {
  value: AdminAuthContextValue
  children: ReactNode
}) {
  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuthContext() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) {
    throw new Error('useAdminAuthContext must be used within AdminAuthProvider')
  }
  return ctx
}
