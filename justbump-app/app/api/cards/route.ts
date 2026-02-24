import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';
import { getUserFromRequest } from '../../../lib/auth';

export async function GET() {
  try {
    const rows = await query(
      `SELECT id, user_id, full_name, job_title, company, slug, is_active, created_at
       FROM calling_cards
       ORDER BY created_at DESC
       LIMIT 20`
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error('DB error', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const token = await getUserFromRequest(req);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { full_name, job_title, company, slug, sharing_id } = body || {};
    if (!full_name || !slug) return NextResponse.json({ error: 'full_name and slug required' }, { status: 400 });

    const sharing = sharing_id ?? (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? (crypto as any).randomUUID() : `sid_${Date.now()}`);

    const res: any = await query(
      'INSERT INTO calling_cards (user_id, full_name, job_title, company, slug, sharing_id) VALUES (?, ?, ?, ?, ?, ?)',
      [token.userId, full_name, job_title || null, company || null, slug, sharing]
    );

    return NextResponse.json({ id: res.insertId }, { status: 201 });
  } catch (err) {
    console.error('create card error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
