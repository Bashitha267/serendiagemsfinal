import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-prod';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        // fetch user
        const { data: admin, error } = await supabase
            .from('admins')
            .select('*')
            .eq('username', username)
            .single();

        if (error || !admin) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // verify password
        const isValid = await bcrypt.compare(password, admin.password_hash);

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Create JWT
        const token = await new SignJWT({ username: admin.username, role: 'admin' })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(new TextEncoder().encode(JWT_SECRET));

        // Create response
        const response = NextResponse.json({ success: true });

        // Set cookie
        response.cookies.set('admin_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 // 24 hours
        });

        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
