export type User = {
  id: number
  username: string
  email?: string
  nickname?: string
  avatarUrl?: string
  created_at?: string
  role?: 'user' | 'admin'
}

export type LoginRequest = {
  username: string
  password: string
}

export type LoginResponse = {
  token: string
  user: User
}


