import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { isMySqlConfigured } from '@/lib/mysql';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
  }

  const admin = await db.findUserById(session.id);
  if (!admin) {
    return NextResponse.json({ error: 'Администратор не найден' }, { status: 404 });
  }

  const isMySql = isMySqlConfigured();
  const allStudents = await db.getAllStudents();
  const allTasks = await db.getAllTasks();
  const allSubs = await db.getAllSubmissionsWithDetails();

  return NextResponse.json({
    user: {
      id: admin.id,
      username: admin.username,
      full_name: admin.full_name,
      group_name: admin.group_name,
      role: admin.role,
      two_factor_enabled: Boolean(admin.two_factor_enabled),
    },
    database: {
      isMySql,
      type: isMySql ? 'MySQL 8.0' : 'JSON (store.json)',
      host: process.env.MYSQL_HOST || '127.0.0.1',
      port: process.env.MYSQL_PORT || '3306',
      database: process.env.MYSQL_DATABASE || 'demo_practics',
      user: process.env.MYSQL_USER || 'sudostudy',
      stats: {
        usersCount: allStudents.length + 1,
        tasksCount: allTasks.length,
        submissionsCount: allSubs.length,
      },
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
    const { username, password, fullName } = body;

    const updated = await db.updateAdminCredentials({
      username: typeof username === 'string' && username.trim() ? username.trim() : undefined,
      password: typeof password === 'string' && password.trim() ? password.trim() : undefined,
      fullName: typeof fullName === 'string' && fullName.trim() ? fullName.trim() : undefined,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Не удалось обновить данные' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        username: updated.username,
        full_name: updated.full_name,
        role: updated.role,
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Ошибка при сохранении' },
      { status: 400 }
    );
  }
}
