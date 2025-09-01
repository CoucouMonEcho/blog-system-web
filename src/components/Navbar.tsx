"use client"

import Link from 'next/link'
import { SearchOutlined } from '@ant-design/icons'
import { useState } from 'react'
import dynamic from 'next/dynamic'

const SearchModal = dynamic(() => import('./SearchModal'), { ssr: false })
import { useAuthStore } from '@/stores/auth.store'

export default function Navbar() {
  const user = useAuthStore((s) => s.user)
  const isAdmin = user?.role === 'admin'
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div className="container-app flex items-center justify-between py-2">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200">
            不死川梨华的小站
          </Link>
          {/* 左侧不再显示菜单 */}
        </div>

        <div className="flex items-center gap-2">
          {/* 登录移动到搜索图标的左边：先放登录/后台，再放搜索 */}
          {!user && (
            <Link className="nav-link" href="/auth/login">登录</Link>
          )}
          {isAdmin && (
            <Link className="nav-link" href="/admin">后台</Link>
          )}
          <button className="nav-link flex items-center gap-1" onClick={() => setOpen(true)}>
            <SearchOutlined />
          </button>
          <SearchModal open={open} onClose={() => setOpen(false)} />
        </div>
      </div>
    </header>
  )
}


