export type AdminViewState =
  | 'checkingAuth'
  | 'unauthenticated'
  | 'authenticating'
  | 'checkingPermissions'
  | 'unauthorized'
  | 'loadingConfig'
  | 'ready'
  | 'saving'

export type AdminUiError = {
  message: string
  details?: string
}
