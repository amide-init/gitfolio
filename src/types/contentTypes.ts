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
}

export type Post = Timestamped & {
  id: string
  title: string
  content: string
}
