import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { setSession } from '@/lib/auth';
import { generateTotpSecret, generateTotpQRCode, verifyTotpCode } from '@/lib/totp';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, totpCode } = body;

    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { error: 'Укажите логин' },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim();
    const user = await db.findUserByUsername(cleanUsername);

    // СЦЕНАРИЙ 1: Вход по коду Google Authenticator (без пароля)
    if (totpCode) {
      if (!user || !user.is_active || !user.two_factor_enabled || !user.two_factor_secret) {
        return NextResponse.json(
          { error: 'Неверный логин или код Google Authenticator' },
          { status: 401 }
        );
      }

      const isValid = verifyTotpCode(user.two_factor_secret, totpCode, user.username);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Неверный код Google Authenticator. Проверьте актуальный код в приложении.' },
          { status: 401 }
        );
      }

      await setSession(user.id);

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          full_name: user.full_name,
          group_name: user.group_name,
          role: user.role,
        },
      });
    }

    // СЦЕНАРИЙ 2: Вход по логину и паролю (первичный вход или настройка)
    if (!password) {
      return NextResponse.json(
        { error: 'Укажите пароль' },
        { status: 400 }
      );
    }

    if (!user || user.password_hash !== password) {
      return NextResponse.json(
        { error: 'Логин или пароль неверны' },
        { status: 401 }
      );
    }

    // Если 2FA уже привязана, сообщаем клиенту, что нужен 6-значный код
    if (user.two_factor_enabled && user.two_factor_secret) {
      return NextResponse.json({
        requires2FACode: true,
        username: user.username,
        message: 'Для входа требуется ввести код Google Authenticator',
      });
    }

    // Если 2FA ещё не привязана — генерируем секрет и QR-код для обязательной привязки
    const tempSecret = generateTotpSecret();
    await db.setUser2FATempSecret(user.id, tempSecret);
    const qrCode = await generateTotpQRCode(tempSecret, user.username);

    // Одноразовый токен привязки на 15 минут
    const setupToken = Buffer.from(
      JSON.stringify({
        userId: user.id,
        exp: Date.now() + 15 * 60 * 1000,
      })
    ).toString('base64');

    return NextResponse.json({
      requires2FASetup: true,
      setupToken,
      qrCode,
      secret: tempSecret,
      username: user.username,
      message: 'Для завершения входа необходимо привязать Google Authenticator',
    });
  } catch (error) {
    console.error('Login error', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
