import { GitBranch, ExternalLink } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'

type AdminLoginSectionProps = {
  isBusy: boolean
  isAuthenticating: boolean
  errorMessage: string | null
  onLogin: () => void
  deviceInfo?: { verificationUrl: string; userCode: string } | null
}

export function AdminLoginSection({ isBusy, isAuthenticating, errorMessage, onLogin, deviceInfo }: AdminLoginSectionProps) {
  return (
    <div className="flex w-full flex-col gap-6 sm:flex-row">
      {/* Login card */}
      <Card className="shrink-0 border-zinc-800 bg-zinc-900 sm:w-72">
        <CardContent className="pt-6">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/15 ring-1 ring-blue-500/30">
            <GitBranch className="h-5 w-5 text-blue-400" />
          </div>
          <h2 className="text-base font-semibold text-zinc-100">Gitfolio Admin</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Sign in with GitHub to edit your portfolio. Only users with <span className="font-medium text-zinc-300">admin</span> access to this repository can save changes.
          </p>

          <Button onClick={onLogin} disabled={isBusy} className="mt-5 w-full gap-2 bg-blue-600 hover:bg-blue-500 text-white">
            <GitBranch className="h-4 w-4" />
            {isBusy ? 'Signing in…' : 'Login with GitHub'}
          </Button>

          {isAuthenticating && deviceInfo && (
            <div className="mt-4 rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-xs space-y-2">
              <p className="font-medium text-zinc-200">Complete login in your browser</p>
              <p className="text-zinc-400">1. Open this URL (or check the tab that opened):</p>
              <a href={deviceInfo.verificationUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 break-all text-blue-400 hover:underline">
                {deviceInfo.verificationUrl}
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
              <p className="text-zinc-400">2. Enter this code if asked:</p>
              <code className="block rounded bg-zinc-900 px-2.5 py-1.5 text-sm font-mono font-bold tracking-widest text-amber-300">
                {deviceInfo.userCode}
              </code>
            </div>
          )}

          {isAuthenticating && !deviceInfo && (
            <p className="mt-3 text-xs text-zinc-500">Waiting for GitHub… Return here once authorized.</p>
          )}

          {errorMessage && (
            <p className="mt-3 rounded-md bg-red-950/50 border border-red-800/50 px-3 py-2 text-xs text-red-400">{errorMessage}</p>
          )}
        </CardContent>
      </Card>

      {/* Setup docs */}
      <Card className="flex-1 border-zinc-800 bg-zinc-900">
        <CardContent className="pt-6">
          <h3 className="text-sm font-semibold text-zinc-100">Setup guide (repo owners)</h3>
          <p className="mt-1.5 text-xs text-zinc-400">Follow these steps after forking Gitfolio.</p>

          <ol className="mt-4 space-y-5 text-xs text-zinc-400">
            <li>
              <p className="font-semibold text-zinc-200">1. Create a GitHub OAuth App</p>
              <ul className="mt-2 space-y-1 pl-3 list-disc">
                <li>Go to <a href="https://github.com/settings/developers" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">GitHub → Settings → Developer settings → OAuth Apps</a></li>
                <li>Set <strong>Homepage URL</strong> and <strong>Authorization callback URL</strong> to your site URL</li>
                <li>Copy the <strong>Client ID</strong></li>
              </ul>
            </li>
            <li>
              <p className="font-semibold text-zinc-200">2. Add the Client ID to your repo</p>
              <ul className="mt-2 space-y-1 pl-3 list-disc">
                <li>In your repo: <strong>Settings → Secrets and variables → Actions</strong></li>
                <li>Create a secret named <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">VITE_GITHUB_CLIENT_ID</code></li>
              </ul>
            </li>
            <li>
              <p className="font-semibold text-zinc-200">3. Production: OAuth proxy (fix CORS)</p>
              <ul className="mt-2 space-y-1 pl-3 list-disc">
                <li>From <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">workers/github-oauth-proxy/</code> run <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">npx wrangler deploy</code></li>
                <li>Add a repo variable <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">VITE_GITHUB_OAUTH_PROXY_URL</code> = your worker URL</li>
              </ul>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
