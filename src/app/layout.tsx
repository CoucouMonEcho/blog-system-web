import './globals.css'
import type { Metadata } from 'next'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import Providers from '@/providers/Providers'
import Link from 'next/link'

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
      <body className="min-h-screen bg-slate-50 text-slate-800">
        <AntdRegistry>
          <Providers>
            <div className="flex flex-col min-h-screen">
              <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                <div className="container-app flex items-center justify-between py-4">
                  <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200">
                    Blog System
                  </Link>
                  <nav className="flex gap-2">
                    <Link className="nav-link" href="/">首页</Link>
                    <Link className="nav-link" href="/posts">文章</Link>
                    <Link className="nav-link" href="/auth/login">登录</Link>
                    <Link className="nav-link" href="/admin">后台</Link>
                  </nav>
                </div>
              </header>
              
              <main className="flex-grow py-8">
                {children}
              </main>
              
              <footer className="bg-white border-t border-slate-200 py-8">
                <div className="container-app text-center">
                  <div className="text-slate-500 text-sm">
                    © {new Date().getFullYear()} Blog System. All rights reserved.
                  </div>
                  <div className="mt-2 text-xs text-slate-400">
                    Built with Next.js & Tailwind CSS
                  </div>
                </div>
              </footer>
            </div>
          </Providers>
        </AntdRegistry>
      </body>
    </html>
  )
}


