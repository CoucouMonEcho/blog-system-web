"use client"

import { Table } from 'antd'

export default function AdminCommentsPage() {
  const data = [
    { id: 'c1', postId: '1', author: 'Alice', content: '写得很棒！' },
    { id: 'c2', postId: '2', author: 'Bob', content: '期待下一篇' }
  ]

  return (
    <section className="space-y-2">
      <h2 className="text-xl font-semibold">评论管理</h2>
      <Table
        rowKey="id"
        dataSource={data}
        columns={[
          { title: 'ID', dataIndex: 'id' },
          { title: '文章ID', dataIndex: 'postId' },
          { title: '作者', dataIndex: 'author' },
          { title: '内容', dataIndex: 'content' }
        ]}
        pagination={false}
      />
    </section>
  )
}


