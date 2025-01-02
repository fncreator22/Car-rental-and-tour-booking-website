import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
//import { verifyToken } from './lib/jwt.[backend]'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  // Check if the route requires authentication
  const authRoutes = ['/dashboard', '/bookings', '/profile']
  const isAuthRoute = authRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  if (isAuthRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    /*const decodedToken = verifyToken(token)
    if (!decodedToken) {
      return NextResponse.redirect(new URL('/login', request.url))
    }*/
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/bookings/:path*', '/profile/:path*'],
}

