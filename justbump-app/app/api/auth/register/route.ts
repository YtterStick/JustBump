import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '../../../../lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, phone_number } = body || {};
    if (!email || !password) return NextResponse.json({ error: 'email and password required' }, { status: 400 });

    const existing: any = await query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
    if (Array.isArray(existing) && existing.length > 0) return NextResponse.json({ error: 'Email already in use' }, { status: 409 });

    const password_hash = await bcrypt.hash(password, 10);
    const res: any = await query(
      'INSERT INTO users (email, phone_number, password_hash) VALUES (?, ?, ?)',
      [email, phone_number || null, password_hash]
    );

    return NextResponse.json({ id: res.insertId, email }, { status: 201 });
  } catch (err) {
    console.error('register error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
