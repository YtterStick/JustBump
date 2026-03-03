import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getUserFromRequest } from '../../../../lib/auth';

export async function GET(req: Request) {
  try {
    const token = await getUserFromRequest(req);
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: token.userId },
      select: {
        id: true,
        email: true,
        phone_number: true,
        role: true,
        is_active: true,
        created_at: true,
        calling_card: {
          select: {
            id: true,
            full_name: true,
            is_active: true,
            physical_cards: {
              where: {
                status: 'active',
                deleted_at: null
              },
              select: {
                card_id: true,
                card_uid: true,
                status: true
              }
            }
          }
        }
      }
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Determine activation status
    const is_activated = !!user.calling_card && user.calling_card.physical_cards.length > 0;

    return NextResponse.json({
      ...user,
      is_activated
    });
  } catch (err) {
    console.error('me error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
