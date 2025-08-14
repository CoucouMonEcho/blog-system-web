import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-[220px_1fr]">
      <aside className="border-r p-4 space-y-4">
        <h2 className="font-semibold text-lg">管理后台</h2>
        <nav className="flex flex-col gap-2">
          <Link className="text-blue-600 underline" href="/admin">仪表盘</Link>
          <Link className="text-blue-600 underline" href="/admin/users">用户管理</Link>
          <Link className="text-blue-600 underline" href="/admin/articles">文章管理</Link>
          <Link className="text-blue-600 underline" href="/admin/categories">分类管理</Link>
          <Link className="text-blue-600 underline" href="/">返回前台</Link>
        </nav>
      </aside>
      <main className="p-6">{children}</main>
    </div>
  )
}


