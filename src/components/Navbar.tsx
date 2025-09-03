"use client"

import Link from 'next/link'
import { SearchOutlined, UserOutlined, FileTextOutlined, LogoutOutlined } from '@ant-design/icons'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Avatar, Dropdown, type MenuProps } from 'antd'
import { useRouter } from 'next/navigation'

const SearchModal = dynamic(() => import('./SearchModal'), { ssr: false })
import { useAuthStore } from '@/stores/auth.store'

export default function Navbar() {
  const user = useAuthStore((s) => s.user)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const isAdmin = user?.role === 'admin'
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const dropdownItems: MenuProps['items'] = [
    {
      key: 'create',
      label: (
        <Link href="/admin/articles">
          发表文章
        </Link>
      ),
      icon: <FileTextOutlined />
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      label: '登出',
      danger: true,
      icon: <LogoutOutlined />
    }
  ]

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10 shadow-sm" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="container-app flex items-center justify-between py-2">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200">
            不死川梨华的小站
          </Link>
          {/* 左侧不再显示菜单 */}
        </div>

        <div className="flex items-center gap-2">
          {/* 登录/后台/头像 下拉 */}
          {!user && (
            <Link className="nav-link" href="/auth/login">登录</Link>
          )}
          {user && isAdmin && (
            <Link className="nav-link" href="/admin">后台</Link>
          )}
          {user && (
            <Dropdown 
              menu={{ 
                items: dropdownItems, 
                onClick: ({ key }) => {
                  if (key === 'logout') {
                    clearAuth()
                    router.push('/')
                  }
                }
              }}
              trigger={["click"]}
            >
              <button className="nav-link flex items-center gap-2">
                <Avatar size={28} src={user?.avatarUrl} icon={<UserOutlined />} />
                <span className="hidden sm:inline">{user?.nickname || user?.username}</span>
              </button>
            </Dropdown>
          )}

          {/* 搜索 */}
          <button className="nav-link flex items-center gap-1" onClick={() => setOpen(true)}>
            <SearchOutlined />
          </button>
          <SearchModal open={open} onClose={() => setOpen(false)} />
        </div>
      </div>
    </header>
  )
}


