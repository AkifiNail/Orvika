export type Team = {
    id: string
    name: string
    slug: string
    createdAt: Date
    logo?: string | null
    metadata?: any
     membership?: {
    role: "owner" | "admin" | "member"
  }
}

