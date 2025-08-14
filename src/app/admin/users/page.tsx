"use client"

import { useEffect, useMemo, useState } from 'react'
import { Button, Form, Input, Modal, Table, App, Space, Pagination } from 'antd'
import { createAdminUser, deleteAdminUser, getAdminUsers, updateAdminUser } from '@/services/admin.service'

export default function AdminUsersPage() {
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
      const res = await getAdminUsers({ page, page_size: pageSize })
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
        <h2 className="text-xl font-semibold">用户管理</h2>
        <Button type="primary" onClick={() => setCreateVisible(true)}>
          新增用户
        </Button>
      </div>

      <div className="card">
        <Table
        rowKey="id"
        loading={loading}
        dataSource={dataSource}
        columns={[
          { title: 'ID', dataIndex: 'id', width: 80 },
          { title: '用户名', dataIndex: 'username' },
          { title: '邮箱', dataIndex: 'email' },
          { title: '角色', dataIndex: 'role' },
          {
            title: '操作',
            width: 220,
            render: (_: any, record: any) => (
              <Space>
                <Button
                  onClick={() => setEditRecord(record)}
                  size="small"
                >
                  编辑
                </Button>
                <Button
                  danger
                  size="small"
                  onClick={async () => {
                    await deleteAdminUser(record.id)
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

      <Modal
        title="新增用户"
        open={createVisible}
        onCancel={() => setCreateVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          onFinish={async (values) => {
            await createAdminUser(values as any)
            message.success('新增成功')
            setCreateVisible(false)
            fetchList()
          }}
        >
          <Form.Item name="username" label="用户名" rules={[{ required: true }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="role" label="角色" rules={[{ required: true }]}>
            <Input placeholder="admin 或 user" />
          </Form.Item>
          <Form.Item name="avatar" label="头像地址">
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            提交
          </Button>
        </Form>
      </Modal>

      <Modal
        title="编辑用户"
        open={!!editRecord}
        onCancel={() => setEditRecord(null)}
        footer={null}
        destroyOnClose
      >
        {editRecord && (
          <Form
            layout="vertical"
            initialValues={editRecord}
            onFinish={async (values) => {
              await updateAdminUser(editRecord.id, values as any)
              message.success('更新成功')
              setEditRecord(null)
              fetchList()
            }}
          >
            <Form.Item name="email" label="邮箱">
              <Input />
            </Form.Item>
            <Form.Item name="role" label="角色">
              <Input />
            </Form.Item>
            <Form.Item name="avatar" label="头像地址">
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


