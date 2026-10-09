import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const { userId, studentId } = await req.json();
    const targetId = userId || studentId;

    if (!targetId) {
      return NextResponse.json(
        { error: 'Не указан ID пользователя' },
        { status: 400 }
      );
    }

    const user = await db.findUserById(targetId);
    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    const updated = await db.resetUser2FA(targetId);

    return NextResponse.json({
      success: true,
      message: `2FA для пользователя ${user.full_name || user.username} успешно сброшена. При следующем входе потребуется пароль и новая привязка устройства.`,
      user: updated,
    });
  } catch (error) {
    console.error('Reset 2FA error', error);
    return NextResponse.json(
      { error: 'Ошибка при сбросе 2FA' },
      { status: 500 }
    );
  }
}
