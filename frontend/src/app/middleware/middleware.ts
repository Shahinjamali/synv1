import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { ROLES } from '@/utils/roles';
import { parseDashboardPathDynamic } from '@/utils/path'; // <-- use dynamic parser

const JWT_SECRET = process.env.JWT_SECRET || '';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/login' || pathname === '/403') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const decoded = verify(token, JWT_SECRET) as {
        id: string;
        roles: string[];
        roleType: 'owner' | 'customer';
      };

      const { roleType } = decoded;

      const parsed = parseDashboardPathDynamic(pathname);

      if (!parsed) {
        return NextResponse.redirect(new URL('/403', request.url));
      }

      const { roleType: pathRoleType, role: pathRole } = parsed;

      const isOwnerPath = pathname.startsWith('/dashboard/owner');
      const isCustomerPath = pathname.startsWith('/dashboard/customer');

      if (
        (isOwnerPath && roleType !== 'owner') ||
        (isCustomerPath && roleType !== 'customer')
      ) {
        return NextResponse.redirect(new URL('/403', request.url));
      }

      if (!ROLES[pathRoleType]?.[pathRole]) {
        return NextResponse.redirect(new URL('/403', request.url));
      }

      return NextResponse.next();
    } catch (error) {
      console.error('[Middleware] Invalid token:', error);
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/403'],
};
