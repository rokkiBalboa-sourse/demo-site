import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const { submissionId, allowRetake } = await req.json();

    if (!submissionId) {
      return NextResponse.json({ error: 'Не указан ID отчёта' }, { status: 400 });
    }

    const updated = await db.setSubmissionRetakePermission(submissionId, Boolean(allowRetake));

    if (!updated) {
      return NextResponse.json({ error: 'Отчёт не найден' }, { status: 404 });
    }

    return NextResponse.json({ success: true, submission: updated });
  } catch (error) {
    console.error('Allow retake error', error);
    return NextResponse.json(
      { error: 'Ошибка обновления разрешения на пересдачу' },
      { status: 500 }
    );
  }
}
