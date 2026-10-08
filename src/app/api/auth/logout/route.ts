import { NextRequest, NextResponse } from 'next/server';
import { clearSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  await clearSession();
  const url = new URL('/login', req.url);
  return NextResponse.redirect(url, { status: 303 });
}

export async function GET(req: NextRequest) {
  await clearSession();
  const url = new URL('/login', req.url);
  return NextResponse.redirect(url, { status: 303 });
}
