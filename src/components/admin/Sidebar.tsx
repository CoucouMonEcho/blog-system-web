"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/admin', label: '仪表盘' },
  { href: '/admin/users', label: '用户管理' },
  { href: '/admin/articles', label: '文章管理' },
  { href: '/admin/categories', label: '分类管理' },
  { href: '/', label: '返回前台' }
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sidebar border-r bg-slate-50">
      <h2 className="sidebar-title">管理后台</h2>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isDashboard = item.href === '/admin'
          const isActive = isDashboard ? (pathname === '/admin' || pathname === '/admin/') : pathname?.startsWith(item.href)
          return (
            <Link key={item.href} className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`} href={item.href}>
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}


