import { useAdminAuthContext } from '../context/AdminAuthContext'
import { useConfigForm } from '../hooks/useConfigForm'
import { AdminFormFooter } from '../../components/admin'

const TEMPLATES = [
  {
    id: 'minimal' as const,
    label: 'Minimal',
    description: 'Dark, text-first, developer-focused',
    preview: (
      <svg viewBox="0 0 120 80" className="h-full w-full" aria-hidden="true">
        <rect width="120" height="80" fill="#050509" />
        <rect x="12" y="12" width="50" height="6" rx="2" fill="#6366f1" opacity="0.5" />
        <rect x="12" y="22" width="70" height="10" rx="2" fill="#f8fafc" opacity="0.9" />
        <rect x="12" y="36" width="55" height="4" rx="1" fill="#94a3b8" opacity="0.6" />
        <rect x="12" y="44" width="40" height="4" rx="1" fill="#94a3b8" opacity="0.4" />
        <rect x="12" y="58" width="28" height="14" rx="3" fill="#1e1e2e" stroke="#ffffff" strokeOpacity="0.1" />
        <rect x="46" y="58" width="28" height="14" rx="3" fill="#1e1e2e" stroke="#ffffff" strokeOpacity="0.1" />
        <rect x="80" y="58" width="28" height="14" rx="3" fill="#1e1e2e" stroke="#ffffff" strokeOpacity="0.1" />
      </svg>
    ),
  },
  {
    id: 'classic' as const,
    label: 'Classic',
    description: 'Light, card-based, resume-style',
    preview: (
      <svg viewBox="0 0 120 80" className="h-full w-full" aria-hidden="true">
        <rect width="120" height="80" fill="#f8fafc" />
        <rect x="12" y="10" width="96" height="22" rx="3" fill="#ffffff" stroke="#e2e8f0" />
        <rect x="18" y="15" width="30" height="5" rx="1.5" fill="#1e293b" opacity="0.8" />
        <rect x="18" y="23" width="50" height="3" rx="1" fill="#64748b" opacity="0.5" />
        <rect x="12" y="38" width="29" height="18" rx="3" fill="#ffffff" stroke="#e2e8f0" />
        <rect x="47" y="38" width="29" height="18" rx="3" fill="#ffffff" stroke="#e2e8f0" />
        <rect x="82" y="38" width="26" height="18" rx="3" fill="#ffffff" stroke="#e2e8f0" />
        <rect x="16" y="42" width="18" height="3" rx="1" fill="#1e293b" opacity="0.7" />
        <rect x="16" y="48" width="22" height="2" rx="1" fill="#94a3b8" opacity="0.5" />
        <rect x="51" y="42" width="18" height="3" rx="1" fill="#1e293b" opacity="0.7" />
        <rect x="51" y="48" width="22" height="2" rx="1" fill="#94a3b8" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'bento' as const,
    label: 'Bento',
    description: 'Mosaic grid, creative layout',
    preview: (
      <svg viewBox="0 0 120 80" className="h-full w-full" aria-hidden="true">
        <rect width="120" height="80" fill="#0f0f1a" />
        <rect x="8" y="8" width="55" height="40" rx="4" fill="#1a1a2e" stroke="#ffffff" strokeOpacity="0.08" />
        <rect x="69" y="8" width="43" height="18" rx="4" fill="#1a1a2e" stroke="#ffffff" strokeOpacity="0.08" />
        <rect x="69" y="30" width="43" height="18" rx="4" fill="#1a1a2e" stroke="#ffffff" strokeOpacity="0.08" />
        <rect x="8" y="53" width="27" height="19" rx="4" fill="#1a1a2e" stroke="#ffffff" strokeOpacity="0.08" />
        <rect x="39" y="53" width="27" height="19" rx="4" fill="#1a1a2e" stroke="#ffffff" strokeOpacity="0.08" />
        <rect x="70" y="53" width="42" height="19" rx="4" fill="#6366f1" opacity="0.3" />
        <rect x="14" y="18" width="30" height="5" rx="1.5" fill="#f8fafc" opacity="0.8" />
        <rect x="14" y="27" width="42" height="3" rx="1" fill="#94a3b8" opacity="0.4" />
      </svg>
    ),
  },
  {
    id: 'hacker' as const,
    label: 'Hacker',
    description: 'Terminal, green-on-black, ASCII',
    preview: (
      <svg viewBox="0 0 120 80" className="h-full w-full" aria-hidden="true">
        <rect width="120" height="80" fill="#000000" />
        <rect x="0" y="0" width="120" height="10" fill="#020d02" />
        <circle cx="8" cy="5" r="2" fill="#ff5f56" opacity="0.7" />
        <circle cx="15" cy="5" r="2" fill="#ffbd2e" opacity="0.7" />
        <circle cx="22" cy="5" r="2" fill="#27c93f" opacity="0.7" />
        <rect x="8" y="16" width="6" height="2" rx="0.5" fill="#004400" />
        <rect x="16" y="16" width="40" height="2" rx="0.5" fill="#00aa44" opacity="0.8" />
        <rect x="8" y="22" width="60" height="2" rx="0.5" fill="#006600" opacity="0.5" />
        <rect x="8" y="30" width="6" height="2" rx="0.5" fill="#004400" />
        <rect x="16" y="30" width="30" height="2" rx="0.5" fill="#00aa44" opacity="0.8" />
        <rect x="8" y="38" width="4" height="2" rx="0" fill="#002200" />
        <rect x="14" y="38" width="42" height="2" rx="0" fill="#00ff41" opacity="0.5" />
        <rect x="8" y="43" width="4" height="2" rx="0" fill="#002200" />
        <rect x="14" y="43" width="26" height="2" rx="0" fill="#00cc33" opacity="0.5" />
        <rect x="8" y="48" width="4" height="2" rx="0" fill="#002200" />
        <rect x="14" y="48" width="56" height="2" rx="0" fill="#00ff41" opacity="0.4" />
        <rect x="8" y="60" width="6" height="2" rx="0.5" fill="#004400" />
        <rect x="16" y="58" width="4" height="8" rx="0" fill="#00ff41" opacity="0.9" />
      </svg>
    ),
  },
]

export function AdminTemplatePage() {
  const { config, setConfig, error, saveSuccess, handleSave, isBusy, viewState } =
    useAdminAuthContext()
  const { updateConfigField } = useConfigForm(config, setConfig)

  if (!config || (viewState !== 'ready' && viewState !== 'saving')) return null

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-100">Template</h2>
        <p className="mt-1 text-sm text-slate-400">
          Choose the visual layout for your portfolio. Changes are committed to the repo and trigger a rebuild.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {TEMPLATES.map(({ id, label, description, preview }) => {
          const isActive = (config.template ?? 'minimal') === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => updateConfigField('template', id)}
              className={`relative flex flex-col overflow-hidden rounded-xl border text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                isActive
                  ? 'border-indigo-500 ring-2 ring-indigo-500/40'
                  : 'border-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="aspect-[3/2] w-full bg-slate-950">{preview}</div>
              <div className="p-3">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-200">
                  {isActive && (
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[9px] text-white">
                      ✓
                    </span>
                  )}
                  {label}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">{description}</p>
              </div>
            </button>
          )
        })}
      </div>

      <AdminFormFooter
        errorMessage={error?.message ?? null}
        saveSuccessMessage={saveSuccess}
        isSaving={viewState === 'saving'}
        isBusy={isBusy}
      />
    </form>
  )
}
