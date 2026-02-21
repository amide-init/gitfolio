import { useCallback, useEffect, useState } from 'react'
import { getBlogs, updateBlogs } from '../../api/github'
import type { Blog } from '../../types/contentTypes'

function generateId(): string {
  return crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function nowISO(): string {
  return new Date().toISOString()
}

export function useBlogsStore(token: string | null) {
  const [items, setItems] = useState<Blog[]>([])
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
      const { items: data, sha: fileSha } = await getBlogs(token)
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
    async (updatedItems: Blog[]) => {
      if (!token) return
      setSaving(true)
      setError(null)
      setSuccess(null)
      try {
        const { items: saved, sha: newSha } = await updateBlogs(
          token,
          updatedItems,
          sha,
        )
        setItems(saved)
        setSha(newSha)
        setSuccess('Blogs saved. Site will rebuild.')
      } catch (err) {
        setError(String(err))
      } finally {
        setSaving(false)
      }
    },
    [token, sha],
  )

  const add = useCallback(() => {
    const now = nowISO()
    const newBlog: Blog = {
      id: generateId(),
      title: '',
      content: '',
      createdAt: now,
      updatedAt: now,
    }
    setItems((prev) => [...prev, newBlog])
  }, [])

  const update = useCallback(
    (id: string, updates: Partial<Omit<Blog, 'id' | 'createdAt'>>) => {
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
    remove,
    persist,
    reload: load,
  }
}
