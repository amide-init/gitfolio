import { Plus, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import type { CustomLink } from '../../types/gitforgeConfig'

type AdminCustomLinksFormProps = {
  links: CustomLink[]
  onUpdate: (index: number, field: keyof CustomLink, value: string) => void
  onAdd: () => void
  onRemove: (index: number) => void
}

export function AdminCustomLinksForm({ links, onUpdate, onAdd, onRemove }: AdminCustomLinksFormProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-zinc-300">Custom links</Label>
          <p className="mt-0.5 text-xs text-zinc-500">Add external links shown in your profile (blog, newsletter, talks…).</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onAdd} className="gap-1.5 border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100">
          <Plus className="h-3.5 w-3.5" /> Add link
        </Button>
      </div>

      {links.length === 0 && (
        <p className="rounded-lg border border-dashed border-zinc-800 py-6 text-center text-xs text-zinc-600">No custom links yet.</p>
      )}

      <div className="space-y-3">
        {links.map((link, i) => (
          <div key={i} className="group rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">Link {i + 1}</span>
              <Button type="button" variant="ghost" size="icon" onClick={() => onRemove(i)} className="h-7 w-7 text-zinc-600 hover:text-red-400 hover:bg-red-950/30">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            <Input
              type="text"
              placeholder="Title (e.g. Personal blog)"
              value={link.title}
              onChange={(e) => onUpdate(i, 'title', e.target.value)}
              className="border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-blue-500"
            />
            <Input
              type="url"
              placeholder="URL (https://…)"
              value={link.url}
              onChange={(e) => onUpdate(i, 'url', e.target.value)}
              className="border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-blue-500"
            />
            <Textarea
              rows={2}
              placeholder="Short description (optional)"
              value={link.description ?? ''}
              onChange={(e) => onUpdate(i, 'description', e.target.value)}
              className="border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-blue-500"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
