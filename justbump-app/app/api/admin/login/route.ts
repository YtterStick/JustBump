import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '../../../../lib/prisma';
import { signToken } from '../../../../lib/auth';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password_hash: true,
                role: true,
                is_active: true,
                failed_attempts: true,
                lockout_until: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        if (!user.is_active) {
            return NextResponse.json({ error: 'Account is deactivated' }, { status: 403 });
        }

        if (user.lockout_until && new Date(user.lockout_until) > new Date()) {
            return NextResponse.json(
                { error: 'Account is temporarily locked. Please try again later.' },
                { status: 423 }
            );
        }

        if (user.role.toString() !== 'Admin') {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        const passwordValid = await bcrypt.compare(password, user.password_hash);

        if (!passwordValid) {
            const newAttempts = user.failed_attempts + 1;
            const lockout = newAttempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    failed_attempts: newAttempts,
                    lockout_until: lockout,
                },
            });

            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                failed_attempts: 0,
                lockout_until: null,
                last_login: new Date(),
            },
        });

        const token = await signToken({ userId: user.id, email: user.email, role: user.role });
        const maxAge = 7 * 24 * 60 * 60;
        const cookie = `token=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;

        const res = NextResponse.json({
            token,
            user: { id: user.id, email: user.email, role: user.role },
        });
        res.headers.append('Set-Cookie', cookie);
        return res;
    } catch (err) {
        console.error('Admin login error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
