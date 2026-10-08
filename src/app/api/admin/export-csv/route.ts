import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
  }

  const students = await db.getAllStudents();
  const tasks = await db.getAllTasks();
  const allSubmissions = await db.getAllSubmissionsWithDetails();

  // Create lookup map: `userId:taskId` -> Submission
  const subMap = new Map<string, (typeof allSubmissions)[0]>();
  for (const s of allSubmissions) {
    subMap.set(`${s.user_id}:${s.task_id}`, s);
  }

  // Header row
  const headerCols = ['ФИО', 'Группа'];
  for (const t of tasks) {
    headerCols.push(`${t.module_code} №${t.task_number}: ${t.title}`);
  }

  const rows: string[] = [];
  rows.push(headerCols.map(escapeCsvValue).join(';'));

  // Data rows
  for (const student of students) {
    const rowCols = [student.full_name, student.group_name];

    for (const task of tasks) {
      const sub = subMap.get(`${student.id}:${task.id}`);
      if (!sub) {
        rowCols.push('Не сдавал');
      } else if (sub.status === 'pending') {
        rowCols.push('На проверке');
      } else if (sub.status === 'reviewed') {
        if (sub.score !== null) {
          rowCols.push(`${sub.score} б. (Зачтено)`);
        } else {
          rowCols.push('Зачтено');
        }
      } else if (sub.status === 'rejected') {
        if (sub.score !== null) {
          rowCols.push(`Не зачтено (${sub.score} б.)`);
        } else {
          rowCols.push('Не зачтено');
        }
      } else {
        rowCols.push('Не сдавал');
      }
    }

    rows.push(rowCols.map(escapeCsvValue).join(';'));
  }

  // UTF-8 BOM is \uFEFF for proper Excel display of Cyrillic characters
  const csvContent = '\uFEFF' + rows.join('\r\n');

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="reports_summary_32_tasks.csv"',
    },
  });
}

function escapeCsvValue(val: string): string {
  if (val.includes(';') || val.includes('"') || val.includes('\n') || val.includes('\r')) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}
