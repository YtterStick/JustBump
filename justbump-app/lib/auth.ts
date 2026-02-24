import jwt from 'jsonwebtoken';

export type DecodedToken = {
  userId: number;
  email?: string;
  iat?: number;
  exp?: number;
};

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';

export function signToken(payload: { userId: number; email?: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as DecodedToken;
  } catch (err) {
    return null;
  }
}

export async function getUserFromRequest(req: Request): Promise<DecodedToken | null> {
  const auth = req.headers.get('authorization') || '';
  let token: string | null = null;

  if (auth.startsWith('Bearer ')) token = auth.slice(7);

  if (!token) {
    const cookieHeader = req.headers.get('cookie') || '';
    const match = cookieHeader.match(/(?:^|; )token=([^;]+)/);
    if (match) token = decodeURIComponent(match[1]);
  }

  if (!token) return null;
  return verifyToken(token);
}
