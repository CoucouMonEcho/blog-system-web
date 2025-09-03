"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  DashboardOutlined, 
  UserOutlined, 
  FileTextOutlined, 
  FolderOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { href: '/admin', label: '仪表盘', icon: DashboardOutlined },
    { href: '/admin/users', label: '用户管理', icon: UserOutlined },
    { href: '/admin/articles', label: '文章管理', icon: FileTextOutlined },
    { href: '/admin/categories', label: '分类管理', icon: FolderOutlined },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 min-h-screen">
          <nav className="p-6">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`text-lg ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}


