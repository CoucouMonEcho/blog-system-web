"use client"

import { Table, Button } from 'antd'
import Link from 'next/link'

export default function AdminPostsPage() {
  // 演示数据：后续接入内容服务
  const data = [
    { id: '1', title: 'Hello DDD', status: 'PUBLISHED' },
    { id: '2', title: 'Go + Next 实战', status: 'DRAFT' }
  ]

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">文章管理</h2>
        <Link href="/admin/posts/new">
          <Button type="primary">新建文章</Button>
        </Link>
      </div>
      <Table
        rowKey="id"
        dataSource={data}
        columns={[
          { title: 'ID', dataIndex: 'id' },
          { title: '标题', dataIndex: 'title' },
          { title: '状态', dataIndex: 'status' },
          {
            title: '操作',
            render: (_, r) => (
              <div className="flex gap-2">
                <Link href={`/admin/posts/${r.id}`} className="text-blue-600">
                  编辑
                </Link>
              </div>
            )
          }
        ]}
        pagination={false}
      />
    </section>
  )
}


