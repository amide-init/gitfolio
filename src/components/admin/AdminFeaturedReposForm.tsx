import { useState, useRef, type KeyboardEvent } from 'react'
import { X } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

type AdminFeaturedReposFormProps = {
  value: string[]
  onChange: (repos: string[]) => void
}

function parseInputToRepos(input: string): string[] {
  return input.split(/[,\s]+/).map((r) => r.trim()).filter(Boolean)
}

export function AdminFeaturedReposForm({ value, onChange }: AdminFeaturedReposFormProps) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const addFromInput = () => {
    const toAdd = parseInputToRepos(input)
    if (!toAdd.length) { setInput(''); return }
    const existing = new Set(value)
    const added = toAdd.filter((r) => !existing.has(r))
    if (added.length) onChange([...value, ...added])
    setInput('')
  }

  const removeRepo = (i: number) => onChange(value.filter((_, idx) => idx !== i))

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ',' || e.key === 'Enter') { e.preventDefault(); addFromInput(); return }
    if (e.key === 'Backspace' && !input && value.length > 0) removeRepo(value.length - 1)
  }

  return (
    <div className="space-y-1.5">
      <Label className="text-zinc-300">Featured repositories</Label>
      <p className="text-xs text-zinc-500">Type a repo name and press <kbd className="rounded bg-zinc-800 px-1 text-zinc-400">Enter</kbd> or comma to add.</p>
      <div
        className="flex min-h-[2.5rem] flex-wrap items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 focus-within:ring-1 focus-within:ring-blue-500 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((repo, i) => (
          <span key={`${repo}-${i}`} className="inline-flex items-center gap-1 rounded-md bg-blue-600/15 border border-blue-500/30 px-2 py-0.5 text-xs font-mono text-blue-300">
            {repo}
            <button type="button" onClick={() => removeRepo(i)} className="rounded p-0.5 text-blue-400/70 hover:text-blue-200" aria-label={`Remove ${repo}`}>
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <Input
          ref={inputRef}
          type="text"
          className="min-w-[8rem] flex-1 border-0 bg-transparent px-0 py-0 text-sm shadow-none text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-0"
          placeholder={value.length === 0 ? 'e.g. gitfolio, owner/repo' : 'Add repo…'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addFromInput()}
        />
      </div>
    </div>
  )
}
