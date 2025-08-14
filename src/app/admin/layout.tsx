import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get('access_token')?.value
  if (!token) {
    redirect('/auth/login?next=/admin')
  }

  return (
    <div className="min-h-screen grid grid-cols-[220px_1fr]">
      <Sidebar />
      <main className="p-6">{children}</main>
    </div>
  )
}


