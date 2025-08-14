import { http, ApiResponse } from '@/lib/http'
import type { LoginRequest, LoginResponse, User } from '@/types/user'

export async function login(payload: LoginRequest) {
  // API 文档：POST /api/login
  const res = await http.post<ApiResponse<LoginResponse>>('/api/login', payload)
  return res.data.data
}

export async function getUserInfo(userId: number) {
  // API 文档：GET /api/auth/info/:user_id （需鉴权）
  const res = await http.get<ApiResponse<User>>(`/api/auth/info/${userId}`)
  return res.data.data
}


