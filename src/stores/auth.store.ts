"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'
import type { User } from '@/types/user'

type AuthState = {
  accessToken: string | null
  user: User | null
  setAuth: (token: string, user: User) => void
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
      user: null,
      setAuth: (token, user) => {
        Cookies.set('access_token', token, { sameSite: 'lax' })
        set({ accessToken: token, user })
      },
      clearAuth: () => {
        Cookies.remove('access_token')
        set({ accessToken: null, user: null })
      }
    }),
    { name: 'blog-auth' }
  )
)


