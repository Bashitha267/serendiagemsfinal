import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-prod';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Only protect /admin routes
    if (path.startsWith('/admin')) {
        // Allow login page
        if (path === '/admin/login') {
            return NextResponse.next();
        }

        const token = request.cookies.get('admin_session')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        try {
            await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
            // Token is valid
            return NextResponse.next();
        } catch (err) {
            // Token invalid
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
