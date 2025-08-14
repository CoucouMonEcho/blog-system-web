import { http, ApiResponse } from '@/lib/http'

export async function adminLogin(payload: { username: string; password: string }) {
  const res = await http.post<ApiResponse<{ token: string }>>('/api/admin/login', payload)
  return res.data.data
}

export async function getAdminUsers(params: { page: number; page_size: number }) {
  const res = await http.get<ApiResponse<{ list: any[]; total: number }>>('/api/admin/users', { params })
  return res.data.data
}

export async function createAdminUser(payload: { username: string; email: string; password: string; role: string; avatar?: string }) {
  const res = await http.post<ApiResponse<null>>('/api/admin/users', payload)
  return res.data.data
}

export async function updateAdminUser(id: number, payload: Record<string, any>) {
  const res = await http.post<ApiResponse<null>>(`/api/admin/users/update/${id}`, payload)
  return res.data.data
}

export async function deleteAdminUser(id: number) {
  const res = await http.post<ApiResponse<null>>(`/api/admin/users/delete/${id}`)
  return res.data.data
}

export async function getAdminArticles(params: { page: number; page_size: number }) {
  const res = await http.get<ApiResponse<{ list: any[]; total: number }>>('/api/admin/articles', { params })
  return res.data.data
}

export async function createAdminArticle(payload: Record<string, any>) {
  const res = await http.post<ApiResponse<null>>('/api/admin/articles', payload)
  return res.data.data
}

export async function updateAdminArticle(id: number, payload: Record<string, any>) {
  const res = await http.post<ApiResponse<null>>(`/api/admin/articles/update/${id}`, payload)
  return res.data.data
}

export async function deleteAdminArticle(id: number) {
  const res = await http.post<ApiResponse<null>>(`/api/admin/articles/delete/${id}`)
  return res.data.data
}

export async function getAdminCategories(params: { page: number; page_size: number }) {
  const res = await http.get<ApiResponse<{ list: any[]; total: number }>>('/api/admin/categories', { params })
  return res.data.data
}

export async function createAdminCategory(payload: Record<string, any>) {
  const res = await http.post<ApiResponse<null>>('/api/admin/categories', payload)
  return res.data.data
}

export async function updateAdminCategory(id: number, payload: Record<string, any>) {
  const res = await http.post<ApiResponse<null>>(`/api/admin/categories/update/${id}`, payload)
  return res.data.data
}

export async function deleteAdminCategory(id: number) {
  const res = await http.post<ApiResponse<null>>(`/api/admin/categories/delete/${id}`)
  return res.data.data
}


