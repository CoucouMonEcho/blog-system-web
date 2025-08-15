"use client"

import { useAuthStore } from '@/stores/auth.store'
import { getUserInfo } from '@/services/user.service'
import { useQuery } from '@tanstack/react-query'
import { UserOutlined, MailOutlined, IdcardOutlined, CalendarOutlined } from '@ant-design/icons'
import { Spin, Card, Avatar, Button } from 'antd'

export default function ProfilePage() {
  const userId = useAuthStore((s) => s.userId)
  const idNum = Number(userId)
  const { data, isLoading, error } = useQuery({
    queryKey: ['user-info', idNum],
    queryFn: () => getUserInfo(idNum),
    enabled: !!idNum
  })

  if (!userId) {
    return (
      <div className="container-app">
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserOutlined className="text-4xl text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-2">请先登录</h2>
          <p className="text-slate-600 mb-6">您需要登录后才能查看个人中心</p>
          <Button type="primary" size="large" href="/auth/login">
            立即登录
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container-app max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">个人中心</h1>
        <p className="text-lg text-slate-600">管理您的个人信息和账户设置</p>
      </div>

      {/* Profile Card */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar Section */}
          <div className="text-center md:text-left">
            <Avatar 
              size={120} 
              icon={<UserOutlined />} 
              className="bg-blue-100 text-blue-600 border-4 border-blue-200"
            />
            <div className="mt-4">
              <Button type="primary" size="small" className="bg-blue-500 hover:bg-blue-600 border-0">
                更换头像
              </Button>
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-6">
            {isLoading ? (
              <div className="text-center py-8">
                <Spin size="large" />
                <p className="text-slate-500 mt-4">正在加载用户信息...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserOutlined className="text-2xl text-red-500" />
                </div>
                <p className="text-red-600">加载用户信息失败</p>
                <Button 
                  type="primary" 
                  size="small" 
                  className="mt-2 bg-blue-500 hover:bg-blue-600 border-0"
                  onClick={() => window.location.reload()}
                >
                  重试
                </Button>
              </div>
            ) : data ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <IdcardOutlined className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">用户ID</p>
                        <p className="font-medium text-slate-800">{userId}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <UserOutlined className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">用户名</p>
                        <p className="font-medium text-slate-800">{data.username}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {data.email && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <MailOutlined className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">邮箱地址</p>
                          <p className="font-medium text-slate-800">{data.email}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CalendarOutlined className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">注册时间</p>
                        <p className="font-medium text-slate-800">
                          {data.created_at 
                            ? new Date(data.created_at).toLocaleDateString('zh-CN')
                            : '未知'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
                  <Button type="primary" className="bg-blue-500 hover:bg-blue-600 border-0">
                    编辑资料
                  </Button>
                  <Button className="border-slate-300 text-slate-700 hover:bg-slate-50">
                    修改密码
                  </Button>
                  <Button className="border-slate-300 text-slate-700 hover:bg-slate-50">
                    账户设置
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            我的文章
          </h3>
          <p className="text-slate-600 mb-4">查看和管理您发布的文章</p>
          <Button type="primary" className="bg-blue-500 hover:bg-blue-600 border-0">
            查看文章
          </Button>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            我的收藏
          </h3>
          <p className="text-slate-600 mb-4">查看您收藏的文章和内容</p>
          <Button type="primary" className="bg-blue-500 hover:bg-blue-600 border-0">
            查看收藏
          </Button>
        </div>
      </div>
    </div>
  )
}


