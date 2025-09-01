import { NextRequest, NextResponse } from 'next/server'

// 路由保护：仅拦截后台管理路径，检查 access_token Cookie
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isProtected = pathname.startsWith('/admin')
  if (!isProtected) return NextResponse.next()

  const token = req.cookies.get('access_token')?.value
  if (token) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = '/auth/login'
  url.searchParams.set('next', pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/admin/:path*']
}


