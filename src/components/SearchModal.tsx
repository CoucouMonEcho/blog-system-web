"use client"

import { Modal, Input, Empty, Spin } from 'antd'
import { useState } from 'react'
import { searchArticles } from '@/services/content.service'
import Link from 'next/link'

type Props = {
  open: boolean
  onClose: () => void
}

export default function SearchModal({ open, onClose }: Props) {
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<{ id: number; title: string }[]>([])

  async function handleSearch(value?: string) {
    const keyword = (value ?? q).trim()
    if (!keyword) {
      setList([])
      return
    }
    setLoading(true)
    try {
      const res = await searchArticles({ q: keyword, page: 1, page_size: 10 })
      setList(res.list.map((i) => ({ id: i.id, title: i.title })))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="搜索文章" destroyOnClose>
      <div className="space-y-4">
        <Input.Search
          placeholder="输入关键词，按回车搜索"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onSearch={handleSearch}
          loading={loading}
        />
        {loading ? (
          <div className="py-12 text-center"><Spin /></div>
        ) : list.length === 0 ? (
          <Empty description="暂无结果" />
        ) : (
          <div className="space-y-2">
            {list.map((it) => (
              <div key={it.id} className="card-hover">
                <Link href={`/posts/${it.id}`}>{it.title}</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  )
}


