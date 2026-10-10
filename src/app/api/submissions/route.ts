import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const { taskId, logOutput, answers } = await req.json();

    if (!taskId || !logOutput) {
      return NextResponse.json({ error: 'Задание и вывод скрипта обязательны' }, { status: 400 });
    }

    const task = await db.getTaskById(taskId);
    if (!task) {
      return NextResponse.json({ error: 'Задание не найдено' }, { status: 404 });
    }

    const submission = await db.createOrUpdateSubmission({
      userId: session.id,
      taskId: task.id,
      logOutput: String(logOutput).trim(),
      answers: answers || {},
    });

    return NextResponse.json({ success: true, submission });
  } catch (error: unknown) {
    console.error('Submission error', error);
    const message = error instanceof Error ? error.message : 'Не удалось сохранить отчёт';
    const status = message.includes('заблокировано') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
