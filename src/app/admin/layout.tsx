"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const navItems = [
    { href: '/admin', label: '仪表盘' },
    { href: '/admin/users', label: '用户管理' },
    { href: '/admin/articles', label: '文章管理' },
    { href: '/admin/categories', label: '分类管理' },
    { href: '/', label: '返回前台' }
  ]

  return (
    <div className="min-h-screen grid grid-cols-[220px_1fr]">
      <aside className="sidebar border-r bg-slate-50">
        <h2 className="sidebar-title">管理后台</h2>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
            return (
              <Link
                key={item.href}
                className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
                href={item.href}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>
      <main className="p-6">{children}</main>
    </div>
  )
}


