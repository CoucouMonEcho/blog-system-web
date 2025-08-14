"use client"

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { getArticleList, searchArticles } from '@/services/content.service'
import { Input, Pagination } from 'antd'
import { useState } from 'react'

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

  return (
    <div className="space-y-4">
      <h2 className="section-title">文章列表</h2>
      <div className="flex gap-2">
        <Input.Search
          placeholder="搜索关键字"
          allowClear
          onSearch={() => refetch()}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          loading={isLoading}
        />
      </div>
      <ul className="card divide-y">
        {(data?.list || []).map((p) => (
          <li key={p.id} className="py-3">
            <Link className="text-blue-600 underline" href={`/posts/${p.id}`}>
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex justify-end card">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={data?.total || 0}
          onChange={(cp, ps) => {
            setPage(cp)
            setPageSize(ps)
          }}
          showSizeChanger
        />
      </div>
    </div>
  )
}


