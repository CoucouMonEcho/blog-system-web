import { http, ApiResponse } from '@/lib/http'

export type Article = {
  id: number
  title: string
  content?: string
}

export type ArticleList = {
  list: Array<Pick<Article, 'id' | 'title'>>
  total: number
  page: number
  page_size: number
}

export async function getArticle(articleId: number) {
  const res = await http.get<ApiResponse<Article>>(`/api/article/${articleId}`)
  return res.data.data
}

export async function getArticleList(params: { page: number; page_size: number }) {
  const res = await http.get<ApiResponse<ArticleList>>('/api/article/list', { params })
  return res.data.data
}

export async function searchArticles(params: { q: string; page: number; page_size: number }) {
  const res = await http.get<ApiResponse<ArticleList>>('/api/article/search', { params })
  return res.data.data
}

export type CategoryNode = { id: number; name: string; children: CategoryNode[] }
export async function getCategoryTree() {
  const res = await http.get<ApiResponse<CategoryNode[]>>('/api/category/tree')
  return res.data.data
}


