"use client"

import { useAuthStore } from '@/stores/auth.store'
import { getUserInfo } from '@/services/user.service'
import { useQuery } from '@tanstack/react-query'

export default function ProfilePage() {
  const userId = useAuthStore((s) => s.userId)
  const idNum = Number(userId)
  const { data } = useQuery({
    queryKey: ['user-info', idNum],
    queryFn: () => getUserInfo(idNum),
    enabled: !!idNum
  })
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-2">
      <h2 className="text-2xl font-semibold">个人中心</h2>
      <p className="text-gray-600">用户ID：{userId || '-'}</p>
      {data && (
        <div className="text-gray-700">
          <div>用户名：{data.username}</div>
          {data.email && <div>邮箱：{data.email}</div>}
        </div>
      )}
    </main>
  )
}


