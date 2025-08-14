import { http, ApiResponse } from '@/lib/http'
import type { LoginRequest, LoginResponse, User } from '@/types/user'

export async function login(payload: LoginRequest) {
  const res = await http.post<ApiResponse<LoginResponse>>('/api/user/login', payload)
  return res.data.data
}

export async function getUserInfo(userId: number) {
  const res = await http.get<ApiResponse<User>>(`/api/user/auth/info/${userId}`)
  return res.data.data
}


