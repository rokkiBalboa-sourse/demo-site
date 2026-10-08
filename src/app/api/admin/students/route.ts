import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
  }

  try {
    const students = await db.getAllStudentsWithStats();
    return NextResponse.json({ students });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Ошибка загрузки базы студентов' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
  }

  try {
    const body = await req.json();

    if (body.mode === 'batch') {
      const items = Array.isArray(body.students) ? body.students : [];
      if (items.length === 0) {
        return NextResponse.json(
          { error: 'Список студентов для импорта пуст' },
          { status: 400 }
        );
      }

      const result = await db.createStudentsBatch(items);
      return NextResponse.json({
        success: true,
        createdCount: result.created.length,
        skippedCount: result.skipped.length,
        created: result.created,
        skipped: result.skipped,
      });
    }

    // Single student creation
    const { full_name, group_name, username, password } = body;
    if (!full_name || !group_name || !username || !password) {
      return NextResponse.json(
        { error: 'Все поля (ФИО, группа, логин, пароль) обязательны для заполнения' },
        { status: 400 }
      );
    }

    const created = await db.createUser({
      full_name,
      group_name,
      username,
      password_hash: password,
      role: 'student',
    });

    return NextResponse.json({ success: true, student: created });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Ошибка при сохранении студента' },
      { status: 400 }
    );
  }
}
