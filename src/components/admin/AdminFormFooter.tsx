type AdminFormFooterProps = {
  errorMessage: string | null
  saveSuccessMessage: string | null
  isSaving: boolean
  isBusy: boolean
}

export function AdminFormFooter({
  errorMessage,
  saveSuccessMessage,
  isSaving,
  isBusy,
}: AdminFormFooterProps) {
  return (
    <section className="flex items-center justify-between gap-4 border-t border-slate-800 pt-4">
      <div className="space-y-1">
        {errorMessage && (
          <p className="text-xs text-rose-400">{errorMessage}</p>
        )}
        {saveSuccessMessage && (
          <p className="text-xs text-emerald-400">{saveSuccessMessage}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isBusy}
        className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
      >
        {isSaving ? 'Saving…' : 'Save changes'}
      </button>
    </section>
  )
}
