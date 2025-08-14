import { getArticle } from '@/services/content.service'

type PostDetailPageProps = {
  params: { id: string }
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const article = await getArticle(Number(params.id))
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-semibold">{article?.title || '文章详情'}</h2>
      <article className="prose whitespace-pre-wrap">
        {article?.content || '暂无内容'}
      </article>
    </main>
  )
}


