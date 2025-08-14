type PostDetailPageProps = {
  params: { id: string }
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-semibold">文章详情（演示）</h2>
      <p className="text-gray-600">文章 ID：{params.id}</p>
      <article className="prose">
        <p>这里将展示从内容服务获取的 Markdown/富文本渲染结果。</p>
      </article>
    </main>
  )
}


