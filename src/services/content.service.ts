import { http, ApiResponse } from '@/lib/http'

export type Article = {
  id: number
  title: string
  content?: string
  summary?: string
  author?: string
  created_at?: string
  category?: string
  view_count?: number
  tags?: string[]
  cover_url?: string
}

export type ArticleList = {
  list: Array<Article>
  total: number
  page: number
  page_size: number
}

export async function getArticle(articleId: number) {
  const res = await http.get<ApiResponse<Article>>(`/api/content/article/${articleId}`)
  return res.data.data
}

// 统一文章列表接口：分页必填；分类/标签筛选为可选
export async function getArticleList(params: { page: number; page_size: number; category_id?: number; tag_ids?: number[] }) {
  const res = await http.get<ApiResponse<ArticleList>>('/api/content/article/list', { params })
  return res.data.data
}

export async function searchArticles(params: { q: string; page: number; page_size: number }) {
  const res = await http.get<ApiResponse<ArticleList>>('/api/content/article/search', { params })
  return res.data.data
}

export type Category = { id: number; name: string; count?: number }
export async function getCategories() {
  const res = await http.get<ApiResponse<Category[]>>('/api/content/category/list')
  return res.data.data
}

export type Tag = { id: number; name: string; count?: number }
export async function getTags() {
  const res = await http.get<ApiResponse<Tag[]>>('/api/content/tag/list')
  return res.data.data
}


