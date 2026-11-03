import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { ExamYearSettings } from '@/lib/types';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const settings = await db.getExamSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Failed to get exam settings:', error);
    return NextResponse.json({ error: 'Ошибка получения настроек' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const body = await req.json();
    const { settings } = body as { settings: ExamYearSettings };

    if (!settings || !settings.mode || !settings.defaultYear) {
      return NextResponse.json({ error: 'Некорректные параметры настроек' }, { status: 400 });
    }

    const saved = await db.saveExamSettings(settings);
    return NextResponse.json({ success: true, settings: saved });
  } catch (error) {
    console.error('Failed to save exam settings:', error);
    return NextResponse.json({ error: 'Ошибка сохранения настроек' }, { status: 500 });
  }
}
