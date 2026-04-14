import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import type { GitforgeConfig } from '../../types/gitforgeConfig'

type AdminHeroFormProps = {
  hero: GitforgeConfig['hero']
  onEyebrowChange: (value: string) => void
  onMinorInfoChange: (value: string) => void
}

export function AdminHeroForm({ hero, onEyebrowChange, onMinorInfoChange }: AdminHeroFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="eyebrow" className="text-zinc-300">Eyebrow</Label>
        <p className="text-xs text-zinc-500">Small text displayed above the title in the hero section.</p>
        <Input
          id="eyebrow"
          value={hero?.eyebrow ?? ''}
          onChange={(e) => onEyebrowChange(e.target.value)}
          placeholder="e.g. Open-source developer"
          className="border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-blue-500"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="minorInfo" className="text-zinc-300">Bio / Minor Info</Label>
        <p className="text-xs text-zinc-500">Subtitle or bio text shown below the title.</p>
        <Textarea
          id="minorInfo"
          rows={3}
          value={hero?.minorInfo ?? ''}
          onChange={(e) => onMinorInfoChange(e.target.value)}
          placeholder="A short bio or tagline…"
          className="border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-blue-500"
        />
      </div>
    </div>
  )
}
