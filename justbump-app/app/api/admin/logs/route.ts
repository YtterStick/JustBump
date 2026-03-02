import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { verifyAdminToken } from '../../../../lib/auth';

export async function GET(req: Request) {
    try {
        const cookieHeader = req.headers.get('cookie') || '';
        const match = cookieHeader.match(/(?:^|; )token=([^;]+)/);
        const tokenStr = match ? decodeURIComponent(match[1]) : null;
        if (!tokenStr || !(await verifyAdminToken(tokenStr))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const skip = (page - 1) * limit;

        const search = searchParams.get('search') || '';
        const action = searchParams.get('action') || '';
        const target = searchParams.get('target') || '';

        const where: any = {};

        if (action && action !== 'all') {
            where.action = action;
        }

        if (target && target !== 'all') {
            where.target_type = target;
        }

        if (search) {
            where.OR = [
                { admin: { email: { contains: search } } },
                { action: { contains: search } },
                { target_type: { contains: search } },
                { target_id: { contains: search } },
                { details: { contains: search } },
            ];
        }

        const [logs, total] = await Promise.all([
            prisma.adminLog.findMany({
                where,
                include: {
                    admin: {
                        select: {
                            email: true,
                        }
                    }
                },
                orderBy: { created_at: 'desc' },
                skip,
                take: limit,
            }),
            prisma.adminLog.count({ where }),
        ]);

        return NextResponse.json({
            logs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        });
    } catch (error: any) {
        console.error('[API Logs] Error:', error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
