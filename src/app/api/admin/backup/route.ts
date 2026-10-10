import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
  }

  const store = await db.exportStore();
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `sudostudy-db-backup-${dateStr}.json`;

  return new NextResponse(JSON.stringify(store, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
  }

  try {
    const body = await req.json();
    if (!body || !Array.isArray(body.users) || !Array.isArray(body.submissions)) {
      return NextResponse.json(
        {
          error:
            'Неверный формат резервной копии. Файл должен содержать списки users и submissions.',
        },
        { status: 400 }
      );
    }

    await db.importStore(body);

    return NextResponse.json({
      success: true,
      message: `База данных успешно восстановлена! Пользователей: ${body.users.length}, сдач: ${body.submissions.length}.`,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Ошибка при восстановлении базы данных' },
      { status: 400 }
    );
  }
}
