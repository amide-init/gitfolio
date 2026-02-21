import { useState, useRef, type KeyboardEvent } from 'react'

type AdminFeaturedReposFormProps = {
  value: string[]
  onChange: (repos: string[]) => void
}

function parseInputToRepos(input: string): string[] {
  return input
    .split(/[,\s]+/)
    .map((r) => r.trim())
    .filter(Boolean)
}

export function AdminFeaturedReposForm({
  value,
  onChange,
}: AdminFeaturedReposFormProps) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const addFromInput = () => {
    const toAdd = parseInputToRepos(input)
    if (toAdd.length === 0) {
      setInput('')
      return
    }
    const existing = new Set(value)
    const added = toAdd.filter((r) => !existing.has(r))
    if (added.length > 0) {
      onChange([...value, ...added])
    }
    setInput('')
  }

  const removeRepo = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault()
      addFromInput()
      return
    }
    if (e.key === 'Backspace' && !input && value.length > 0) {
      removeRepo(value.length - 1)
    }
  }

  return (
    <section>
      <h2 className="text-sm font-semibold text-slate-100">
        Featured repositories
      </h2>
      <p className="mt-1 text-xs text-slate-400">
        Add repo names or <code>owner/repo</code> (e.g. gitfolio or
        usedamru/sql2nosql). Type and press comma or Enter to add as a chip.
      </p>
      <div className="mt-3 flex min-h-[2.5rem] flex-wrap items-center gap-2 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 focus-within:border-emerald-500">
        {value.map((repo, index) => (
          <span
            key={`${repo}-${index}`}
            className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2 py-1 text-sm text-slate-200"
          >
            <span className="font-mono text-xs">{repo}</span>
            <button
              type="button"
              onClick={() => removeRepo(index)}
              className="rounded p-0.5 text-slate-400 hover:bg-slate-700 hover:text-slate-100"
              aria-label={`Remove ${repo}`}
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          className="min-w-[8rem] flex-1 shrink-0 border-0 bg-transparent px-0 py-0.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-0"
          placeholder={value.length === 0 ? 'e.g. gitfolio, usedamru/sql2nosql' : 'Add repo…'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addFromInput()}
        />
      </div>
    </section>
  )
}
