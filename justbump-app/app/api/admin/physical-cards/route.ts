import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { verifyAdminToken } from '../../../../lib/auth';

export async function GET(req: Request) {
    try {
        const token = await verifyAdminTokenFromCookie(req);
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const cards = await prisma.physicalCard.findMany({
            where: { deleted_at: null },
            include: {
                calling_card: true,
            },
            orderBy: { created_at: 'asc' },
        });

        return NextResponse.json(cards);
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const token = await verifyAdminTokenFromCookie(req);
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { card_uid, card_type, batch } = body;

        // Batch creation
        if (batch && Array.isArray(batch) && batch.length > 0) {
            if (batch.length > 1000) {
                return NextResponse.json({ error: 'Maximum batch size is 1,000 cards' }, { status: 400 });
            }

            // Normalize batch items to { card_uid, card_type }
            const items = batch.map((item: any) => {
                if (typeof item === 'string') {
                    return { card_uid: item, card_type: card_type || 'Card' };
                }
                return {
                    card_uid: item.card_uid,
                    card_type: item.card_type || card_type || 'Card'
                };
            });

            const uids = items.map(i => i.card_uid);

            // Check for existing UIDs to avoid duplicates
            const existingCards = await prisma.physicalCard.findMany({
                where: {
                    card_uid: { in: uids },
                    deleted_at: null,
                },
                select: { card_uid: true },
            });
            const existingUids = new Set(existingCards.map((c: { card_uid: string }) => c.card_uid));

            // Filter to only new items
            const newItems = items.filter(item => !existingUids.has(item.card_uid));

            if (newItems.length === 0) {
                return NextResponse.json({ error: 'All UIDs already exist in inventory' }, { status: 409 });
            }

            const result = await prisma.$transaction(async (tx: any) => {
                const created = await tx.physicalCard.createMany({
                    data: newItems.map(item => ({
                        card_uid: item.card_uid,
                        card_type: item.card_type,
                        created_by: token.userId,
                        status: 'unassigned',
                    })),
                    skipDuplicates: true,
                });
                return created;
            });

            const skipped = batch.length - newItems.length;
            return NextResponse.json({
                count: result.count,
                skipped,
                message: skipped > 0
                    ? `Created ${result.count} cards (${skipped} duplicates skipped)`
                    : `Created ${result.count} cards`,
            });
        }

        // Single creation
        if (!card_uid) {
            return NextResponse.json({ error: 'Card UID is required' }, { status: 400 });
        }

        const card = await prisma.physicalCard.create({
            data: {
                card_uid,
                card_type: card_type || 'Card',
                created_by: token.userId,
                status: 'unassigned'
            }
        });

        return NextResponse.json(card);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const token = await verifyAdminTokenFromCookie(req);
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { card_id, card_uid, card_type, status } = body;

        if (!card_id) {
            return NextResponse.json({ error: 'Card ID is required' }, { status: 400 });
        }

        const updatedCard = await prisma.physicalCard.update({
            where: { card_id: parseInt(card_id) },
            data: {
                ...(card_uid && { card_uid }),
                ...(card_type && { card_type }),
                ...(status && { status }),
            },
        });

        return NextResponse.json(updatedCard);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const token = await verifyAdminTokenFromCookie(req);
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await prisma.physicalCard.update({
            where: { card_id: parseInt(id) },
            data: { deleted_at: new Date() }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function verifyAdminTokenFromCookie(req: Request) {
    const cookieHeader = req.headers.get('cookie') || '';
    const match = cookieHeader.match(/(?:^|; )token=([^;]+)/);
    const tokenStr = match ? decodeURIComponent(match[1]) : null;
    if (!tokenStr) return null;
    return await verifyAdminToken(tokenStr);
}
