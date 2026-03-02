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

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';
        const skip = (page - 1) * limit;

        const whereClause: any = {
            deleted_at: null,
            OR: search ? [
                { full_name: { contains: search } },
                { slug: { contains: search } },
                { user: { email: { contains: search } } }
            ] : undefined
        };

        const [total, cards] = await Promise.all([
            prisma.callingCard.count({ where: whereClause }),
            prisma.callingCard.findMany({
                where: whereClause,
                include: {
                    user: {
                        select: {
                            email: true
                        }
                    },
                    bank_details: true,
                    social_links: true,
                    video_links: true,
                    external_links: true
                },
                orderBy: { id: 'asc' },
                skip,
                take: limit,
            })
        ]);

        return NextResponse.json({
            data: cards,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error: any) {
        console.error('[API Calling Cards] Error:', error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
