"use client"

import { useAuthStore } from '@/stores/auth.store'

export default function ProfilePage() {
  const userId = useAuthStore((s) => s.userId)
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-2">
      <h2 className="text-2xl font-semibold">个人中心</h2>
      <p className="text-gray-600">用户ID：{userId || '-'}</p>
    </main>
  )
}


