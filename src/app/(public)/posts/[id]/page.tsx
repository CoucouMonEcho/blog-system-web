import { getArticle } from '@/services/content.service'

type PostDetailPageProps = {
  params: { id: string }
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const article = await getArticle(Number(params.id))
  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-2xl font-semibold">{article?.title || '文章详情'}</h2>
        <article className="prose whitespace-pre-wrap mt-3">
          {article?.content || '暂无内容'}
        </article>
      </div>
    </div>
  )
}


