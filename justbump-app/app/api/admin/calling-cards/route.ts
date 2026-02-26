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

        const cards = await prisma.callingCard.findMany({
            where: { deleted_at: null },
            include: {
                user: {
                    select: {
                        email: true
                    }
                }
            },
            orderBy: { created_at: 'desc' },
        });

        return NextResponse.json(cards);
    } catch (error: any) {
        console.error('[API Calling Cards] Error:', error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
