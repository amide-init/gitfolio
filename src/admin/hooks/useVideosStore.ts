import { useCallback, useEffect, useState } from 'react'
import { getVideos, updateVideos } from '../../api/github'
import type { Video } from '../../types/contentTypes'

/** Normalize legacy youtubeUrl to videoUrl so old data/videos.json still works. */
function normalizeVideo(raw: Record<string, unknown>): Video {
  const video = raw as Partial<Video> & { youtubeUrl?: string }
  return {
    id: video.id ?? '',
    title: video.title ?? '',
    videoUrl: video.videoUrl ?? video.youtubeUrl ?? '',
    thumbnail: video.thumbnail,
    createdAt: video.createdAt ?? new Date().toISOString(),
    updatedAt: video.updatedAt ?? new Date().toISOString(),
  }
}

function generateId(): string {
  return crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function nowISO(): string {
  return new Date().toISOString()
}

export function useVideosStore(token: string | null) {
  const [items, setItems] = useState<Video[]>([])
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
      const { items: data, sha: fileSha } = await getVideos(token)
      setItems(Array.isArray(data) ? data.map((d) => normalizeVideo(d as Record<string, unknown>)) : [])
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
    async (updatedItems: Video[]) => {
      if (!token) return
      setSaving(true)
      setError(null)
      setSuccess(null)
      try {
        const { items: saved, sha: newSha } = await updateVideos(
          token,
          updatedItems,
          sha,
        )
        setItems(saved)
        setSha(newSha)
        setSuccess('Videos saved. Site will rebuild.')
      } catch (err) {
        setError(String(err))
      } finally {
        setSaving(false)
      }
    },
    [token, sha],
  )

  const add = useCallback(() => {
    const newVideo: Video = {
      id: generateId(),
      title: '',
      videoUrl: '',
      createdAt: nowISO(),
      updatedAt: nowISO(),
    }
    setItems((prev) => [...prev, newVideo])
  }, [])

  const addItem = useCallback((data: { title: string; videoUrl: string; thumbnail?: string }) => {
    setItems((prev) => [...prev, {
      id: generateId(),
      title: data.title,
      videoUrl: data.videoUrl,
      thumbnail: data.thumbnail,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    }])
  }, [])

  const update = useCallback(
    (id: string, updates: Partial<Omit<Video, 'id' | 'createdAt'>>) => {
      setItems((prev) =>
        prev.map((v) =>
          v.id === id
            ? {
                ...v,
                ...updates,
                updatedAt: nowISO(),
              }
            : v,
        ),
      )
    },
    [],
  )

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((v) => v.id !== id))
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
    addItem,
    update,
    remove,
    persist,
    reload: load,
  }
}
