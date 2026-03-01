/** Base timestamp fields for all content items */
export type Timestamped = {
  createdAt: string // ISO 8601
  updatedAt: string // ISO 8601
}

export type ProjectLink = {
  label: string
  url: string
}

export type Project = Timestamped & {
  id: string
  title: string
  description: string
  links: ProjectLink[]
}

export type Blog = Timestamped & {
  id: string
  title: string
  content: string
  contentJSON?: any
}

export type Post = Timestamped & {
  id: string
  title: string
  content: string
}

/** Video (YouTube only for now). title, videoUrl, thumbnail from noembed. */
export type Video = Timestamped & {
  id: string
  title: string
  videoUrl: string
  thumbnail?: string
}
