import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { getUserFromRequest } from '../../../../../lib/auth';

export async function POST(req: Request) {
    try {
        const token = await getUserFromRequest(req);
        if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

        const body = await req.json();
        const { card_uid } = body;

        if (!card_uid) return NextResponse.json({ error: 'Card UID is required' }, { status: 400 });

        // 1. Find the user's calling card
        const callingCard = await prisma.callingCard.findUnique({
            where: { user_id: token.userId, deleted_at: null }
        });

        if (!callingCard) {
            return NextResponse.json({ error: 'User does not have an active calling card' }, { status: 404 });
        }

        // 2. Find the physical card
        const physicalCard = await prisma.physicalCard.findUnique({
            where: { card_uid, deleted_at: null }
        });

        if (!physicalCard) {
            return NextResponse.json({ error: 'Invalid or non-existent card' }, { status: 404 });
        }

        // 3. Security Check: Must be unassigned
        if (physicalCard.status !== 'unassigned') {
            return NextResponse.json({ error: 'This card is already linked to another account.' }, { status: 403 });
        }

        // 4. Link Process (Transactional)
        const result = await prisma.$transaction(async (tx) => {
            return await tx.physicalCard.update({
                where: { card_id: physicalCard.card_id },
                data: {
                    calling_card_id: callingCard.id,
                    status: 'active',
                    assigned_at: new Date(),
                    activated_at: new Date(),
                }
            });
        });

        return NextResponse.json({
            success: true,
            message: 'Card linked successfully',
            card: result
        });

    } catch (err: any) {
        console.error('Link Card error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
