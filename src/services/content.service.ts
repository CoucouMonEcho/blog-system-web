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

export async function getArticleList(params: { page: number; page_size: number }) {
  const res = await http.get<ApiResponse<ArticleList>>('/api/content/article/list', { params })
  return res.data.data
}

export async function searchArticles(params: { q: string; page: number; page_size: number }) {
  const res = await http.get<ApiResponse<ArticleList>>('/api/content/article/search', { params })
  return res.data.data
}

export type CategoryNode = { id: number; name: string; children: CategoryNode[] }
export async function getCategoryTree() {
  const res = await http.get<ApiResponse<CategoryNode[]>>('/api/content/category/tree')
  return res.data.data
}


