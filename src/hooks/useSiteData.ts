import { useEffect, useState } from 'react'
import type { Blog, Post, Project, Video } from '../types/contentTypes'

const BASE = import.meta.env.BASE_URL

async function fetchJson<T>(path: string): Promise<T> {
  const url = `${BASE}${path.replace(/^\//, '')}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to load ${path}`)
  return res.json() as Promise<T>
}

type SiteData = {
  videos: Video[]
  blogs: Blog[]
  posts: Post[]
  projects: Project[]
  loading: boolean
  error: string | null
}

export function useSiteData(): SiteData {
  const [videos, setVideos] = useState<Video[]>([])
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all([
      fetchJson<Video[]>('data/videos.json').catch(() => []),
      fetchJson<Blog[]>('data/blogs.json').catch(() => []),
      fetchJson<Post[]>('data/posts.json').catch(() => []),
      fetchJson<Project[]>('data/projects.json').catch(() => []),
    ])
      .then(([v, b, p, pr]) => {
        if (cancelled) return
        setVideos(Array.isArray(v) ? v : [])
        setBlogs(Array.isArray(b) ? b : [])
        setPosts(Array.isArray(p) ? p : [])
        setProjects(Array.isArray(pr) ? pr : [])
      })
      .catch((err) => {
        if (!cancelled) setError(String(err))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { videos, blogs, posts, projects, loading, error }
}
