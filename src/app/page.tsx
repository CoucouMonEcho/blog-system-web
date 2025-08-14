import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="card space-y-2">
        <h1 className="text-3xl font-bold">欢迎来到 Blog System</h1>
        <p className="muted">前台（读者）与后台（管理）合一的前端项目脚手架。</p>
      </section>
      <nav className="card flex gap-6 text-sm">
        <Link className="nav-link" href="/posts">文章列表</Link>
        <Link className="nav-link" href="/auth/login">登录</Link>
        <Link className="nav-link" href="/admin">管理后台</Link>
      </nav>
    </div>
  )
}


