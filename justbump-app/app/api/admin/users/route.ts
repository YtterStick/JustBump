import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { verifyAdminToken } from '../../../../lib/auth';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { logAdminAction } from '../../../../lib/logger';

export async function GET(req: Request) {
    try {
        const cookieHeader = req.headers.get('cookie') || '';
        const match = cookieHeader.match(/(?:^|; )token=([^;]+)/);
        const token = match ? decodeURIComponent(match[1]) : null;

        if (!token || !(await verifyAdminToken(token))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const users = await prisma.user.findMany({
            where: { deleted_at: null },
            orderBy: { created_at: 'desc' },
            select: {
                id: true,
                email: true,
                role: true,
                is_active: true,
                created_at: true,
                last_login: true,
                calling_card: {
                    select: {
                        id: true,
                        physical_cards: {
                            where: { deleted_at: null, status: 'assigned' },
                            select: { card_id: true, card_uid: true, card_type: true }
                        }
                    }
                }
            }
        });

        return NextResponse.json(users);
    } catch (error: any) {
        console.error('[API Users] Error:', error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
export async function POST(req: Request) {
    try {
        const token = await verifyAdminTokenFromCookie(req);
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { email, password, role } = body;

        if (!email || !password || !role) {
            return NextResponse.json({ error: 'Email, password, and role are required' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const newUser = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email,
                    password_hash,
                    role: role as any, // 'Admin' or 'User'
                    is_active: true,
                    created_by: token.userId,
                }
            });

            // If it's a regular user, create a calling card automatically
            if (role === 'User') {
                const slug = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.random().toString(36).substring(2, 7);
                await tx.callingCard.create({
                    data: {
                        user_id: user.id,
                        full_name: email.split('@')[0], // Default name
                        slug,
                        sharing_id: uuidv4(),
                        created_by: token.userId,
                    }
                });
            }

            return user;
        });

        await logAdminAction(
            token.userId,
            'CREATE_USER',
            'User',
            newUser.id,
            { email: newUser.email, role: newUser.role },
            req
        );

        return NextResponse.json({
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
            message: 'User created successfully'
        }, { status: 201 });

    } catch (error: any) {
        console.error('[API Users POST] Error:', error.message);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

async function verifyAdminTokenFromCookie(req: Request) {
    const cookieHeader = req.headers.get('cookie') || '';
    const match = cookieHeader.match(/(?:^|; )token=([^;]+)/);
    const tokenStr = match ? decodeURIComponent(match[1]) : null;
    if (!tokenStr) return null;
    return await verifyAdminToken(tokenStr);
}
