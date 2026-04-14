import { Loader2 } from 'lucide-react'
import { Card, CardContent } from '../ui/card'

export function AdminLoadingSection({ message }: { message: string }) {
  return (
    <Card className="border-zinc-800 bg-zinc-900">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
          <p className="text-sm text-zinc-300">{message}</p>
        </div>
      </CardContent>
    </Card>
  )
}
