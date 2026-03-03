import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getUserFromRequest } from '../../../../lib/auth';

export async function POST(req: Request) {
    try {
        const token = await getUserFromRequest(req);
        if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

        const { card_uid } = await req.json();
        if (!card_uid) return NextResponse.json({ error: 'Card UID is required' }, { status: 400 });

        // 1. Find the physical card
        const physicalCard = await prisma.physicalCard.findUnique({
            where: { card_uid },
            include: {
                calling_card: true
            }
        });

        if (!physicalCard || physicalCard.deleted_at) {
            return NextResponse.json({ error: 'Invalid or non-existent card' }, { status: 404 });
        }

        // 2. Security Check: Must be assigned to this user
        if (physicalCard.status === 'active' || physicalCard.status === 'blocked') {
            return NextResponse.json({ error: 'This card is already active or blocked' }, { status: 403 });
        }

        if (physicalCard.status === 'unassigned') {
            return NextResponse.json({ error: 'This card has not been assigned for activation yet. Please contact support.' }, { status: 403 });
        }

        // 3. Ownership Check: Verify it is assigned to this user
        const userCard = await prisma.callingCard.findUnique({
            where: { user_id: token.userId }
        });

        if (!userCard || physicalCard.calling_card_id !== userCard.id) {
            return NextResponse.json({ error: 'This card is not assigned to your account' }, { status: 403 });
        }

        // 4. Activation Process (Transactional)
        const result = await prisma.$transaction(async (tx) => {
            // Link and Activate the physical card
            return await tx.physicalCard.update({
                where: { card_id: physicalCard.card_id },
                data: {
                    status: 'active',
                    activated_at: new Date(),
                }
            });
        });

        return NextResponse.json({
            success: true,
            message: 'Card activated successfully',
            card: result
        });

    } catch (err: any) {
        console.error('Activation error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
