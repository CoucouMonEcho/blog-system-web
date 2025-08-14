import axios from 'axios'
import Cookies from 'js-cookie'

/**
 * Axios 实例，统一：
 * - 基础地址（默认走网关 8000，可通过环境变量覆盖）
 * - 超时、JSON 解析
 * - 携带鉴权 Token（从 Cookie 读取 access_token）
 * - 统一错误处理（可在业务层进一步细化）
 */
export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  timeout: 15000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json'
  }
})

http.interceptors.request.use((config) => {
  // Attach token only in browser
  if (typeof window !== 'undefined') {
    const token = Cookies.get('access_token')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

http.interceptors.response.use(
  (resp) => resp,
  (error) => {
    // 在这里可以根据后端 errcode 体系做统一转换
    return Promise.reject(error)
  }
)

export type ApiResponse<T> = {
  code: number
  message: string
  data: T
}


