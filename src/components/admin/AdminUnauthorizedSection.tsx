import { ShieldOff } from 'lucide-react'
import { Card, CardContent } from '../ui/card'

export function AdminUnauthorizedSection() {
  return (
    <Card className="border-red-900/50 bg-red-950/20">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/15">
            <ShieldOff className="h-4 w-4 text-red-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-red-200">Unauthorized</h2>
            <p className="mt-1 text-sm text-red-300/70">
              Your GitHub account doesn't have <span className="font-medium text-red-200">admin permission</span> on this repository. Only admins can edit the portfolio.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
