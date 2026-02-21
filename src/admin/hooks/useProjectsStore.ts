import { useCallback, useEffect, useState } from 'react'
import { getProjects, updateProjects } from '../../api/github'
import type { Project, ProjectLink } from '../../types/contentTypes'

function generateId(): string {
  return crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function nowISO(): string {
  return new Date().toISOString()
}

export function useProjectsStore(token: string | null) {
  const [items, setItems] = useState<Project[]>([])
  const [sha, setSha] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const { items: data, sha: fileSha } = await getProjects(token)
      setItems(data)
      setSha(fileSha)
    } catch (err) {
      setError(String(err))
      setItems([])
      setSha(null)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    void load()
  }, [load])

  const save = useCallback(
    async (updatedItems: Project[]) => {
      if (!token) return
      setSaving(true)
      setError(null)
      setSuccess(null)
      try {
        const { items: saved, sha: newSha } = await updateProjects(
          token,
          updatedItems,
          sha,
        )
        setItems(saved)
        setSha(newSha)
        setSuccess('Projects saved. Site will rebuild.')
      } catch (err) {
        setError(String(err))
      } finally {
        setSaving(false)
      }
    },
    [token, sha],
  )

  const add = useCallback(() => {
    const newProject: Project = {
      id: generateId(),
      title: '',
      description: '',
      links: [],
      createdAt: nowISO(),
      updatedAt: nowISO(),
    }
    setItems((prev) => [...prev, newProject])
  }, [])

  const update = useCallback(
    (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
      setItems((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                ...updates,
                updatedAt: nowISO(),
              }
            : p,
        ),
      )
    },
    [],
  )

  const updateLinks = useCallback((id: string, links: ProjectLink[]) => {
    setItems((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              links,
              updatedAt: nowISO(),
            }
          : p,
      ),
    )
  }, [])

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const persist = useCallback(async () => {
    await save(items)
  }, [items, save])

  return {
    items,
    sha,
    loading,
    saving,
    error,
    success,
    add,
    update,
    updateLinks,
    remove,
    persist,
    reload: load,
  }
}
