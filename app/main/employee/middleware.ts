// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/main/employee')) {
    const token = req.cookies.get('employee_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/main', req.url));
    }

    try {
      jwt.verify(token, process.env.SECRET as string);
    } catch {
      return NextResponse.redirect(new URL('/main', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/main/employee/:path*'],
};