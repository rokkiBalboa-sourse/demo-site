import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const updated = await db.updateUser(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Студент не найден' }, { status: 404 });
    }

    return NextResponse.json({ success: true, student: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Ошибка при обновлении студента' },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
  }

  const { id } = await params;
  try {
    const success = await db.deleteUser(id);
    if (!success) {
      return NextResponse.json({ error: 'Студент не найден' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Ошибка при удалении студента' },
      { status: 500 }
    );
  }
}
