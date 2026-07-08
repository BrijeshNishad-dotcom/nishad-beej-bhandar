import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === 'ADMIN';
    const path = req.nextUrl.pathname;

    // Handle root /admin access redirect
    if (path === '/admin') {
      if (isAdmin) {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      } else {
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }
    }

    // Protect all dashboard sub-routes
    if (path.startsWith('/admin/dashboard') && !isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token;
      },
    },
    pages: {
      signIn: '/admin/login',
    },
  }
);

export const config = {
  matcher: ['/admin', '/admin/dashboard/:path*'],
};
