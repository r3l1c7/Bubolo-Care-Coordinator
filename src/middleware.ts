// Relative Path: src\middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Allow /api/check-password to pass through without authentication
  if (request.nextUrl.pathname === '/api/check-password') {
    return NextResponse.next()
  }

  const authHeader = request.headers.get('X-App-Password')

  if (authHeader === process.env.APP_PASSWORD) {
    return NextResponse.next()
  }

  return new NextResponse('Authentication required', { status: 401 })
}

export const config = {
  matcher: '/api/:path*',
}