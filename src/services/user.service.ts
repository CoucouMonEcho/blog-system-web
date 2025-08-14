import { http, ApiResponse } from '@/lib/http'
import type { LoginRequest, LoginResponse, User } from '@/types/user'

export async function login(payload: LoginRequest) {
  // API 文档：POST /api/user/login
  const res = await http.post<ApiResponse<LoginResponse>>('/api/user/login', payload)
  return res.data.data
}

export async function getUserInfo(userId: number) {
  // API 文档：GET /api/user/auth/info/:user_id （需鉴权）
  const res = await http.get<ApiResponse<User>>(`/api/user/auth/info/${userId}`)
  return res.data.data
}


