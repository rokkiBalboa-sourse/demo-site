'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { SubmissionWithDetails, Task, ModuleInfo, StudentWithStats } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import {
  Download,
  Search,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Table,
  LayoutGrid,
  Award,
  Percent,
  X,
  FileSpreadsheet,
  ArrowUpDown,
  User,
  Info,
} from 'lucide-react';

interface GradesMatrixClientProps {
  students: StudentWithStats[];
  tasks: Task[];
  submissions: SubmissionWithDetails[];
  modules: ModuleInfo[];
  availableGroups: string[];
}

export function GradesMatrixClient({
  students,
  tasks,
  submissions,
  modules,
  availableGroups,
}: GradesMatrixClientProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'passed'>('name');
  const [viewMode, setViewMode] = useState<'matrix' | 'cards'>('matrix');

  // Selected submission modal for instant quick inspection without leaving the page
  const [selectedSub, setSelectedSub] = useState<SubmissionWithDetails | null>(null);

  // Quick lookup map: `${userId}:${taskId}` -> Submission
  const subMap = useMemo(() => {
    const map = new Map<string, SubmissionWithDetails>();
    for (const s of submissions) {
      map.set(`${s.user_id}:${s.task_id}`, s);
    }
    return map;
  }, [submissions]);

  // Filter tasks based on selected module
  const filteredTasks = useMemo(() => {
    if (selectedModule === 'ALL') return tasks;
    return tasks.filter(t => t.module_id === selectedModule);
  }, [tasks, selectedModule]);

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    let result = students.filter(s => {
      if (selectedGroup !== 'ALL' && s.group_name !== selectedGroup) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = s.full_name.toLowerCase().includes(q);
        const matchGroup = s.group_name.toLowerCase().includes(q);
        const matchUser = s.username.toLowerCase().includes(q);
        if (!matchName && !matchGroup && !matchUser) return false;
      }
      return true;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === 'score') {
        return b.total_score - a.total_score;
      }
      if (sortBy === 'passed') {
        return b.passed_count - a.passed_count;
      }
      // default: group name then full name
      if (a.group_name !== b.group_name) {
        return a.group_name.localeCompare(b.group_name);
      }
      return a.full_name.localeCompare(b.full_name);
    });

    return result;
  }, [students, selectedGroup, searchQuery, sortBy]);

  // Aggregate statistics for the filtered group
  const stats = useMemo(() => {
    const totalStudents = filteredStudents.length;
    if (totalStudents === 0) {
      return { totalStudents: 0, avgScore: 0, avgPassed: 0, pendingInScope: 0, totalPassedSubs: 0 };
    }

    let totalScoreSum = 0;
    let totalPassedSum = 0;
    let pendingCount = 0;

    const studentIds = new Set(filteredStudents.map(s => s.id));
    const taskIds = new Set(filteredTasks.map(t => t.id));

    for (const sub of submissions) {
      if (studentIds.has(sub.user_id) && taskIds.has(sub.task_id)) {
        if (sub.status === 'pending') pendingCount++;
        if (sub.status === 'reviewed' && sub.is_passed) {
          totalPassedSum++;
          totalScoreSum += sub.score || 0;
        }
      }
    }

    const avgScore = totalPassedSum > 0 ? (totalScoreSum / totalPassedSum).toFixed(1) : '0';
    const avgPassed = (totalPassedSum / totalStudents).toFixed(1);

    return {
      totalStudents,
      avgScore,
      avgPassed,
      pendingInScope: pendingCount,
      totalPassedSubs: totalPassedSum,
    };
  }, [filteredStudents, filteredTasks, submissions]);

  // Export CSV URL matching the active filters
  const exportUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (selectedGroup !== 'ALL') params.set('group', selectedGroup);
    if (selectedModule !== 'ALL') params.set('module', selectedModule);
    const qs = params.toString();
    return `/api/admin/export-csv${qs ? `?${qs}` : ''}`;
  }, [selectedGroup, selectedModule]);

  return (
    <div className="space-y-5">
      {/* Top Controls Bar */}
      <div className="border border-zinc-800 bg-zinc-900/90 p-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Table className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
                <span>Сводная ведомость оценок</span>
                <span className="text-[11px] font-normal text-zinc-400">
                  (Матрица выполненных работ)
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Интерактивный журнал успеваемости без необходимости каждый раз выгружать CSV
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Toggle */}
            <div className="inline-flex rounded border border-zinc-800 bg-zinc-950 p-0.5 font-mono text-xs">
              <button
                type="button"
                onClick={() => setViewMode('matrix')}
                className={`px-3 py-1 flex items-center gap-1.5 transition cursor-pointer ${
                  viewMode === 'matrix'
                    ? 'bg-zinc-800 text-white font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Матрица (32)</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1 flex items-center gap-1.5 transition cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-zinc-800 text-white font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Карточки прогресса</span>
              </button>
            </div>

            {/* CSV Export Button */}
            <a href={exportUrl} download>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 font-mono text-xs"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Выгрузить CSV</span>
              </Button>
            </a>
          </div>
        </div>

        {/* Filter & Sort Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-zinc-800/80 font-mono text-xs">
          {/* Group Filter */}
          <div>
            <label className="block text-[11px] uppercase text-zinc-400 mb-1">
              Учебная группа:
            </label>
            <select
              value={selectedGroup}
              onChange={e => setSelectedGroup(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 px-3 py-1.5 text-xs focus:outline-none focus:border-zinc-500 font-mono cursor-pointer"
            >
              <option value="ALL">Все группы ({availableGroups.length})</option>
              {availableGroups.map(g => (
                <option key={g} value={g}>
                  Группа {g}
                </option>
              ))}
            </select>
          </div>

          {/* Module Filter */}
          <div>
            <label className="block text-[11px] uppercase text-zinc-400 mb-1">
              Экзаменационный модуль:
            </label>
            <select
              value={selectedModule}
              onChange={e => setSelectedModule(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 px-3 py-1.5 text-xs focus:outline-none focus:border-zinc-500 font-mono cursor-pointer"
            >
              <option value="ALL">Все модули (32 задания)</option>
              {modules.map(m => (
                <option key={m.id} value={m.id}>
                  {m.code}: {m.title}
                </option>
              ))}
            </select>
          </div>

          {/* Search by Student Name */}
          <div>
            <label className="block text-[11px] uppercase text-zinc-400 mb-1">
              Поиск студента:
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="ФИО или логин..."
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-zinc-500 font-mono"
              />
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Sorting */}
          <div>
            <label className="block text-[11px] uppercase text-zinc-400 mb-1">Сортировка:</label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as 'name' | 'score' | 'passed')}
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 px-3 py-1.5 text-xs focus:outline-none focus:border-zinc-500 font-mono cursor-pointer"
              >
                <option value="name">По алфавиту (ФИО)</option>
                <option value="score">По суммарному баллу (↓)</option>
                <option value="passed">По числу сданных (↓)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="border border-zinc-800 bg-zinc-900/60 p-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-400 uppercase block">Студентов в выборке</span>
            <span className="text-base font-bold text-white">{stats.totalStudents}</span>
          </div>
          <User className="w-5 h-5 text-zinc-500" />
        </div>

        <div className="border border-zinc-800 bg-zinc-900/60 p-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-400 uppercase block">Зачтено заданий</span>
            <span className="text-base font-bold text-emerald-400">{stats.totalPassedSubs}</span>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        </div>

        <div className="border border-zinc-800 bg-zinc-900/60 p-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-400 uppercase block">Ожидает проверки</span>
            <span
              className={`text-base font-bold ${stats.pendingInScope > 0 ? 'text-amber-400' : 'text-zinc-400'}`}
            >
              {stats.pendingInScope}
            </span>
          </div>
          <Clock
            className={`w-5 h-5 ${stats.pendingInScope > 0 ? 'text-amber-400' : 'text-zinc-600'}`}
          />
        </div>

        <div className="border border-zinc-800 bg-zinc-900/60 p-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-400 uppercase block">Ср. балл / Ср. сдача</span>
            <span className="text-base font-bold text-cyan-300">
              {stats.avgScore} б. • {stats.avgPassed} зад.
            </span>
          </div>
          <Award className="w-5 h-5 text-cyan-400" />
        </div>
      </div>

      {/* Status Legend */}
      <div className="border border-zinc-800 bg-zinc-950/60 p-3 flex items-center gap-3 flex-wrap font-mono text-[11px] text-zinc-400">
        <span className="font-bold uppercase tracking-wider text-zinc-300">Обозначения:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded bg-emerald-950 border border-emerald-500/70 text-emerald-300 font-bold flex items-center justify-center text-[10px]">
            5
          </span>
          <span>Отлично</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded bg-teal-950 border border-teal-500/70 text-teal-300 font-bold flex items-center justify-center text-[10px]">
            4
          </span>
          <span>Хорошо</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded bg-amber-950 border border-amber-500/70 text-amber-300 font-bold flex items-center justify-center text-[10px]">
            3
          </span>
          <span>Удовлетворительно</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded bg-rose-950 border border-rose-500/70 text-rose-300 font-bold flex items-center justify-center text-[10px]">
            2
          </span>
          <span>На доработку</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded bg-yellow-950 border border-yellow-500/70 text-yellow-300 font-bold flex items-center justify-center text-[10px]">
            ⏳
          </span>
          <span>На проверке</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded bg-zinc-900 border border-zinc-800 text-zinc-600 flex items-center justify-center text-[10px]">
            —
          </span>
          <span>Не сдавал</span>
        </div>
        <span className="ml-auto text-[10px] text-zinc-500 hidden md:inline">
          * Кликните на любую ячейку с оценкой для быстрого просмотра и проверки
        </span>
      </div>

      {/* VIEW 1: MATRIX GRID VIEW (Sticky first column + 32 tasks) */}
      {viewMode === 'matrix' && (
        <div className="border border-zinc-800 bg-zinc-900/40 overflow-hidden">
          <div className="overflow-x-auto max-h-[720px] relative">
            <table className="w-full text-left font-mono border-collapse text-xs">
              <thead className="bg-zinc-950 text-zinc-300 uppercase sticky top-0 z-30 shadow-md">
                {/* Module Grouping Super Header */}
                <tr className="border-b border-zinc-800 text-[10px]">
                  <th
                    className="p-3 sticky left-0 bg-zinc-950 z-40 border-r border-zinc-800 min-w-[220px]"
                    colSpan={2}
                  >
                    Студент / Группа
                  </th>
                  <th
                    className="p-2 border-r border-zinc-800 text-center bg-zinc-950/90"
                    colSpan={4}
                  >
                    Сводка успеваемости
                  </th>
                  {selectedModule === 'ALL' || selectedModule === 'module-1' ? (
                    <th
                      className="p-2 border-r border-zinc-800 text-center bg-sky-950/40 text-sky-300 font-bold"
                      colSpan={tasks.filter(t => t.module_id === 'module-1').length}
                    >
                      Модуль 1: Сетевая инфраструктура (11 заданий)
                    </th>
                  ) : null}
                  {selectedModule === 'ALL' || selectedModule === 'module-2' ? (
                    <th
                      className="p-2 border-r border-zinc-800 text-center bg-amber-950/40 text-amber-300 font-bold"
                      colSpan={tasks.filter(t => t.module_id === 'module-2').length}
                    >
                      Модуль 2: Системное администрирование (11 заданий)
                    </th>
                  ) : null}
                  {selectedModule === 'ALL' || selectedModule === 'module-3' ? (
                    <th
                      className="p-2 border-r border-zinc-800 text-center bg-emerald-950/40 text-emerald-300 font-bold"
                      colSpan={tasks.filter(t => t.module_id === 'module-3').length}
                    >
                      Модуль 3: Информационная безопасность (10 заданий)
                    </th>
                  ) : null}
                </tr>

                {/* Task Sub-Header (task numbers & short codes) */}
                <tr className="border-b border-zinc-800 text-[11px]">
                  <th className="p-3 sticky left-0 bg-zinc-950 z-40 border-r border-zinc-800">
                    ФИО студента
                  </th>
                  <th className="p-2 border-r border-zinc-800 text-center min-w-[80px]">Группа</th>
                  <th className="p-2 border-r border-zinc-800 text-center min-w-[65px] text-emerald-400">
                    Сдано
                  </th>
                  <th className="p-2 border-r border-zinc-800 text-center min-w-[60px] text-cyan-400">
                    %
                  </th>
                  <th className="p-2 border-r border-zinc-800 text-center min-w-[65px] text-white">
                    Балл
                  </th>
                  <th className="p-2 border-r border-zinc-800 text-center min-w-[65px] text-zinc-400">
                    Ср.
                  </th>

                  {filteredTasks.map(t => (
                    <th
                      key={t.id}
                      className="p-2 border-r border-zinc-800/80 text-center min-w-[42px] max-w-[48px] hover:bg-zinc-900 transition cursor-help"
                      title={`${t.module_code} №${t.task_number}: ${t.title}`}
                    >
                      <span className="text-[10px] block font-bold text-zinc-400">
                        {t.module_code}
                      </span>
                      <span className="text-[11px] font-bold text-white">№{t.task_number}</span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-800/80">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td
                      colSpan={filteredTasks.length + 6}
                      className="p-10 text-center text-zinc-500 font-mono"
                    >
                      Студентов по заданным критериям не найдено.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map(student => {
                    // Calculate stats for filtered tasks scope
                    let passedCount = 0;
                    let studentScoreSum = 0;

                    for (const task of filteredTasks) {
                      const sub = subMap.get(`${student.id}:${task.id}`);
                      if (sub && sub.status === 'reviewed' && sub.is_passed) {
                        passedCount++;
                        studentScoreSum += sub.score || 0;
                      }
                    }

                    const pct = Math.round((passedCount / filteredTasks.length) * 100);
                    const avg = passedCount > 0 ? (studentScoreSum / passedCount).toFixed(1) : '—';

                    return (
                      <tr key={student.id} className="hover:bg-zinc-800/40 transition-colors">
                        {/* Sticky Name column */}
                        <td className="p-2.5 sticky left-0 bg-zinc-900 z-20 border-r border-zinc-800 whitespace-nowrap shadow-[2px_0_5px_rgba(0,0,0,0.5)]">
                          <div className="font-bold text-white hover:text-emerald-400 transition">
                            {student.full_name}
                          </div>
                          <div className="text-[10px] text-zinc-500 font-mono">
                            Логин: {student.username}
                          </div>
                        </td>

                        {/* Group */}
                        <td className="p-2 border-r border-zinc-800 text-center whitespace-nowrap text-zinc-300">
                          <span className="bg-zinc-950 border border-zinc-800 px-1.5 py-0.5 rounded text-[10px]">
                            {student.group_name}
                          </span>
                        </td>

                        {/* Passed Count */}
                        <td className="p-2 border-r border-zinc-800 text-center whitespace-nowrap font-bold text-emerald-400">
                          {passedCount}/{filteredTasks.length}
                        </td>

                        {/* Percent */}
                        <td className="p-2 border-r border-zinc-800 text-center whitespace-nowrap">
                          <span
                            className={`font-bold text-[11px] ${
                              pct >= 80
                                ? 'text-emerald-400'
                                : pct >= 50
                                  ? 'text-cyan-400'
                                  : pct >= 20
                                    ? 'text-amber-400'
                                    : 'text-zinc-500'
                            }`}
                          >
                            {pct}%
                          </span>
                        </td>

                        {/* Total Score in Scope */}
                        <td className="p-2 border-r border-zinc-800 text-center whitespace-nowrap font-bold text-white">
                          {studentScoreSum} б.
                        </td>

                        {/* Average Score */}
                        <td className="p-2 border-r border-zinc-800 text-center whitespace-nowrap text-zinc-400">
                          {avg}
                        </td>

                        {/* Tasks Cells */}
                        {filteredTasks.map(task => {
                          const sub = subMap.get(`${student.id}:${task.id}`);

                          if (!sub) {
                            return (
                              <td
                                key={task.id}
                                className="p-1 border-r border-zinc-800/60 text-center text-zinc-700 select-none"
                              >
                                —
                              </td>
                            );
                          }

                          if (sub.status === 'pending') {
                            return (
                              <td
                                key={task.id}
                                className="p-1 border-r border-zinc-800/60 text-center cursor-pointer"
                                onClick={() => setSelectedSub(sub)}
                                title={`${task.module_code} №${task.task_number}: На проверке (${new Date(sub.submitted_at).toLocaleDateString()})`}
                              >
                                <span className="inline-flex w-7 h-6 items-center justify-center rounded bg-yellow-950/80 border border-yellow-500/70 text-yellow-300 font-bold text-[10px] animate-pulse">
                                  ⏳
                                </span>
                              </td>
                            );
                          }

                          if (sub.status === 'reviewed') {
                            const score = sub.score;
                            let colorClass =
                              'bg-emerald-950/80 border-emerald-500/70 text-emerald-300';
                            if (score === 4) {
                              colorClass = 'bg-teal-950/80 border-teal-500/70 text-teal-300';
                            } else if (score === 3) {
                              colorClass = 'bg-amber-950/80 border-amber-500/70 text-amber-300';
                            } else if (score === 2) {
                              colorClass = 'bg-rose-950/80 border-rose-500/70 text-rose-300';
                            }

                            return (
                              <td
                                key={task.id}
                                className="p-1 border-r border-zinc-800/60 text-center cursor-pointer"
                                onClick={() => setSelectedSub(sub)}
                                title={`${task.module_code} №${task.task_number}: ${score} б. (${sub.is_passed ? 'Зачтено' : 'Не зачтено'})`}
                              >
                                <span
                                  className={`inline-flex w-7 h-6 items-center justify-center rounded border font-bold text-xs transition-transform hover:scale-110 shadow-sm ${colorClass}`}
                                >
                                  {score !== null ? score : '✓'}
                                </span>
                              </td>
                            );
                          }

                          if (sub.status === 'rejected') {
                            return (
                              <td
                                key={task.id}
                                className="p-1 border-r border-zinc-800/60 text-center cursor-pointer"
                                onClick={() => setSelectedSub(sub)}
                                title={`${task.module_code} №${task.task_number}: На доработку`}
                              >
                                <span className="inline-flex w-7 h-6 items-center justify-center rounded bg-rose-950/80 border border-rose-500/70 text-rose-300 font-bold text-[10px] hover:scale-110">
                                  {sub.score !== null ? sub.score : '2'}
                                </span>
                              </td>
                            );
                          }

                          return (
                            <td
                              key={task.id}
                              className="p-1 border-r border-zinc-800/60 text-center text-zinc-700"
                            >
                              —
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: PROGRESS CARDS VIEW */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStudents.length === 0 ? (
            <div className="col-span-2 p-10 border border-zinc-800 text-center text-zinc-500 font-mono">
              Студентов по заданным критериям не найдено.
            </div>
          ) : (
            filteredStudents.map(student => {
              const studentSubs = tasks.map(t => ({
                task: t,
                submission: subMap.get(`${student.id}:${t.id}`),
              }));

              const passedTasks = studentSubs.filter(
                s => s.submission?.status === 'reviewed' && s.submission.is_passed
              );
              const pendingTasks = studentSubs.filter(s => s.submission?.status === 'pending');
              const totalScore = passedTasks.reduce(
                (acc, s) => acc + (s.submission?.score || 0),
                0
              );
              const progressPct = Math.round((passedTasks.length / tasks.length) * 100);

              return (
                <div
                  key={student.id}
                  className="border border-zinc-800 bg-zinc-900/60 p-4 space-y-3 font-mono"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-zinc-800 pb-3">
                    <div>
                      <h3 className="font-bold text-white text-sm flex items-center gap-2">
                        <User className="w-4 h-4 text-emerald-400" />
                        <span>{student.full_name}</span>
                      </h3>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        Группа:{' '}
                        <span className="text-zinc-200 font-bold">{student.group_name}</span> •
                        Логин: {student.username}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-emerald-400">{totalScore} б.</div>
                      <div className="text-[11px] text-zinc-400">
                        {passedTasks.length} из {tasks.length} сдано
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-zinc-400">
                      <span>Общая готовность:</span>
                      <span className="font-bold text-zinc-200">{progressPct}%</span>
                    </div>
                    <div className="w-full bg-zinc-950 h-2 rounded overflow-hidden border border-zinc-800">
                      <div
                        className="bg-emerald-500 h-full transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Tasks Quick Badges */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Сетка заданий (32):</span>
                      {pendingTasks.length > 0 && (
                        <span className="text-yellow-400 font-bold">
                          {pendingTasks.length} на проверке
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-8 sm:grid-cols-11 gap-1">
                      {studentSubs.map(({ task, submission }) => {
                        if (!submission) {
                          return (
                            <div
                              key={task.id}
                              className="h-6 bg-zinc-950 border border-zinc-800/60 text-zinc-700 flex items-center justify-center text-[9px] rounded-sm select-none"
                              title={`${task.module_code} №${task.task_number}: Не сдавал`}
                            >
                              {task.task_number}
                            </div>
                          );
                        }

                        if (submission.status === 'pending') {
                          return (
                            <button
                              key={task.id}
                              type="button"
                              onClick={() => setSelectedSub(submission)}
                              className="h-6 bg-yellow-950 border border-yellow-500/70 text-yellow-300 font-bold flex items-center justify-center text-[9px] rounded-sm animate-pulse cursor-pointer"
                              title={`${task.module_code} №${task.task_number}: На проверке`}
                            >
                              {task.task_number}⏳
                            </button>
                          );
                        }

                        const score = submission.score;
                        let color = 'bg-emerald-950 border-emerald-500 text-emerald-300';
                        if (score === 4) color = 'bg-teal-950 border-teal-500 text-teal-300';
                        if (score === 3) color = 'bg-amber-950 border-amber-500 text-amber-300';
                        if (score === 2 || !submission.is_passed)
                          color = 'bg-rose-950 border-rose-500 text-rose-300';

                        return (
                          <button
                            key={task.id}
                            type="button"
                            onClick={() => setSelectedSub(submission)}
                            className={`h-6 border font-bold flex items-center justify-center text-[10px] rounded-sm cursor-pointer hover:scale-105 transition ${color}`}
                            title={`${task.module_code} №${task.task_number}: ${score} б.`}
                          >
                            {score !== null ? score : task.task_number}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* QUICK PREVIEW & REVIEW MODAL */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 max-w-lg w-full p-6 shadow-2xl space-y-4 font-mono text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5">
                  Быстрый просмотр оценки
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">
                  {selectedSub.student_name}
                </h3>
                <p className="text-zinc-400 text-xs">
                  Группа: <strong className="text-zinc-200">{selectedSub.student_group}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                className="text-zinc-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 p-3 space-y-2">
              <div className="text-zinc-300 font-bold">
                {selectedSub.task_module} • Задание №{selectedSub.task_number}
              </div>
              <div className="text-zinc-400 text-[11px]">{selectedSub.task_title}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-zinc-950 p-2.5 border border-zinc-800 space-y-0.5">
                <span className="text-zinc-500 text-[10px] uppercase block">Статус:</span>
                <span className="font-bold text-white">
                  {selectedSub.status === 'pending'
                    ? '⏳ На проверке'
                    : selectedSub.status === 'reviewed'
                      ? '✓ Проверено'
                      : '✗ На доработку'}
                </span>
              </div>

              <div className="bg-zinc-950 p-2.5 border border-zinc-800 space-y-0.5">
                <span className="text-zinc-500 text-[10px] uppercase block">Оценка:</span>
                <span className="font-bold text-emerald-400 text-sm">
                  {selectedSub.score !== null
                    ? `${selectedSub.score} из 5 баллов`
                    : 'Не выставлена'}
                </span>
              </div>

              <div className="bg-zinc-950 p-2.5 border border-zinc-800 space-y-0.5">
                <span className="text-zinc-500 text-[10px] uppercase block">Дата сдачи:</span>
                <span className="text-zinc-300">
                  {new Date(selectedSub.submitted_at).toLocaleString('ru-RU')}
                </span>
              </div>

              <div className="bg-zinc-950 p-2.5 border border-zinc-800 space-y-0.5">
                <span className="text-zinc-500 text-[10px] uppercase block">Рецензент:</span>
                <span className="text-zinc-300">{selectedSub.reviewer_name || 'Не назначен'}</span>
              </div>
            </div>

            {selectedSub.feedback && (
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase font-bold">
                  Замечания преподавателя:
                </span>
                <div className="p-2.5 bg-zinc-950 border border-zinc-800 text-zinc-200 text-[11px] leading-relaxed max-h-28 overflow-y-auto">
                  {selectedSub.feedback}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-zinc-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedSub(null)}
                className="text-xs"
              >
                Закрыть
              </Button>

              <Link href={`/admin/submissions/${selectedSub.id}`}>
                <Button variant="primary" size="sm" className="flex items-center gap-1.5 text-xs">
                  <span>Перейти к проверке / рецензии</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
