import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { getPublicKey } from '@/lib/keys';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next();
  }
  // Require auth token for pages (adjust as needed for a public landing page)
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return NextResponse.redirect(new URL('/?auth=required', request.url));
  }
  try {
    await jwtVerify(token, getPublicKey());
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/?auth=expired', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
