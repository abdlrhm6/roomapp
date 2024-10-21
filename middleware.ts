import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'


export async function middleware(request: NextRequest,) {
  const token = request.cookies.get('token')?.value

    if (!token) {
      
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      
      const secret = new TextEncoder().encode(process.env.JWT_SECRET)
      

      const { payload } = await jwtVerify(token, secret);
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', payload.userId as string )
    
      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
      return response

    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

}


export const config = {
  matcher: [
    '/profile/:path*',
    '/api/users/edit/:path*',
    '/api/users/me/:path*',
    '/api/rooms/add/:path*',
    '/api/rooms/delete/:path*',
    '/api/rooms/leave/:path*',
    '/api/rooms/my-rooms/:path*',
    "/api/notifications/:path*",
    "/api/requests/:path*",
    "/api/messages/:path*"
  ],
}