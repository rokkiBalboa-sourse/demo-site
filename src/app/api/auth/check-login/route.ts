import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ has2FA: false });
    }

    const cleanUsername = username.trim();
    if (!cleanUsername) {
      return NextResponse.json({ has2FA: false });
    }

    const user = await db.findUserByUsername(cleanUsername);

    if (user && user.is_active && user.two_factor_enabled && user.two_factor_secret) {
      return NextResponse.json({
        has2FA: true,
        username: user.username,
        fullName: user.full_name,
      });
    }

    return NextResponse.json({
      has2FA: false,
    });
  } catch (error) {
    console.error('Check user error', error);
    return NextResponse.json({ has2FA: false });
  }
}
