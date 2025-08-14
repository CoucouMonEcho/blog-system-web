import { http, ApiResponse } from '@/lib/http'

export async function incrStat(params: { type: string; target_id: number; target_type: string; user_id?: number }) {
  const res = await http.post<ApiResponse<null>>('/api/stat/incr', null, { params })
  return res.data.data
}

export async function getStat(params: { type: string; target_id: number; target_type: string; user_id?: number }) {
  const res = await http.get<ApiResponse<{ value: number }>>('/api/stat/get', { params })
  return res.data.data
}


