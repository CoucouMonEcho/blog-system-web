"use client"

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { getArticleList, searchArticles } from '@/services/content.service'
import { Input, Pagination, Spin, Empty } from 'antd'
import { useState } from 'react'
import { SearchOutlined, FileTextOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons'

export default function PostsPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [q, setQ] = useState('')

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['articles', q, page, pageSize],
    queryFn: async () => {
      if (q.trim()) return searchArticles({ q, page, page_size: pageSize })
      return getArticleList({ page, page_size: pageSize })
    }
  })

  const handleSearch = () => {
    setPage(1)
    refetch()
  }

  return (
    <div className="container-app space-y-6">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">文章列表</h1>
        <p className="text-lg text-slate-600">发现精彩内容，探索知识世界</p>
      </div>

      {/* Search Bar */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <Input.Search
              size="large"
              placeholder="搜索文章标题、内容或关键词..."
              allowClear
              onSearch={handleSearch}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              loading={isLoading}
              prefix={<SearchOutlined className="text-slate-400" />}
              className="max-w-lg"
            />
          </div>
          <div className="text-sm text-slate-500">
            共找到 {data?.total || 0} 篇文章
          </div>
        </div>
      </div>

      {/* Articles List */}
      {isLoading ? (
        <div className="card text-center py-12">
          <Spin size="large" />
          <p className="text-slate-500 mt-4">正在加载文章...</p>
        </div>
      ) : data?.list && data.list.length > 0 ? (
        <div className="space-y-4">
          {data.list.map((article) => (
            <article key={article.id} className="card-hover group">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                    <FileTextOutlined className="text-2xl text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <Link 
                    href={`/posts/${article.id}`}
                    className="block group-hover:text-blue-600 transition-colors duration-200"
                  >
                    <h3 className="text-xl font-semibold text-slate-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                      {article.title}
                    </h3>
                  </Link>
                  
                  {article.summary && (
                    <p className="text-slate-600 mb-3 line-clamp-2">
                      {article.summary}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <UserOutlined className="text-slate-400" />
                      <span>{article.author || '未知作者'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarOutlined className="text-slate-400" />
                      <span>{article.created_at ? new Date(article.created_at).toLocaleDateString('zh-CN') : '未知时间'}</span>
                    </div>
                    {article.category && (
                      <span className="badge">{article.category}</span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <Empty 
            description={
              <div className="space-y-2">
                <p className="text-slate-600">暂无文章</p>
                {q && <p className="text-sm text-slate-500">没有找到与 &quot;{q}&quot; 相关的文章</p>}
              </div>
            }
          />
        </div>
      )}

      {/* Pagination */}
      {data?.total && data.total > pageSize && (
        <div className="card">
          <div className="flex justify-center">
            <Pagination
              current={page}
              pageSize={pageSize}
              total={data.total}
              onChange={(cp, ps) => {
                setPage(cp)
                setPageSize(ps)
              }}
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
              pageSizeOptions={['10', '20', '50']}
            />
          </div>
        </div>
      )}
    </div>
  )
}


