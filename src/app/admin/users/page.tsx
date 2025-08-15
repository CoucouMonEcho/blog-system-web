"use client"

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Space, 
  Popconfirm, 
  message, 
  Card,
  Typography,
  Tag,
  Avatar,
  Tooltip
} from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UserOutlined,
  MailOutlined,
  IdcardOutlined
} from '@ant-design/icons'
import { 
  getAdminUsers, 
  createAdminUser, 
  updateAdminUser, 
  deleteAdminUser 
} from '@/services/admin.service'

const { Title } = Typography

interface UserFormData {
  username: string
  email?: string
  nickname?: string
  password?: string
  role?: string
  avatar?: string
}

export default function AdminUsersPage() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => getAdminUsers({ page: 1, page_size: 100 })
  })

  const createMutation = useMutation({
    mutationFn: (payload: UserFormData) => 
      createAdminUser({
        username: payload.username,
        email: payload.email || '',
        password: payload.password || 'default123',
        role: payload.role || 'user',
        avatar: payload.avatar
      }),
    onSuccess: () => {
      message.success('用户创建成功')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setIsModalVisible(false)
      form.resetFields()
    },
    onError: () => {
      message.error('用户创建失败')
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, ...payload }: { id: number } & UserFormData) => 
      updateAdminUser(id, payload),
    onSuccess: () => {
      message.success('用户更新成功')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setIsModalVisible(false)
      setEditingUser(null)
      form.resetFields()
    },
    onError: () => {
      message.error('用户更新失败')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAdminUser,
    onSuccess: () => {
      message.success('用户删除成功')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: () => {
      message.error('用户删除失败')
    }
  })

  const handleCreate = () => {
    setEditingUser(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (user: any) => {
    setEditingUser(user)
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      nickname: user.nickname
    })
    setIsModalVisible(true)
  }

  const handleDelete = (userId: number) => {
    deleteMutation.mutate(userId)
  }

  const handleSubmit = async (values: UserFormData) => {
    if (editingUser) {
      await updateMutation.mutateAsync({ id: editingUser.id, ...values })
    } else {
      await createMutation.mutateAsync(values)
    }
  }

  const columns = [
    {
      title: '用户信息',
      key: 'user',
      render: (user: any) => (
        <div className="flex items-center gap-3">
          <Avatar 
            size={40} 
            icon={<UserOutlined />} 
            className="bg-blue-100 text-blue-600"
          />
          <div>
            <div className="font-medium text-slate-800">{user.username}</div>
            {user.nickname && (
              <div className="text-sm text-slate-500">{user.nickname}</div>
            )}
          </div>
        </div>
      )
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => (
        email ? (
          <div className="flex items-center gap-2">
            <MailOutlined className="text-slate-400" />
            <span className="text-slate-700">{email}</span>
          </div>
        ) : (
          <span className="text-slate-400">未设置</span>
        )
      )
    },
    {
      title: '用户ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: number) => (
        <div className="flex items-center gap-2">
          <IdcardOutlined className="text-slate-400" />
          <Tag color="blue" className="font-mono">{id}</Tag>
        </div>
      )
    },
    {
      title: '状态',
      key: 'status',
      render: () => (
        <Tag color="green" className="bg-green-50 text-green-700 border-green-200">
          正常
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'actions',
      render: (user: any) => (
        <Space size="small">
          <Tooltip title="编辑用户">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(user)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            />
          </Tooltip>
          <Tooltip title="删除用户">
            <Popconfirm
              title="确定要删除这个用户吗？"
              description="此操作不可逆，请谨慎操作"
              onConfirm={() => handleDelete(user.id)}
              okText="确定"
              cancelText="取消"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Title level={2} style={{ margin: 0, color: '#1e293b' }}>
            用户管理
          </Title>
          <p className="text-slate-600 text-lg">管理系统用户账户和权限</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          size="large"
          className="bg-blue-500 hover:bg-blue-600 border-0 shadow-sm hover:shadow-md transition-all duration-200"
        >
          新增用户
        </Button>
      </div>

      {/* Users Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={users?.list || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            total: users?.total || 0,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            pageSizeOptions: ['10', '20', '50']
          }}
          className="custom-table"
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserOutlined className="text-blue-600" />
            </div>
            <span>{editingUser ? '编辑用户' : '新增用户'}</span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          setEditingUser(null)
          form.resetFields()
        }}
        footer={null}
        width={500}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 2, message: '用户名至少2个字符' }
            ]}
          >
            <Input 
              placeholder="请输入用户名" 
              prefix={<UserOutlined className="text-slate-400" />}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱地址"
            rules={[
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input 
              placeholder="请输入邮箱地址" 
              prefix={<MailOutlined className="text-slate-400" />}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="nickname"
            label="昵称"
          >
            <Input 
              placeholder="请输入昵称" 
              prefix={<UserOutlined className="text-slate-400" />}
              size="large"
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end gap-3">
              <Button 
                onClick={() => {
                  setIsModalVisible(false)
                  setEditingUser(null)
                  form.resetFields()
                }}
              >
                取消
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createMutation.isPending || updateMutation.isPending}
                className="bg-blue-500 hover:bg-blue-600 border-0"
              >
                {editingUser ? '更新' : '创建'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}


