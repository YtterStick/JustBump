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

        const { card_uid, card_type } = await req.json();

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
