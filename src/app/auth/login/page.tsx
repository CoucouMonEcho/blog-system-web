"use client"

import { Suspense, useState } from 'react'
import { Button, Form, Input, Typography, App } from 'antd'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/stores/auth.store'
import { login } from '@/services/user.service'
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons'

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
      // 登录接口返回 token + user
      setAuth(result.token, result.user)
      message.success('登录成功')
      router.replace(next)
    } catch (error) {
      message.error('登录失败，请检查用户名和密码')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-app">
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LoginOutlined className="text-3xl text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">欢迎回来</h1>
            <p className="text-slate-600">请登录您的账户以继续</p>
          </div>

          {/* Login Form */}
          <div className="card">
            <Form 
              layout="vertical" 
              onFinish={onFinish}
              size="large"
              autoComplete="off"
            >
              <Form.Item 
                name="username" 
                label="用户名" 
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input 
                  placeholder="请输入用户名" 
                  prefix={<UserOutlined className="text-slate-400" />}
                  className="h-12"
                />
              </Form.Item>
              
              <Form.Item 
                name="password" 
                label="密码" 
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password 
                  placeholder="请输入密码" 
                  prefix={<LockOutlined className="text-slate-400" />}
                  className="h-12"
                />
              </Form.Item>
              
              <Form.Item className="mb-6">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  loading={loading}
                  className="h-12 bg-blue-500 hover:bg-blue-600 border-0 text-base font-medium shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {loading ? '登录中...' : '登录'}
                </Button>
              </Form.Item>
            </Form>

            {/* Additional Links */}
            <div className="text-center pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-500 mb-2">
                还没有账户？
              </p>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-colors duration-200">
                立即注册
              </button>
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center mt-6">
            <p className="text-xs text-slate-400">
              登录即表示您同意我们的服务条款和隐私政策
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}


