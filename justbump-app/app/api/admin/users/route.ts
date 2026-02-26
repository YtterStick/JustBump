import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { verifyAdminToken } from '../../../../lib/auth';

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
            }
        });

        return NextResponse.json(users);
    } catch (error: any) {
        console.error('[API Users] Error:', error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
