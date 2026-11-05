import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { TASKS_DATA } from '@/lib/tasks-data';

export async function POST() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    await db.ensureTasksSeeded();
    const tasks = await db.getAllTasks();

    return NextResponse.json({
      success: true,
      message: `Задания успешно синхронизированы в базу данных! Всего заданий: ${tasks.length}`,
      totalTasks: tasks.length,
    });
  } catch (error) {
    console.error('Failed to sync tasks:', error);
    return NextResponse.json({ error: 'Ошибка синхронизации заданий' }, { status: 500 });
  }
}

export async function GET() {
  // Allow GET as well for quick browser/curl trigger
  try {
    await db.ensureTasksSeeded();
    const tasks = await db.getAllTasks();
    return NextResponse.json({
      success: true,
      totalTasks: tasks.length,
      tasks2027Count: tasks.filter(t => t.module_id.includes('2027')).length,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
