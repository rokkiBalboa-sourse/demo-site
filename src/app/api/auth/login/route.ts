import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  setSession,
  createSessionToken,
  SESSION_COOKIE_NAME,
  getSessionCookieOptions,
} from '@/lib/auth';
import { generateTotpSecret, generateTotpQRCode, verifyTotpCode } from '@/lib/totp';
import {
  verifyPassword,
  hashPassword,
  signToken,
  check2FALockout,
  record2FAFailure,
  reset2FALockout,
  formatRemainingTime,
} from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, totpCode } = body;

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Укажите логин' }, { status: 400 });
    }

    const cleanUsername = username.trim();
    if (!cleanUsername || cleanUsername.length > 100) {
      return NextResponse.json({ error: 'Некорректный логин' }, { status: 400 });
    }

    const user = await db.findUserByUsername(cleanUsername);

    // СЦЕНАРИЙ 1: Вход по коду Google Authenticator (без пароля)
    if (totpCode) {
      // 1. Проверяем блокировку (таймаут бан на 10 минут при 5 неверных попытках ввода кода)
      const lockoutStatus = check2FALockout(cleanUsername);
      if (lockoutStatus.isLocked) {
        return NextResponse.json(
          {
            error: `Слишком много неверных попыток ввода 2FA кода. Доступ временно заблокирован на 10 минут. Попробуйте снова через ${formatRemainingTime(lockoutStatus.remainingSeconds)}.`,
            isLocked: true,
            remainingSeconds: lockoutStatus.remainingSeconds,
          },
          { status: 429 }
        );
      }

      // Проверяем пользователя и активность 2FA
      if (!user || !user.is_active || !user.two_factor_enabled || !user.two_factor_secret) {
        const failStatus = record2FAFailure(cleanUsername);
        if (failStatus.isLocked) {
          return NextResponse.json(
            {
              error: `Слишком много неверных попыток ввода 2FA кода. Доступ заблокирован на 10 минут. Попробуйте снова через ${formatRemainingTime(failStatus.remainingSeconds)}.`,
              isLocked: true,
              remainingSeconds: failStatus.remainingSeconds,
            },
            { status: 429 }
          );
        }
        return NextResponse.json(
          {
            error: `Неверный логин или код Google Authenticator. Осталось попыток: ${failStatus.attemptsLeft} из 5.`,
            attemptsLeft: failStatus.attemptsLeft,
          },
          { status: 401 }
        );
      }

      const isValid = verifyTotpCode(user.two_factor_secret, totpCode, user.username);
      if (!isValid) {
        const failStatus = record2FAFailure(cleanUsername);
        if (failStatus.isLocked) {
          return NextResponse.json(
            {
              error: `Слишком много неверных попыток ввода 2FA кода. Доступ заблокирован на 10 минут. Попробуйте снова через ${formatRemainingTime(failStatus.remainingSeconds)}.`,
              isLocked: true,
              remainingSeconds: failStatus.remainingSeconds,
            },
            { status: 429 }
          );
        }
        return NextResponse.json(
          {
            error: `Неверный код Google Authenticator. Осталось попыток: ${failStatus.attemptsLeft} из 5 (после 5 попыток — бан на 10 минут).`,
            attemptsLeft: failStatus.attemptsLeft,
          },
          { status: 401 }
        );
      }

      // Успешный вход по 2FA — сбрасываем счетчик ошибок и блокировку
      reset2FALockout(cleanUsername);

      const token = createSessionToken(user.id);
      await setSession(user.id);

      const response = NextResponse.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          full_name: user.full_name,
          group_name: user.group_name,
          role: user.role,
        },
      });

      response.cookies.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions());
      return response;
    }

    // СЦЕНАРИЙ 2: Вход по логину и паролю (первичный вход или настройка)
    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Укажите пароль' }, { status: 400 });
    }

    if (password.length > 256) {
      return NextResponse.json({ error: 'Пароль слишком длинный' }, { status: 400 });
    }

    if (!user || !user.is_active) {
      return NextResponse.json({ error: 'Логин или пароль неверны' }, { status: 401 });
    }

    const { isValid, needsRehash } = verifyPassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: 'Логин или пароль неверны' }, { status: 401 });
    }

    // Прозрачный апгрейд пароля до scrypt хеша
    if (needsRehash) {
      await db.updateUserPasswordHash(user.id, hashPassword(password));
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

    // Одноразовый криптографически подписанный токен привязки на 15 минут
    const setupToken = signToken({
      type: '2fa_setup',
      userId: user.id,
      exp: Date.now() + 15 * 60 * 1000,
    });

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
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
