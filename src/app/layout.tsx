import './globals.css'
import type { Metadata } from 'next'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import Providers from '@/providers/Providers'

export const metadata: Metadata = {
  title: 'Blog System',
  description: 'Personal blog system frontend (public + admin)'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-white text-slate-900">
        <AntdRegistry>
          <Providers>
            <header className="border-b border-gray-200 sticky top-0 bg-white/90 backdrop-blur z-10">
              <div className="container-app flex items-center justify-between py-3">
                <div className="font-semibold text-lg">Blog System</div>
                <nav className="flex gap-4 text-sm">
                  <a className="nav-link" href="/">首页</a>
                  <a className="nav-link" href="/posts">文章</a>
                  <a className="nav-link" href="/auth/login">登录</a>
                  <a className="nav-link" href="/admin">后台</a>
                </nav>
              </div>
            </header>
            <main className="container-app">{children}</main>
            <footer className="border-t border-gray-200">
              <div className="container-app text-center text-sm text-slate-500">
                © {new Date().getFullYear()} Blog System
              </div>
            </footer>
          </Providers>
        </AntdRegistry>
      </body>
    </html>
  )
}


