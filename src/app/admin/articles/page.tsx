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
  Select,
  DatePicker
} from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  FileTextOutlined,
  UserOutlined,
  CalendarOutlined,
  FolderOutlined
} from '@ant-design/icons'
import { 
  getAdminArticles, 
  createAdminArticle, 
  updateAdminArticle, 
  deleteAdminArticle 
} from '@/services/admin.service'

const { Title } = Typography
const { TextArea } = Input
const { Option } = Select

interface ArticleFormData {
  title: string
  content: string
  summary?: string
  author?: string
  category?: string
}

export default function AdminArticlesPage() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingArticle, setEditingArticle] = useState<any>(null)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  const { data: articles, isLoading } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: () => getAdminArticles({ page: 1, page_size: 100 })
  })

  const createMutation = useMutation({
    mutationFn: createAdminArticle,
    onSuccess: () => {
      message.success('文章创建成功')
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] })
      setIsModalVisible(false)
      form.resetFields()
    },
    onError: () => {
      message.error('文章创建失败')
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, ...payload }: { id: number } & ArticleFormData) => 
      updateAdminArticle(id, payload),
    onSuccess: () => {
      message.success('文章更新成功')
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] })
      setIsModalVisible(false)
      setEditingArticle(null)
      form.resetFields()
    },
    onError: () => {
      message.error('文章更新失败')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAdminArticle,
    onSuccess: () => {
      message.success('文章删除成功')
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] })
    },
    onError: () => {
      message.error('文章删除失败')
    }
  })

  const handleCreate = () => {
    setEditingArticle(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (article: any) => {
    setEditingArticle(article)
    form.setFieldsValue({
      title: article.title,
      content: article.content,
      summary: article.summary,
      author: article.author,
      category: article.category
    })
    setIsModalVisible(true)
  }

  const handleDelete = (articleId: number) => {
    deleteMutation.mutate(articleId)
  }

  const handleSubmit = async (values: ArticleFormData) => {
    if (editingArticle) {
      await updateMutation.mutateAsync({ id: editingArticle.id, ...values })
    } else {
      await createMutation.mutateAsync(values)
    }
  }

  const columns = [
    {
      title: '文章信息',
      key: 'article',
      render: (article: any) => (
        <div className="flex items-center gap-3">
          <Avatar 
            size={40} 
            icon={<FileTextOutlined />} 
            className="bg-blue-100 text-blue-600"
          />
          <div className="min-w-0 flex-1">
            <div className="font-medium text-slate-800 truncate">{article.title}</div>
            {article.summary && (
              <div className="text-sm text-slate-500 truncate">{article.summary}</div>
            )}
          </div>
        </div>
      )
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      render: (author: string) => (
        author ? (
          <div className="flex items-center gap-2">
            <UserOutlined className="text-slate-400" />
            <span className="text-slate-700">{author}</span>
          </div>
        ) : (
          <span className="text-slate-400">未知作者</span>
        )
      )
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        category ? (
          <Tag color="blue" className="bg-blue-50 text-blue-700 border-blue-200">
            {category}
          </Tag>
        ) : (
          <span className="text-slate-400">未分类</span>
        )
      )
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => (
        date ? (
          <div className="flex items-center gap-2">
            <CalendarOutlined className="text-slate-400" />
            <span className="text-slate-700">
              {new Date(date).toLocaleDateString('zh-CN')}
            </span>
          </div>
        ) : (
          <span className="text-slate-400">未知时间</span>
        )
      )
    },
    {
      title: '状态',
      key: 'status',
      render: () => (
        <Tag color="green" className="bg-green-50 text-green-700 border-green-200">
          已发布
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'actions',
      render: (article: any) => (
        <Space size="small">
          <Tooltip title="编辑文章">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(article)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            />
          </Tooltip>
          <Tooltip title="删除文章">
            <Popconfirm
              title="确定要删除这篇文章吗？"
              description="此操作不可逆，请谨慎操作"
              onConfirm={() => handleDelete(article.id)}
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
            文章管理
          </Title>
          <p className="text-slate-600 text-lg">创建、编辑和管理文章</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          size="large"
          className="bg-blue-500 hover:bg-blue-600 border-0 shadow-sm hover:shadow-md transition-all duration-200"
        >
          新增文章
        </Button>
      </div>

      {/* Articles Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={articles?.list || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            total: articles?.total || 0,
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
              <FileTextOutlined className="text-blue-600" />
            </div>
            <span>{editingArticle ? '编辑文章' : '新增文章'}</span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          setEditingArticle(null)
          form.resetFields()
        }}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            name="title"
            label="文章标题"
            rules={[
              { required: true, message: '请输入文章标题' },
              { min: 2, message: '标题至少2个字符' }
            ]}
          >
            <Input 
              placeholder="请输入文章标题" 
              prefix={<FileTextOutlined className="text-slate-400" />}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="summary"
            label="文章摘要"
          >
            <TextArea 
              placeholder="请输入文章摘要（可选）" 
              rows={3}
              showCount
              maxLength={200}
            />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="author"
              label="作者"
            >
              <Input 
                placeholder="请输入作者姓名" 
                prefix={<UserOutlined className="text-slate-400" />}
              />
            </Form.Item>

            <Form.Item
              name="category"
              label="分类"
            >
              <Select
                placeholder="请选择分类"
                allowClear
                showSearch
                optionFilterProp="children"
              >
                <Option value="技术">技术</Option>
                <Option value="生活">生活</Option>
                <Option value="随笔">随笔</Option>
                <Option value="教程">教程</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="content"
            label="文章内容"
            rules={[
              { required: true, message: '请输入文章内容' },
              { min: 10, message: '内容至少10个字符' }
            ]}
          >
            <TextArea 
              placeholder="请输入文章内容" 
              rows={8}
              showCount
              maxLength={10000}
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end gap-3">
              <Button 
                onClick={() => {
                  setIsModalVisible(false)
                  setEditingArticle(null)
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
                {editingArticle ? '更新' : '创建'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}


