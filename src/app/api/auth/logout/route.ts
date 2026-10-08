import { NextRequest, NextResponse } from 'next/server';
import { clearSession } from '@/lib/auth';

function getRedirectUrl(req: NextRequest): string {
  // Check headers from reverse proxy (Nginx)
  const forwardedHost = req.headers.get('x-forwarded-host');
  const forwardedProto = req.headers.get('x-forwarded-proto') || 'https';
  const host = forwardedHost || req.headers.get('host');

  if (host && !host.includes('localhost') && !host.includes('127.0.0.1')) {
    return `${forwardedProto}://${host}/login`;
  }

  // Check APP_URL or NEXTAUTH_URL environment variables
  const envUrl = process.env.APP_URL || process.env.NEXTAUTH_URL;
  if (envUrl && !envUrl.includes('localhost')) {
    return `${envUrl.replace(/\/+$/, '')}/login`;
  }

  if (host) {
    return `${forwardedProto}://${host}/login`;
  }

  return new URL('/login', req.url).toString();
}

export async function POST(req: NextRequest) {
  await clearSession();
  return NextResponse.redirect(getRedirectUrl(req), { status: 303 });
}

export async function GET(req: NextRequest) {
  await clearSession();
  return NextResponse.redirect(getRedirectUrl(req), { status: 303 });
}
