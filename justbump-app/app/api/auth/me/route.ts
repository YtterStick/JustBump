import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { getUserFromRequest } from '../../../../lib/auth';

export async function GET(req: Request) {
  try {
    const token = await getUserFromRequest(req);
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const rows: any = await query(
      'SELECT id, email, phone_number, account_type, is_active, created_at FROM users WHERE id = ? LIMIT 1',
      [token.userId]
    );
    if (!Array.isArray(rows) || rows.length === 0) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error('me error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
