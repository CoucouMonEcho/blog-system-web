"use client"

import { useEffect, useState } from 'react'
import { Button, Form, Input, Modal, Table, App, Space, Pagination } from 'antd'
import { createAdminArticle, deleteAdminArticle, getAdminArticles, updateAdminArticle } from '@/services/admin.service'

export default function AdminArticlesPage() {
  const { message } = App.useApp()
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [createVisible, setCreateVisible] = useState(false)
  const [editRecord, setEditRecord] = useState<any | null>(null)

  async function fetchList() {
    setLoading(true)
    try {
      const res = await getAdminArticles({ page, page_size: pageSize })
      setDataSource(res.list || [])
      setTotal(res.total || 0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize])

  return (
    <section className="space-y-4">
      <div className="card flex justify-between items-center">
        <h2 className="text-xl font-semibold">文章管理</h2>
        <Button type="primary" onClick={() => setCreateVisible(true)}>
          新增文章
        </Button>
      </div>

      <div className="card">
        <Table
        rowKey="id"
        loading={loading}
        dataSource={dataSource}
        columns={[
          { title: 'ID', dataIndex: 'id', width: 80 },
          { title: '标题', dataIndex: 'title' },
          { title: '作者ID', dataIndex: 'author_id' },
          { title: '分类ID', dataIndex: 'category_id' },
          {
            title: '操作',
            width: 220,
            render: (_: any, record: any) => (
              <Space>
                <Button onClick={() => setEditRecord(record)} size="small">
                  编辑
                </Button>
                <Button
                  danger
                  size="small"
                  onClick={async () => {
                    await deleteAdminArticle(record.id)
                    message.success('已删除')
                    fetchList()
                  }}
                >
                  删除
                </Button>
              </Space>
            )
          }
        ]}
        pagination={false}
        />
      </div>

      <div className="card flex justify-end">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={total}
          onChange={(cp, ps) => {
            setPage(cp)
            setPageSize(ps)
          }}
          showSizeChanger
        />
      </div>

      <Modal title="新增文章" open={createVisible} onCancel={() => setCreateVisible(false)} footer={null} destroyOnClose>
        <Form
          layout="vertical"
          onFinish={async (values) => {
            await createAdminArticle(values as any)
            message.success('新增成功')
            setCreateVisible(false)
            fetchList()
          }}
        >
          <Form.Item name="title" label="标题" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="slug" label="slug">
            <Input />
          </Form.Item>
          <Form.Item name="content" label="内容">
            <Input.TextArea rows={6} />
          </Form.Item>
          <Form.Item name="summary" label="摘要">
            <Input />
          </Form.Item>
          <Form.Item name="author_id" label="作者ID">
            <Input />
          </Form.Item>
          <Form.Item name="category_id" label="分类ID">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="状态(0/1)">
            <Input />
          </Form.Item>
          <Form.Item name="is_top" label="置顶(true/false)">
            <Input />
          </Form.Item>
          <Form.Item name="is_recommend" label="推荐(true/false)">
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            提交
          </Button>
        </Form>
      </Modal>

      <Modal title="编辑文章" open={!!editRecord} onCancel={() => setEditRecord(null)} footer={null} destroyOnClose>
        {editRecord && (
          <Form
            layout="vertical"
            initialValues={editRecord}
            onFinish={async (values) => {
              await updateAdminArticle(editRecord.id, values as any)
              message.success('更新成功')
              setEditRecord(null)
              fetchList()
            }}
          >
            <Form.Item name="title" label="标题">
              <Input />
            </Form.Item>
            <Form.Item name="category_id" label="分类ID">
              <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              保存
            </Button>
          </Form>
        )}
      </Modal>
    </section>
  )
}


