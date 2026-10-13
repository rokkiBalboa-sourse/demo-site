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
  const rawModule = searchParams.get('module');
  const rawStatus = searchParams.get('status');
  const mode = searchParams.get('mode') || 'matrix'; // 'matrix' | 'journal'

  const groupFilter = rawGroup ? decodeURIComponent(rawGroup).trim() : null;
  const moduleFilter = rawModule ? decodeURIComponent(rawModule).trim() : null;
  const statusFilter = rawStatus ? decodeURIComponent(rawStatus).trim() : null;

  let students = await db.getAllStudents();
  if (groupFilter && groupFilter !== 'ALL') {
    students = students.filter(s => s.group_name.trim() === groupFilter);
  }

  let tasks = await db.getAllTasks();
  if (moduleFilter && moduleFilter !== 'ALL') {
    tasks = tasks.filter(t => t.module_id === moduleFilter);
  }

  let allSubmissions = await db.getAllSubmissionsWithDetails();
  if (groupFilter && groupFilter !== 'ALL') {
    allSubmissions = allSubmissions.filter(s => s.student_group.trim() === groupFilter);
  }
  if (moduleFilter && moduleFilter !== 'ALL') {
    allSubmissions = allSubmissions.filter(s => s.task_module_id === moduleFilter);
  }
  if (statusFilter && statusFilter !== 'ALL') {
    allSubmissions = allSubmissions.filter(s => s.status === statusFilter);
  }

  // MODE 1: Detailed submissions journal (one row per report)
  if (mode === 'journal') {
    const headerCols = [
      'ID сдачи',
      'ФИО студента',
      'Учебная группа',
      'Модуль',
      'Номер задания',
      'Название задания',
      'Дата и время сдачи',
      'Статус',
      'Оценка',
      'Решение',
      'Пересдача разрешена',
      'Рецензент',
      'Дата проверки',
      'Комментарий преподавателя',
    ];

    const rows: string[] = [];
    rows.push(headerCols.map(escapeCsvValue).join(';'));

    for (const sub of allSubmissions) {
      let statusText = 'Не сдавал';
      if (sub.status === 'pending') statusText = 'На проверке';
      if (sub.status === 'reviewed') statusText = 'Проверено (Зачтено)';
      if (sub.status === 'rejected') statusText = 'На доработку';

      const submittedDate = new Date(sub.submitted_at).toLocaleString('ru-RU');
      const reviewedDate = sub.reviewed_at
        ? new Date(sub.reviewed_at).toLocaleString('ru-RU')
        : '—';

      const rowCols = [
        sub.id,
        sub.student_name,
        sub.student_group,
        sub.task_module,
        `№${sub.task_number}`,
        sub.task_title,
        submittedDate,
        statusText,
        sub.score !== null ? `${sub.score} б.` : '—',
        sub.is_passed === true ? 'Зачёт' : sub.is_passed === false ? 'Незачёт' : '—',
        sub.allow_retake ? 'Да' : 'Нет',
        sub.reviewer_name || '—',
        reviewedDate,
        sub.feedback || '—',
      ];

      rows.push(rowCols.map(escapeCsvValue).join(';'));
    }

    const filename =
      groupFilter && groupFilter !== 'ALL'
        ? `zhurnal_otchetov_${groupFilter}.csv`
        : 'zhurnal_otchetov_vse_gruppy.csv';

    return createCsvResponse(rows, filename);
  }

  // MODE 2 (default): Matrix performance sheet (students x tasks)
  const subMap = new Map<string, (typeof allSubmissions)[0]>();
  for (const s of allSubmissions) {
    subMap.set(`${s.user_id}:${s.task_id}`, s);
  }

  // Header row
  const headerCols = ['ФИО', 'Группа', 'Сдано заданий', 'Суммарный балл'];
  for (const t of tasks) {
    headerCols.push(`${t.module_code} №${t.task_number}: ${t.title}`);
  }

  const rows: string[] = [];
  rows.push(headerCols.map(escapeCsvValue).join(';'));

  // Data rows
  for (const student of students) {
    // Count stats for this student across filtered tasks
    let passedCount = 0;
    let totalScore = 0;
    const taskCols: string[] = [];

    for (const task of tasks) {
      const sub = subMap.get(`${student.id}:${task.id}`);
      if (!sub) {
        taskCols.push('Не сдавал');
      } else if (sub.status === 'pending') {
        taskCols.push('На проверке');
      } else if (sub.status === 'reviewed') {
        if (sub.is_passed) passedCount++;
        if (sub.score !== null) {
          totalScore += sub.score;
          taskCols.push(`${sub.score} б. (Зачтено)`);
        } else {
          taskCols.push('Зачтено');
        }
      } else if (sub.status === 'rejected') {
        if (sub.score !== null) {
          totalScore += sub.score;
          taskCols.push(`Не зачтено (${sub.score} б.)`);
        } else {
          taskCols.push('Не зачтено');
        }
      } else {
        taskCols.push('Не сдавал');
      }
    }

    const rowCols = [
      student.full_name,
      student.group_name,
      passedCount.toString(),
      totalScore.toString(),
      ...taskCols,
    ];

    rows.push(rowCols.map(escapeCsvValue).join(';'));
  }

  const groupLabel = groupFilter && groupFilter !== 'ALL' ? groupFilter : 'vse_gruppy';
  const moduleLabel = moduleFilter && moduleFilter !== 'ALL' ? `_${moduleFilter}` : '';
  const filename = `vedomost_${groupLabel}${moduleLabel}_${tasks.length}_zadaniy.csv`;

  return createCsvResponse(rows, filename);
}
