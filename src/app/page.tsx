import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold">欢迎来到 Blog System</h1>
        <p className="text-gray-600">前台（读者）与后台（管理）合一的前端项目脚手架。</p>
      </section>
      <nav className="flex gap-4">
        <Link className="text-blue-600 underline" href="/posts">文章列表</Link>
        <Link className="text-blue-600 underline" href="/auth/login">登录</Link>
        <Link className="text-blue-600 underline" href="/admin">管理后台</Link>
      </nav>
    </main>
  )
}


