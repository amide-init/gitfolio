import { useCallback, useEffect, useState } from 'react'
import { getPosts, updatePosts } from '../../api/github'
import type { Post } from '../../types/contentTypes'

function generateId(): string {
  return crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function nowISO(): string {
  return new Date().toISOString()
}

export function usePostsStore(token: string | null) {
  const [items, setItems] = useState<Post[]>([])
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
      const { items: data, sha: fileSha } = await getPosts(token)
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
    async (updatedItems: Post[]) => {
      if (!token) return
      setSaving(true)
      setError(null)
      setSuccess(null)
      try {
        const { items: saved, sha: newSha } = await updatePosts(
          token,
          updatedItems,
          sha,
        )
        setItems(saved)
        setSha(newSha)
        setSuccess('Posts saved. Site will rebuild.')
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
    const newPost: Post = {
      id: generateId(),
      title: '',
      content: '',
      createdAt: now,
      updatedAt: now,
    }
    setItems((prev) => [...prev, newPost])
  }, [])

  const update = useCallback(
    (id: string, updates: Partial<Omit<Post, 'id' | 'createdAt'>>) => {
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
