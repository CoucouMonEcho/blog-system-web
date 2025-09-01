import './globals.css'
import type { Metadata } from 'next'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import Providers from '@/providers/Providers'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: '不死川梨华的小站',
  description: '分享一些有趣的东西'
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
              <Navbar />
              
              <main className="flex-grow py-8">
                {children}
              </main>
              
              <footer className="bg-white border-t border-slate-200 py-8">
                <div className="container-app text-center">
                  <div className="text-slate-500 text-sm">© {new Date().getFullYear()} 不死川梨华的小站</div>
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


