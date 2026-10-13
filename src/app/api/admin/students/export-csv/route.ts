import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { createCsvResponse, escapeCsvValue } from '@/lib/csv-helper';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const rawGroup = searchParams.get('group');
  const groupFilter = rawGroup ? decodeURIComponent(rawGroup).trim() : null;

  let students = await db.getAllStudentsWithStats();
  if (groupFilter && groupFilter !== 'ALL') {
    students = students.filter(s => s.group_name.trim() === groupFilter);
  }

  const headerCols = [
    'ФИО студента',
    'Учебная группа',
    'Логин для входа',
    'Пароль',
    'Сдано заданий',
    'Суммарный балл',
    'Статус аккаунта',
  ];

  const rows: string[] = [];
  rows.push(headerCols.map(escapeCsvValue).join(';'));

  for (const s of students) {
    const rowCols = [
      s.full_name,
      s.group_name,
      s.username,
      s.password_hash,
      s.passed_count.toString(),
      s.total_score.toString(),
      s.is_active ? 'Активен' : 'Заблокирован',
    ];
    rows.push(rowCols.map(escapeCsvValue).join(';'));
  }

  const filename =
    groupFilter && groupFilter !== 'ALL'
      ? `students_${groupFilter}_passwords.csv`
      : 'students_all_passwords.csv';

  return createCsvResponse(rows, filename);
}
