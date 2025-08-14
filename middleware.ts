import { NextRequest, NextResponse } from 'next/server'

/**
 * 路由保护：拦截需要登录的路由（/admin 与 /profile），检查 access_token Cookie
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isProtected = pathname.startsWith('/admin') || pathname.startsWith('/profile')
  if (!isProtected) return NextResponse.next()

  const token = req.cookies.get('access_token')?.value
  if (token) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = '/auth/login'
  url.searchParams.set('next', pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/admin/:path*', '/profile']
}


