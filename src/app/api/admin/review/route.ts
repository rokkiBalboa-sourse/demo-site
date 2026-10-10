import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const { submissionId, score, isPassed, feedback, allowRetake } = await req.json();

    if (!submissionId) {
      return NextResponse.json({ error: 'Не указан ID отчёта' }, { status: 400 });
    }

    const parsedScore =
      score === '' || score === null || score === undefined ? null : Number(score);

    const updated = await db.reviewSubmission(submissionId, session.id, {
      score: parsedScore,
      isPassed: Boolean(isPassed),
      feedback: feedback ? String(feedback).trim() : '',
      allowRetake: typeof allowRetake === 'boolean' ? allowRetake : undefined,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Отчёт не найден' }, { status: 404 });
    }

    return NextResponse.json({ success: true, submission: updated });
  } catch (error) {
    console.error('Review error', error);
    return NextResponse.json({ error: 'Ошибка сохранения проверки' }, { status: 500 });
  }
}
