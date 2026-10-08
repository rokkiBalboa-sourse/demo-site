import { cookies } from 'next/headers';
import { db } from './db';
import { SessionUser } from './types';

const SESSION_COOKIE_NAME = 'sudostudy_session';

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  try {
    // Decodes base64 payload { userId, timestamp }
    const decoded = Buffer.from(sessionToken, 'base64').toString('utf-8');
    const { userId } = JSON.parse(decoded);
    if (!userId) return null;

    const user = await db.findUserById(userId);
    if (!user || !user.is_active) return null;

    return {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      group_name: user.group_name,
      role: user.role,
    };
  } catch {
    return null;
  }
}

export async function setSession(userId: string) {
  const cookieStore = await cookies();
  const token = Buffer.from(
    JSON.stringify({ userId, timestamp: Date.now() })
  ).toString('base64');

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
