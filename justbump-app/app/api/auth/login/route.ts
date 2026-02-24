import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '../../../../lib/db';
import { signToken } from '../../../../lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: 'email and password required' }, { status: 400 });

    const rows: any = await query('SELECT id, password_hash FROM users WHERE email = ? LIMIT 1', [email]);
    if (!Array.isArray(rows) || rows.length === 0) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = signToken({ userId: user.id, email });
    const maxAge = 7 * 24 * 60 * 60; // 7 days
    const cookie = `token=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;

    const res = NextResponse.json({ token, user: { id: user.id, email } });
    res.headers.append('Set-Cookie', cookie);
    return res;
  } catch (err) {
    console.error('login error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
