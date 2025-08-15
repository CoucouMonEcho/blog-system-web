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
  Tooltip,
  InputNumber
} from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  FolderOutlined,
  SortAscendingOutlined,
  FileTextOutlined
} from '@ant-design/icons'
import { 
  getAdminCategories, 
  createAdminCategory, 
  updateAdminCategory, 
  deleteAdminCategory 
} from '@/services/admin.service'

const { Title } = Typography
const { TextArea } = Input

interface CategoryFormData {
  name: string
  description?: string
  sort_order?: number
  parent_id?: number
}

export default function AdminCategoriesPage() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => getAdminCategories({ page: 1, page_size: 100 })
  })

  const createMutation = useMutation({
    mutationFn: createAdminCategory,
    onSuccess: () => {
      message.success('分类创建成功')
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      setIsModalVisible(false)
      form.resetFields()
    },
    onError: () => {
      message.error('分类创建失败')
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, ...payload }: { id: number } & CategoryFormData) => 
      updateAdminCategory(id, payload),
    onSuccess: () => {
      message.success('分类更新成功')
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      setIsModalVisible(false)
      setEditingCategory(null)
      form.resetFields()
    },
    onError: () => {
      message.error('分类更新失败')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAdminCategory,
    onSuccess: () => {
      message.success('分类删除成功')
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
    },
    onError: () => {
      message.error('分类删除失败')
    }
  })

  const handleCreate = () => {
    setEditingCategory(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (category: any) => {
    setEditingCategory(category)
    form.setFieldsValue({
      name: category.name,
      description: category.description,
      sort_order: category.sort_order,
      parent_id: category.parent_id
    })
    setIsModalVisible(true)
  }

  const handleDelete = (categoryId: number) => {
    deleteMutation.mutate(categoryId)
  }

  const handleSubmit = async (values: CategoryFormData) => {
    if (editingCategory) {
      await updateMutation.mutateAsync({ id: editingCategory.id, ...values })
    } else {
      await createMutation.mutateAsync(values)
    }
  }

  const columns = [
    {
      title: '分类信息',
      key: 'category',
      render: (category: any) => (
        <div className="flex items-center gap-3">
          <Avatar 
            size={40} 
            icon={<FolderOutlined />} 
            className="bg-blue-100 text-blue-600"
          />
          <div className="min-w-0 flex-1">
            <div className="font-medium text-slate-800">{category.name}</div>
            {category.description && (
              <div className="text-sm text-slate-500 truncate">{category.description}</div>
            )}
          </div>
        </div>
      )
    },
    {
      title: '排序',
      dataIndex: 'sort_order',
      key: 'sort_order',
      render: (sortOrder: number) => (
        <div className="flex items-center gap-2">
          <SortAscendingOutlined className="text-slate-400" />
          <Tag color="blue" className="bg-blue-50 text-blue-700 border-blue-200">
            {sortOrder || 0}
          </Tag>
        </div>
      )
    },
    {
      title: '文章数量',
      key: 'article_count',
      render: (category: any) => (
        <div className="flex items-center gap-2">
          <FileTextOutlined className="text-slate-400" />
          <span className="text-slate-700">{category.article_count || 0}</span>
        </div>
      )
    },
    {
      title: '父分类',
      dataIndex: 'parent_id',
      key: 'parent_id',
      render: (parentId: number) => (
        parentId ? (
          <Tag color="green" className="bg-green-50 text-green-700 border-green-200">
            ID: {parentId}
          </Tag>
        ) : (
          <span className="text-slate-400">顶级分类</span>
        )
      )
    },
    {
      title: '状态',
      key: 'status',
      render: () => (
        <Tag color="green" className="bg-green-50 text-green-700 border-green-200">
          启用
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'actions',
      render: (category: any) => (
        <Space size="small">
          <Tooltip title="编辑分类">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(category)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            />
          </Tooltip>
          <Tooltip title="删除分类">
            <Popconfirm
              title="确定要删除这个分类吗？"
              description="此操作不可逆，请谨慎操作"
              onConfirm={() => handleDelete(category.id)}
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
            分类管理
          </Title>
          <p className="text-slate-600 text-lg">创建和管理文章分类体系</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          size="large"
          className="bg-blue-500 hover:bg-blue-600 border-0 shadow-sm hover:shadow-md transition-all duration-200"
        >
          新增分类
        </Button>
      </div>

      {/* Categories Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={categories?.list || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            total: categories?.total || 0,
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
              <FolderOutlined className="text-blue-600" />
            </div>
            <span>{editingCategory ? '编辑分类' : '新增分类'}</span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          setEditingCategory(null)
          form.resetFields()
        }}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="分类名称"
            rules={[
              { required: true, message: '请输入分类名称' },
              { min: 2, message: '名称至少2个字符' }
            ]}
          >
            <Input 
              placeholder="请输入分类名称" 
              prefix={<FolderOutlined className="text-slate-400" />}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="分类描述"
          >
            <TextArea 
              placeholder="请输入分类描述（可选）" 
              rows={3}
              showCount
              maxLength={200}
            />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="sort_order"
              label="排序权重"
            >
              <InputNumber
                placeholder="请输入排序权重"
                min={0}
                max={999}
                className="w-full"
                addonBefore={<SortAscendingOutlined className="text-slate-400" />}
              />
            </Form.Item>

            <Form.Item
              name="parent_id"
              label="父分类ID"
            >
              <InputNumber
                placeholder="请输入父分类ID"
                min={0}
                className="w-full"
                addonBefore={<FolderOutlined className="text-slate-400" />}
              />
            </Form.Item>
          </div>

          <Form.Item className="mb-0">
            <div className="flex justify-end gap-3">
              <Button 
                onClick={() => {
                  setIsModalVisible(false)
                  setEditingCategory(null)
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
                {editingCategory ? '更新' : '创建'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}


