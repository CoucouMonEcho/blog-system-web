"use client"

import { useState } from 'react'
import { Button, Form, Input, Table, App, Typography } from 'antd'
import { adminLogin, getAdminUsers } from '@/services/admin.service'

export default function AdminDashboardPage() {
  const { message } = App.useApp()
  const [token, setToken] = useState<string | null>(null)
  const [users, setUsers] = useState<any[]>([])

  async function onAdminLogin(values: { username: string; password: string }) {
    const res = await adminLogin(values)
    setToken(res.token)
    message.success('Admin 登录成功')
  }

  async function fetchUsers() {
    const data = await getAdminUsers({ page: 1, page_size: 10 })
    setUsers(data.list)
  }

  return (
    <section className="space-y-4">
      <div className="card">
        <Typography.Title level={3} style={{ margin: 0 }}>管理后台</Typography.Title>
      </div>

      {!token && (
        <Form className="card" layout="inline" onFinish={onAdminLogin} style={{ gap: 8 }}>
          <Form.Item name="username" rules={[{ required: true }]}>
            <Input placeholder="admin" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true }]}>
            <Input.Password placeholder="secret" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            管理员登录
          </Button>
        </Form>
      )}

      <div className="card flex gap-2">
        <Button onClick={fetchUsers} disabled={!token}>
          加载用户列表
        </Button>
      </div>

      <div className="card">
        <Table
        rowKey="id"
        dataSource={users}
        columns={[
          { title: 'ID', dataIndex: 'id' },
          { title: '用户名', dataIndex: 'username' },
          { title: '邮箱', dataIndex: 'email' },
          { title: '角色', dataIndex: 'role' }
        ]}
        pagination={false}
        />
      </div>
    </section>
  )
}


