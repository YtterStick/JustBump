import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { verifyAdminToken } from '../../../../../lib/auth';
import { logAdminAction } from '../../../../../lib/logger';

export async function POST(req: Request) {
    try {
        const token = await verifyAdminTokenFromCookie(req);
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { card_uid, card_uids, user_id } = body;

        const uidsToLink = card_uids || (card_uid ? [card_uid] : []);

        if (uidsToLink.length === 0 || !user_id) {
            return NextResponse.json({ error: 'Card UID(s) and User ID are required' }, { status: 400 });
        }

        // Find the user's calling card
        const callingCard = await prisma.callingCard.findUnique({
            where: { user_id, deleted_at: null }
        });

        if (!callingCard) {
            return NextResponse.json({ error: 'User does not have an active calling card' }, { status: 404 });
        }

        // Link the cards in a transaction
        const result = await prisma.$transaction(async (tx: any) => {
            const physicalCards = await tx.physicalCard.findMany({
                where: {
                    card_uid: { in: uidsToLink },
                    deleted_at: null
                }
            });

            if (physicalCards.length !== uidsToLink.length) {
                const foundUids = physicalCards.map((c: any) => c.card_uid);
                const missingUids = uidsToLink.filter((uid: string) => !foundUids.includes(uid));
                throw new Error(`Some cards were not found: ${missingUids.join(', ')}`);
            }

            const alreadyAssigned = physicalCards.filter((c: any) => c.status !== 'unassigned');
            if (alreadyAssigned.length > 0) {
                throw new Error(`Some cards are already ${alreadyAssigned[0].status}: ${alreadyAssigned.map((c: any) => c.card_uid).join(', ')}`);
            }

            const updatedCards = await Promise.all(
                physicalCards.map((pc: any) =>
                    tx.physicalCard.update({
                        where: { card_id: pc.card_id },
                        data: {
                            calling_card_id: callingCard.id,
                            status: 'assigned',
                            assigned_at: new Date(),
                            updated_by: token.userId,
                        }
                    })
                )
            );

            return updatedCards;
        });

        const isBatch = uidsToLink.length > 1;

        await logAdminAction(
            token.userId,
            isBatch ? 'LINK_CARDS_BATCH' : 'LINK_CARD',
            'PhysicalCard',
            isBatch ? uidsToLink.join(', ') : uidsToLink[0],
            {
                user_id,
                calling_card_id: callingCard.id,
                count: uidsToLink.length,
                uids: uidsToLink
            },
            req
        );

        return NextResponse.json({
            success: true,
            count: result.length,
            message: isBatch
                ? `${result.length} physical cards linked successfully`
                : 'Physical card linked successfully'
        });

    } catch (error: any) {
        console.error('[API Card Link] Error:', error.message);
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
