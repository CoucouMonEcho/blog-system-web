"use client"

import { Suspense, useState } from 'react'
import { Button, Form, Input, Typography, App } from 'antd'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/stores/auth.store'
import { login } from '@/services/user.service'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/'
  const { message } = App.useApp()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [loading, setLoading] = useState(false)

  async function onFinish(values: { username: string; password: string }) {
    setLoading(true)
    try {
      const result = await login(values)
      setAuth(result.token, String(result.user.id))
      message.success('登录成功')
      router.replace(next)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex justify-center items-center min-h-[60vh] p-6">
      <div className="w-full max-w-sm border rounded-md p-6 shadow-sm">
        <Typography.Title level={3}>登录</Typography.Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
            <Input placeholder="输入用户名" autoComplete="username" />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true }]}>
            <Input.Password placeholder="输入密码" autoComplete="current-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            登录
          </Button>
        </Form>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}


