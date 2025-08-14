import { http, ApiResponse } from '@/lib/http'

export async function incrStat(params: { type: string; target_id: number; target_type: string; user_id?: number }) {
  const res = await http.post<ApiResponse<null>>('/api/stat/incr', null, { params })
  return res.data.data
}

export async function getStat(params: { type: string; target_id: number; target_type: string; user_id?: number }) {
  const res = await http.get<ApiResponse<{ value: number }>>('/api/stat/get', { params })
  return res.data.data
}

// 仪表盘统计（建议后端提供以下接口与字段）
export type DashboardOverview = {
  pv_today: number
  uv_today: number
  online_users: number
  article_total: number
  category_total: number
  error_5xx_last_1h?: number
}

export async function getDashboardOverview() {
  const res = await http.get<ApiResponse<DashboardOverview>>('/api/admin/stat/overview')
  return res.data.data
}

export type TimeseriesPoint = { ts: string; value: number }
export async function getPvTimeseries(params: { from: string; to: string; interval: '5m' | '1h' | '1d' }) {
  const res = await http.get<ApiResponse<TimeseriesPoint[]>>('/api/admin/stat/pv_timeseries', { params })
  return res.data.data
}

// 可选扩展接口（前端方法预留，便于后续快速接入）
export async function getErrorRate(params: { from: string; to: string; service?: string }) {
  const res = await http.get<ApiResponse<TimeseriesPoint[]>>('/api/admin/stat/error_rate', { params })
  return res.data.data
}

export type LatencyPercentilePoint = {
  ts: string
  p50?: number
  p90?: number
  p95?: number
  p99?: number
}
export async function getLatencyPercentile(params: { from: string; to: string; service?: string }) {
  const res = await http.get<ApiResponse<LatencyPercentilePoint[]>>('/api/admin/stat/latency_percentile', { params })
  return res.data.data
}

export type TopEndpoint = { endpoint: string; count: number }
export async function getTopEndpoints(params: { from: string; to: string; service?: string }) {
  const res = await http.get<ApiResponse<TopEndpoint[]>>('/api/admin/stat/top_endpoints', { params })
  return res.data.data
}

export async function getActiveUsers(params: { from: string; to: string }) {
  const res = await http.get<ApiResponse<TimeseriesPoint[]>>('/api/admin/stat/active_users', { params })
  return res.data.data
}