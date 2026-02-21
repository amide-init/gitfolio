import type { GitforgeConfig } from '../../types/gitforgeConfig'

type AdminHeroFormProps = {
  hero: GitforgeConfig['hero']
  onEyebrowChange: (value: string) => void
  onMinorInfoChange: (value: string) => void
}

export function AdminHeroForm({
  hero,
  onEyebrowChange,
  onMinorInfoChange,
}: AdminHeroFormProps) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-slate-100">Hero section</h2>
      <p className="mt-1 text-xs text-slate-400">
        Controls the eyebrow text and minor info displayed in the hero section.
      </p>
      <div className="mt-4 space-y-3">
        <label className="block text-xs font-medium text-slate-300">
          Eyebrow (small text above title)
          <input
            type="text"
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
            value={hero?.eyebrow ?? ''}
            onChange={(e) => onEyebrowChange(e.target.value)}
          />
        </label>
        <label className="block text-xs font-medium text-slate-300">
          Minor Info (subtitle/bio text)
          <textarea
            rows={3}
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
            value={hero?.minorInfo ?? ''}
            onChange={(e) => onMinorInfoChange(e.target.value)}
          />
        </label>
      </div>
    </section>
  )
}
