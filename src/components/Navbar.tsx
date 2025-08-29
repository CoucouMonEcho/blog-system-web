"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useMemo } from 'react'
import { SearchOutlined } from '@ant-design/icons'
import { useAuthStore } from '@/stores/auth.store'
import { useQuery } from '@tanstack/react-query'
import { getUserInfo } from '@/services/user.service'

export default function Navbar() {
  const userId = useAuthStore((s) => s.userId)
  const idNum = Number(userId)

  const { data: user } = useQuery({
    queryKey: ['navbar-user', idNum],
    queryFn: () => getUserInfo(idNum),
    enabled: !!idNum
  })

  const isAdmin = useMemo(() => user?.role === 'admin', [user])

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div className="container-app flex items-center justify-between py-2">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200">
            不死川梨华的小站
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            <Link className="nav-link" href="/">首页</Link>
            <Link className="nav-link" href="/posts">文章</Link>
            {user ? (
              <Link href="/profile" className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-slate-100">
                <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-200">
                  <Image
                    src={user.avatarUrl || 'https://avatars.githubusercontent.com/u/82883693'}
                    width={28}
                    height={28}
                    alt="avatar"
                  />
                </div>
              </Link>
            ) : (
              <Link className="nav-link" href="/auth/login">登录</Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/posts" className="nav-link flex items-center gap-1">
            <SearchOutlined />
          </Link>
          {isAdmin && (
            <Link className="nav-link" href="/admin">后台</Link>
          )}
        </div>
      </div>
    </header>
  )
}


