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

        const [totalUsers, totalProfiles, totalCards, unassignedCards] = await Promise.all([
            prisma.user.count({ where: { deleted_at: null, role: 'User' } }),
            prisma.callingCard.count({ where: { deleted_at: null } }),
            prisma.physicalCard.count({ where: { deleted_at: null } }),
            prisma.physicalCard.count({ where: { deleted_at: null, status: 'unassigned' } }),
        ]);

        return NextResponse.json({
            stats: [
                { label: 'Total Users', value: totalUsers, icon: 'users', color: 'blue' },
                { label: 'Active Profiles', value: totalProfiles, icon: 'profile', color: 'purple' },
                { label: 'Total Cards', value: totalCards, icon: 'card', color: 'green' },
                { label: 'Unassigned Cards', value: unassignedCards, icon: 'inventory', color: 'yellow' },
            ]
        });
    } catch (error: any) {
        console.error('[API Stats] Error:', error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
