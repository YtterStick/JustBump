import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';
import { getUserFromRequest } from '../../../../lib/auth';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  try {
    const rows: any = await query('SELECT * FROM calling_cards WHERE id = ? LIMIT 1', [id]);
    if (!Array.isArray(rows) || rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error('card GET error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const token = await getUserFromRequest(req);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const owner: any = await query('SELECT user_id FROM calling_cards WHERE id = ? LIMIT 1', [id]);
    if (!Array.isArray(owner) || owner.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (owner[0].user_id !== token.userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const allowed = ['full_name','job_title','company','headline','address','profile_image_url','slug','is_active'];
    const sets: string[] = [];
    const paramsArr: any[] = [];

    for (const key of allowed) {
      if (key in body) {
        sets.push(`${key} = ?`);
        paramsArr.push((body as any)[key]);
      }
    }

    if (sets.length === 0) return NextResponse.json({ error: 'No updatable fields provided' }, { status: 400 });

    paramsArr.push(id);
    await query(`UPDATE calling_cards SET ${sets.join(', ')} WHERE id = ?`, paramsArr);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('card PUT error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const token = await getUserFromRequest(req);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const owner: any = await query('SELECT user_id FROM calling_cards WHERE id = ? LIMIT 1', [id]);
    if (!Array.isArray(owner) || owner.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (owner[0].user_id !== token.userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await query('DELETE FROM calling_cards WHERE id = ?', [id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('card DELETE error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
