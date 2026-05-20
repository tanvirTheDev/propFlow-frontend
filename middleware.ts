import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  email: string;
  role: 'SUPER_ADMIN' | 'LANDLORD' | 'TENANT';
  orgId: string;
  exp: number;
}

const ROLE_ROUTES: Record<string, string[]> = {
  '/landlord': ['LANDLORD'],
  '/admin': ['SUPER_ADMIN'],
  '/tenant': ['TENANT'],
};

const AUTH_ROUTES = ['/login', '/register', '/forgot-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const protectedPrefix = Object.keys(ROLE_ROUTES).find((prefix) =>
    pathname.startsWith(prefix),
  );

  const token = request.cookies.get('propflow-token')?.value ?? null;

  if (!token) {
    if (protectedPrefix) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      if (protectedPrefix) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('propflow-token');
        return response;
      }
      return NextResponse.next();
    }

    // Redirect authed users away from auth routes
    if (isAuthRoute) {
      const dashboard =
        decoded.role === 'SUPER_ADMIN'
          ? '/admin/dashboard'
          : decoded.role === 'LANDLORD'
            ? '/landlord/dashboard'
            : '/tenant/dashboard';
      return NextResponse.redirect(new URL(dashboard, request.url));
    }

    // Check role access
    if (protectedPrefix) {
      const allowedRoles = ROLE_ROUTES[protectedPrefix];
      if (!allowedRoles.includes(decoded.role)) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }

    return NextResponse.next();
  } catch {
    if (protectedPrefix) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/landlord/:path*', '/tenant/:path*', '/admin/:path*', '/login', '/register', '/invite/:path*', '/forgot-password'],
};
