"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'

type AuthState = {
  accessToken: string | null
  userId: string | null
  setAuth: (token: string, userId: string) => void
  clearAuth: () => void
}

/**
 * 轻量级登录态存储：
 * - 将 token 同步到 Cookie（便于中间件与 SSR 检查）
 * - 将 token 备份到 localStorage（客户端可快速初始化）
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      userId: null,
      setAuth: (token, userId) => {
        Cookies.set('access_token', token, { sameSite: 'lax' })
        set({ accessToken: token, userId })
      },
      clearAuth: () => {
        Cookies.remove('access_token')
        set({ accessToken: null, userId: null })
      }
    }),
    { name: 'blog-auth' }
  )
)


