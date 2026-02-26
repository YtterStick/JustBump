import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from './lib/auth';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    console.log(`[Middleware] Checking path: ${pathname}`);

    if (pathname.startsWith('/api/') || pathname.includes('_next')) {
        return NextResponse.next();
    }

    if (pathname === '/admin/login' || pathname === '/login') {
        const token = request.cookies.get('token')?.value;
        if (token) {
            const decoded = await verifyAdminToken(token);
            if (decoded) {
                console.log(`[Middleware] Already logged in as ${decoded.role}, redirecting to dashboard`);
                return NextResponse.redirect(new URL(decoded.role === 'Admin' ? '/admin' : '/', request.url));
            }
        }
        return NextResponse.next();
    }

    if (pathname === '/admin' || pathname.startsWith('/admin/')) {
        const token = request.cookies.get('token')?.value;
        console.log(`[Middleware] Admin route detected. Token present: ${!!token}`);

        if (!token) {
            console.log('[Middleware] No token found, redirecting to /admin/login');
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        const decoded = await verifyAdminToken(token);
        console.log(`[Middleware] Token verification result: ${decoded ? 'SUCCESS' : 'FAILED'}`);

        if (!decoded) {
            console.log('[Middleware] Invalid token, clearing cookie and redirecting');
            const response = NextResponse.redirect(new URL('/admin/login', request.url));
            response.cookies.set('token', '', { maxAge: 0 });
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin', '/admin/:path*'],
};
