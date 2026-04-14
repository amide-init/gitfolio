import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'

type AdminFormFooterProps = {
  errorMessage: string | null
  saveSuccessMessage: string | null
  isSaving: boolean
  isBusy: boolean
}

export function AdminFormFooter({ errorMessage, saveSuccessMessage, isSaving, isBusy }: AdminFormFooterProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-zinc-800 pt-5">
      {saveSuccessMessage && (
        <div className="flex items-start gap-2 rounded-lg border border-green-800/50 bg-green-950/30 px-3 py-2.5 text-sm text-green-400">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          {saveSuccessMessage}
        </div>
      )}
      {errorMessage && (
        <div className="flex items-start gap-2 rounded-lg border border-red-800/50 bg-red-950/30 px-3 py-2.5 text-sm text-red-400">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {errorMessage}
        </div>
      )}
      <div className="flex justify-end">
        <Button type="submit" disabled={isBusy} className="min-w-24 bg-blue-600 hover:bg-blue-500 text-white gap-2">
          {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {isSaving ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </div>
  )
}
