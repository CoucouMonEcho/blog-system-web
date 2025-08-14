"use client"

import { useState } from 'react'
import { Button, Form, Input, Select, Typography } from 'antd'
import { useRouter } from 'next/navigation'

type Props = { params: { id: string } }

export default function AdminPostEditPage({ params }: Props) {
  const router = useRouter()
  const isNew = params.id === 'new'
  const [loading, setLoading] = useState(false)

  async function onFinish(values: { title: string; content: string; status: string }) {
    setLoading(true)
    try {
      // TODO: 调用内容服务创建/更新文章
      router.push('/admin/posts')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="space-y-4">
      <Typography.Title level={3}>{isNew ? '新建文章' : `编辑文章 #${params.id}`}</Typography.Title>
      <Form layout="vertical" onFinish={onFinish} className="max-w-2xl">
        <Form.Item name="title" label="标题" rules={[{ required: true }]}>
          <Input placeholder="请输入标题" />
        </Form.Item>
        <Form.Item name="content" label="内容" rules={[{ required: true }]}>
          <Input.TextArea placeholder="支持 Markdown（后续接入编辑器）" rows={10} />
        </Form.Item>
        <Form.Item name="status" label="状态" initialValue="DRAFT">
          <Select
            options={[
              { value: 'DRAFT', label: '草稿' },
              { value: 'PUBLISHED', label: '已发布' }
            ]}
          />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          保存
        </Button>
      </Form>
    </section>
  )
}


