"use client"

import { useEffect, useState } from 'react'
import { Button, Form, Input, Modal, Table, App, Space, Pagination } from 'antd'
import { createAdminCategory, deleteAdminCategory, getAdminCategories, updateAdminCategory } from '@/services/admin.service'

export default function AdminCategoriesPage() {
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
      const res = await getAdminCategories({ page, page_size: pageSize })
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
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">分类管理</h2>
        <Button type="primary" onClick={() => setCreateVisible(true)}>
          新增分类
        </Button>
      </div>

      <Table
        rowKey="id"
        loading={loading}
        dataSource={dataSource}
        columns={[
          { title: 'ID', dataIndex: 'id', width: 80 },
          { title: '名称', dataIndex: 'name' },
          { title: 'slug', dataIndex: 'slug' },
          { title: '父级ID', dataIndex: 'parent_id' },
          { title: '排序', dataIndex: 'sort' },
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
                    await deleteAdminCategory(record.id)
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

      <div className="flex justify-end">
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

      <Modal title="新增分类" open={createVisible} onCancel={() => setCreateVisible(false)} footer={null} destroyOnClose>
        <Form
          layout="vertical"
          onFinish={async (values) => {
            await createAdminCategory(values as any)
            message.success('新增成功')
            setCreateVisible(false)
            fetchList()
          }}
        >
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="slug" label="slug">
            <Input />
          </Form.Item>
          <Form.Item name="parent_id" label="父级ID" initialValue={0}>
            <Input />
          </Form.Item>
          <Form.Item name="sort" label="排序" initialValue={10}>
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            提交
          </Button>
        </Form>
      </Modal>

      <Modal title="编辑分类" open={!!editRecord} onCancel={() => setEditRecord(null)} footer={null} destroyOnClose>
        {editRecord && (
          <Form
            layout="vertical"
            initialValues={editRecord}
            onFinish={async (values) => {
              await updateAdminCategory(editRecord.id, values as any)
              message.success('更新成功')
              setEditRecord(null)
              fetchList()
            }}
          >
            <Form.Item name="name" label="名称">
              <Input />
            </Form.Item>
            <Form.Item name="sort" label="排序">
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


