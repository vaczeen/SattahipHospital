import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Check if the request is for the employee section
    if (request.nextUrl.pathname.startsWith('/employee')) {
        const token = request.cookies.get('auth_token')?.value

        // If no token exists, redirect to login page
        // if (!token) {
        //     return NextResponse.redirect(new URL('/employee/login', request.url))
        // }
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/employee/:path*',
}
