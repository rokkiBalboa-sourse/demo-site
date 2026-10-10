import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const groupFilter = searchParams.get('group');

  let students = await db.getAllStudentsWithStats();
  if (groupFilter && groupFilter !== 'ALL') {
    students = students.filter(s => s.group_name === groupFilter);
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

  // UTF-8 BOM \uFEFF ensures proper Cyrillic rendering in Microsoft Excel
  const csvContent = '\uFEFF' + rows.join('\r\n');

  const filename =
    groupFilter && groupFilter !== 'ALL'
      ? `students_${groupFilter.replace(/[^a-zA-Z0-9а-яА-Я_-]/g, '_')}_passwords.csv`
      : 'students_all_passwords.csv';

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}

function escapeCsvValue(val: string): string {
  if (val.includes(';') || val.includes('"') || val.includes('\n') || val.includes('\r')) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}
