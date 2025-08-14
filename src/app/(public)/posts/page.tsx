import Link from 'next/link'

export default function PostsPage() {
  // 演示列表页：后续将接入内容服务
  const demo = [
    { id: '1', title: 'Hello DDD', summary: '为什么选择领域驱动设计' },
    { id: '2', title: 'Go + Next 实战', summary: '前后端协作与网关对接' }
  ]

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-semibold">文章列表</h2>
      <ul className="divide-y">
        {demo.map((p) => (
          <li key={p.id} className="py-3">
            <Link className="text-blue-600 underline" href={`/posts/${p.id}`}>
              {p.title}
            </Link>
            <p className="text-gray-600 text-sm">{p.summary}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}


