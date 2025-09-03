import { getArticle } from '@/services/content.service'
import { notFound } from 'next/navigation'
import { CalendarOutlined, UserOutlined, FolderOutlined, EyeOutlined, FileTextOutlined } from '@ant-design/icons'
import { safeString } from '@/lib/sanitize'

interface ArticlePageProps {
  params: {
    id: string
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  try {
    const article = await getArticle(parseInt(params.id))
    
    if (!article) {
      notFound()
    }

    return (
      <div className="container-app max-w-4xl">
        {/* Article Header */}
        <article className="card mb-8">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-4 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap justify-center items-center gap-6 text-slate-600 mb-6">
              <div className="flex items-center gap-2">
                <UserOutlined className="text-blue-500" />
                <span className="font-medium">{safeString(article.author) || '未知作者'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <CalendarOutlined className="text-blue-500" />
                <span>
                  {safeString(article.created_at) 
                    ? new Date(safeString(article.created_at) as string).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : '未知时间'
                  }
                </span>
              </div>
              
              {safeString(article.category) && (
                <div className="flex items-center gap-2">
                  <FolderOutlined className="text-blue-500" />
                  <span className="badge">{safeString(article.category)}</span>
                </div>
              )}
              
              {typeof article.view_count !== 'undefined' && article.view_count !== null && (
                <div className="flex items-center gap-2">
                  <EyeOutlined className="text-blue-500" />
                  <span>{article.view_count} 次阅读</span>
                </div>
              )}
            </div>
            
            {safeString(article.summary) && (
              <div className="max-w-2xl mx-auto">
                <p className="text-lg text-slate-600 leading-relaxed italic border-l-4 border-blue-200 pl-4">
                  {safeString(article.summary)}
                </p>
              </div>
            )}
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            {safeString(article.content) ? (
              <div 
                className="text-slate-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: safeString(article.content) as string }}
              />
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileTextOutlined className="text-4xl text-blue-600" />
                </div>
                <p className="text-slate-500 text-lg">文章内容正在加载中...</p>
              </div>
            )}
          </div>
        </article>

        {/* Article Footer */}
        <div className="card text-center">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <div className="text-slate-600">
              <span className="font-medium">喜欢这篇文章？</span>
              <p className="text-sm text-slate-500 mt-1">分享给更多朋友</p>
            </div>
            
            <div className="flex gap-2">
              <button className="btn-secondary">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
                分享
              </button>
              
              <button className="btn-primary">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                收藏
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Failed to fetch article:', error)
    notFound()
  }
}


