import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const body = await req.json();
    const { scope, groupId, studentId } = body;

    if (!scope || !['group', 'all', 'student'].includes(scope)) {
      return NextResponse.json({ error: 'Неверный параметр области (scope)' }, { status: 400 });
    }

    if (scope === 'group' && !groupId) {
      return NextResponse.json({ error: 'Не указана группа' }, { status: 400 });
    }

    if (scope === 'student' && !studentId) {
      return NextResponse.json({ error: 'Не указан студент' }, { status: 400 });
    }

    const result = await db.bulkCloseAllAsFive(session.id, {
      scope,
      groupId,
      studentId,
    });

    return NextResponse.json({
      success: true,
      count: result.count,
      studentsCount: result.studentsCount,
      submissions: result.updatedSubmissions,
      students: result.updatedStudents,
    });
  } catch (error) {
    console.error('Bulk grade five error', error);
    return NextResponse.json({ error: 'Ошибка массового закрытия работ' }, { status: 500 });
  }
}
