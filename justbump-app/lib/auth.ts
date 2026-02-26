import * as jose from 'jose';

export type DecodedToken = {
  userId: number;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
};

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev_jwt_secret');

export async function signToken(payload: { userId: number; email?: string; role?: string }) {
  console.log('[Auth] Signing token for userId:', payload.userId);
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<DecodedToken | null> {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return payload as unknown as DecodedToken;
  } catch (err: any) {
    console.error('[Auth] Token verification failed:', err.message);
    return null;
  }
}


export async function verifyAdminToken(token: string): Promise<DecodedToken | null> {
  console.log('[Auth] Verifying admin token...');
  const decoded = await verifyToken(token);
  if (!decoded) {
    console.log('[Auth] Decoded token is null');
    return null;
  }
  console.log('[Auth] Decoded role:', decoded.role);
  if (decoded.role !== 'Admin') {
    console.log('[Auth] Role mismatch: expected Admin, got', decoded.role);
    return null;
  }
  return decoded;
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
  return await verifyToken(token);
}
