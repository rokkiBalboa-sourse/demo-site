import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { setSession } from '@/lib/auth';
import { verifyTotpCode } from '@/lib/totp';

export async function POST(req: NextRequest) {
  try {
    const { setupToken, code } = await req.json();

    if (!setupToken || !code) {
      return NextResponse.json(
        { error: 'Укажите токен настройки и 6-значный код' },
        { status: 400 }
      );
    }

    // Decode setupToken
    let payload: { userId: string; exp: number };
    try {
      const decoded = Buffer.from(setupToken, 'base64').toString('utf-8');
      payload = JSON.parse(decoded);
    } catch {
      return NextResponse.json(
        { error: 'Некорректный токен настройки 2FA' },
        { status: 400 }
      );
    }

    if (Date.now() > payload.exp) {
      return NextResponse.json(
        { error: 'Время привязки истекло. Пожалуйста, войдите снова.' },
        { status: 400 }
      );
    }

    const user = await db.findUserById(payload.userId);
    if (!user || !user.is_active || !user.two_factor_temp_secret) {
      return NextResponse.json(
        { error: 'Сессия настройки не найдена. Попробуйте войти заново.' },
        { status: 400 }
      );
    }

    const isValid = verifyTotpCode(user.two_factor_temp_secret, code, user.username);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Неверный 6-значный код. Убедитесь, что время на телефоне точное, и введите код ещё раз.' },
        { status: 400 }
      );
    }

    // Confirm 2FA setup in database
    const updated = await db.confirmUser2FASetup(user.id, user.two_factor_temp_secret);
    if (!updated) {
      return NextResponse.json(
        { error: 'Ошибка активации двухэтапной аутентификации' },
        { status: 500 }
      );
    }

    // Log the user in
    await setSession(user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        username: updated.username,
        full_name: updated.full_name,
        group_name: updated.group_name,
        role: updated.role,
      },
    });
  } catch (error) {
    console.error('Setup 2FA error', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка при привязке 2FA' },
      { status: 500 }
    );
  }
}
