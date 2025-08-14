export type User = {
  id: number
  username: string
  nickname?: string
  avatarUrl?: string
}

export type LoginRequest = {
  username: string
  password: string
}

export type LoginResponse = {
  token: string
  user: User
}


