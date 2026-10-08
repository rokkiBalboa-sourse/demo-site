import { NextResponse } from 'next/server';
import { clearSession } from '@/lib/auth';

export async function POST() {
  await clearSession();
  const res = NextResponse.json({ success: true, redirect: '/login' });
  res.cookies.delete('sudostudy_session');
  return res;
}

export async function GET() {
  await clearSession();
  const res = new NextResponse(null, {
    status: 303,
    headers: {
      Location: '/login',
    },
  });
  res.cookies.delete('sudostudy_session');
  return res;
}
