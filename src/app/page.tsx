"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { getArticleList } from '@/services/content.service'
import { FileTextOutlined } from '@ant-design/icons'
import { formatTimeAgo } from '@/lib/time'

const STATIC_CATEGORIES: Array<{ name: string; count: number }> = [
  { name: 'LeetCode', count: 59 },
  { name: '分享', count: 5 },
  { name: '生活', count: 17 },
  { name: '编程', count: 34 },
  { name: '阅读', count: 4 }
]

const STATIC_TAGS: Array<{ name: string; count: number }> = [
  { name: '12306', count: 1 },
  { name: 'AI', count: 1 },
  { name: 'API', count: 1 },
  { name: 'Go', count: 67 },
  { name: 'Golang', count: 2 },
  { name: 'LeetCode', count: 60 },
  { name: 'PHP', count: 12 },
  { name: 'RSS', count: 1 }
]

export default function HomePage() {
  const { data } = useQuery({
    queryKey: ['home-articles'],
    queryFn: () => getArticleList({ page: 1, page_size: 10 })
  })

  return (
    <div className="container-app">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-6 lg:max-w-xs">
          {/* Profile Card */}
          <div className="card">
            <div className="flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-100">
                <Image src={'https://avatars.githubusercontent.com/u/82883693'} width={112} height={112} alt="avatar" />
              </div>
              <h2 className="text-3xl font-semibold mt-4">不死川梨华</h2>
              <p className="text-slate-600 mt-1">coucoumonecho</p>
              <div className="flex justify-center gap-8 mt-6">
                <div className="text-center">
                  <div className="muted">文章</div>
                  <div className="text-3xl font-semibold">11</div>
                </div>
                <div className="text-center">
                  <div className="muted">分类</div>
                  <div className="text-3xl font-semibold">5</div>
                </div>
                <div className="text-center">
                  <div className="muted">标签</div>
                  <div className="text-3xl font-semibold">74</div>
                </div>
              </div>
              <Link
                href="https://github.com/CoucouMonEcho"
                className="btn-primary mt-6 px-8"
                target="_blank"
              >
                关注我
              </Link>
            </div>
          </div>

          {/* Categories Card */}
          <div className="card">
            <div className="font-semibold text-lg mb-4">分类</div>
            <div className="space-y-3">
              {STATIC_CATEGORIES.map((c) => (
                <div key={c.name} className="flex items-center justify-between">
                  <span className="text-slate-700">{c.name}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700">{c.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags Card */}
          <div className="card">
            <div className="font-semibold text-lg mb-4">标签</div>
            <div className="flex flex-wrap gap-2">
              {STATIC_TAGS.map((t) => (
                <span key={t.name} className="inline-flex items-center gap-1 bg-blue-500 text-white px-2.5 py-1 rounded-full text-xs">
                  {t.name}
                  <span className="bg-white/90 text-slate-700 rounded-md px-1">{t.count}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: article list */}
        <div className="lg:col-span-2 space-y-4">
          {(data?.list || []).map((article) => (
            <article key={article.id} className="card-hover group">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                    <FileTextOutlined className="text-3xl text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/posts/${article.id}`} className="block group-hover:text-blue-600 transition-colors duration-200">
                    <h3 className="text-xl font-semibold text-slate-800 mb-2 line-clamp-2 group-hover:text-blue-600">
                      {article.title}
                    </h3>
                  </Link>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mb-2">
                    {article.category && <span className="badge">{article.category}</span>}
                    <span>{formatTimeAgo(article.created_at)}</span>
                  </div>
                  {article.summary ? (
                    <p className="text-slate-600 line-clamp-2">{article.summary}</p>
                  ) : (
                    <p className="text-slate-600 line-clamp-2">{article.content?.slice(0, 120) || ''}</p>
                  )}
                </div>
              </div>
            </article>
          ))}
          <div className="text-right text-slate-600">
            <Link href="/posts" className="nav-link">查看更多</Link>
          </div>
        </div>
      </div>
    </div>
  )
}


