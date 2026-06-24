import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'devphoenix2025';
const COOKIE_NAME = 'dp-admin-auth';
const SALT = process.env.JWT_SECRET || 'devphoenix-salt-2025';

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Handle explicit /admin/login attempts and redirect to the correct page
  if (pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin-login', req.url));
  }

  // Protect all /admin/* routes except /admin-login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin-login')) {
    const authCookie = req.cookies.get(COOKIE_NAME);
    const expectedHash = await sha256(ADMIN_PASSWORD + SALT);
    if (!authCookie || authCookie.value !== expectedHash) {
      const loginUrl = new URL('/admin-login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
