"use client"

import { ReactNode, useState } from 'react'
import { ConfigProvider, App as AntdApp, theme as antdTheme } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

type ProvidersProps = {
  children: ReactNode
}

/**
 * 应用级 Provider 组合：
 * - Ant Design 主题与全局反馈组件
 * - React Query 客户端（用于数据请求、缓存与请求状态）
 */
export default function Providers({ children }: ProvidersProps) {
  // 使用 useState 确保 QueryClient 只在客户端初始化一次
  const [queryClient] = useState(() => new QueryClient())

  return (
    <ConfigProvider theme={{ algorithm: antdTheme.defaultAlgorithm }}>
      <AntdApp>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </AntdApp>
    </ConfigProvider>
  )
}


