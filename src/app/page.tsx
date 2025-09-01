"use client"

import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getArticleList, getCategories, getTags } from '@/services/content.service'
import { FileTextOutlined } from '@ant-design/icons'
import { Pagination } from 'antd'
import { formatTimeAgo } from '@/lib/time'

// 分类与标签在客户端实时获取，展示准确计数

export default function HomePage() {
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const [categoryId, setCategoryId] = React.useState<number | undefined>(undefined)
  const [tagIds, setTagIds] = React.useState<number[]>([])

  const { data, isLoading } = useQuery({
    queryKey: ['home-articles', page, pageSize, categoryId, tagIds],
    queryFn: () => getArticleList({ page, page_size: pageSize, category_id: categoryId, tag_ids: tagIds })
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  })

  const { data: tags } = useQuery({
    queryKey: ['tags'],
    queryFn: getTags
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
            <div className="space-y-2">
              {(categories || []).map((c) => {
                const active = categoryId === c.id
                return (
                  <button
                    key={c.id}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border ${active ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-slate-200 hover:bg-slate-50'}`}
                    onClick={() => { setPage(1); setCategoryId(active ? undefined : c.id) }}
                  >
                    <span>{c.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${active ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>{c.count ?? '-'}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tags Card */}
          <div className="card">
            <div className="font-semibold text-lg mb-4">标签</div>
            <div className="flex flex-wrap gap-2">
              {(tags || []).map((t) => {
                const active = tagIds.includes(t.id)
                return (
                  <button
                    key={t.id}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border ${active ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                    onClick={() => { setPage(1); setTagIds((ids) => active ? ids.filter((id) => id !== t.id) : [...ids, t.id]) }}
                  >
                    {t.name}
                    <span className={`rounded-md px-1 ${active ? 'bg-white/90 text-slate-700' : 'bg-slate-100 text-slate-700'}`}>{t.count ?? '-'}</span>
                  </button>
                )
              })}
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
          <div className="card">
            <div className="flex justify-center">
              <Pagination
                current={page}
                pageSize={pageSize}
                total={data?.total || 0}
                showSizeChanger
                showQuickJumper
                onChange={(cp, ps) => { setPage(cp); setPageSize(ps) }}
                showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
                pageSizeOptions={['10','20','50']}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


