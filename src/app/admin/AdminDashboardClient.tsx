'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { SubmissionWithDetails, Task, ModuleInfo, StudentWithStats } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Download, Search, ExternalLink, Clock, CheckCircle2, AlertTriangle, Layers, Users, ClipboardList } from 'lucide-react';
import { StudentsManagementClient } from './StudentsManagementClient';

interface AdminDashboardClientProps {
  submissions: SubmissionWithDetails[];
  tasks: Task[];
  modules: ModuleInfo[];
  availableGroups: string[];
  students: StudentWithStats[];
}

export function AdminDashboardClient({
  submissions,
  tasks,
  modules,
  availableGroups,
  students,
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'submissions' | 'students'>('submissions');
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [selectedTask, setSelectedTask] = useState<string>('ALL');
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTasksForSelect = useMemo(() => {
    if (selectedModule === 'ALL') return tasks;
    return tasks.filter((t) => t.module_id === selectedModule);
  }, [tasks, selectedModule]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      if (selectedModule !== 'ALL' && sub.task_module_id !== selectedModule) {
        return false;
      }
      if (selectedTask !== 'ALL' && sub.task_id !== selectedTask) {
        return false;
      }
      if (selectedGroup !== 'ALL' && sub.student_group !== selectedGroup) {
        return false;
      }
      if (selectedStatus !== 'ALL' && sub.status !== selectedStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = sub.student_name.toLowerCase().includes(query);
        const matchGroup = sub.student_group.toLowerCase().includes(query);
        const matchTitle = sub.task_title.toLowerCase().includes(query);
        if (!matchName && !matchGroup && !matchTitle) {
          return false;
        }
      }
      return true;
    });
  }, [submissions, selectedModule, selectedTask, selectedGroup, selectedStatus, searchQuery]);

  // Statistics
  const pendingCount = submissions.filter((s) => s.status === 'pending').length;
  const reviewedCount = submissions.filter((s) => s.status === 'reviewed').length;
  const totalCount = submissions.length;

  return (
    <div className="space-y-6">
      {/* Top Level Section Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-px font-mono text-xs">
        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2.5 font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'submissions'
              ? 'border-white text-white bg-zinc-900/80'
              : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30'
          }`}
        >
          <ClipboardList className="w-3.5 h-3.5" />
          <span>Журнал отчётов ({submissions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2.5 font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'students'
              ? 'border-white text-white bg-zinc-900/80'
              : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-emerald-400" />
          <span>База студентов ({students.length})</span>
        </button>
      </div>

      {activeTab === 'students' ? (
        <StudentsManagementClient
          initialStudents={students}
          availableGroups={availableGroups}
        />
      ) : (
        <>
          {/* Top Header Actions & Stats */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-zinc-800 bg-zinc-900 p-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white font-mono">
            Журнал проверки отчётов (3 модуля • 32 задания)
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Студенческие отчёты, аудиты виртуальных стендов Proxmox VE и оценивание
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-center">
              <span className="text-zinc-500 text-[10px] block">ОТЧЁТОВ</span>
              <span className="font-bold text-zinc-200">{totalCount}</span>
            </div>
            <div className="border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-center">
              <span className="text-zinc-500 text-[10px] block">НА ПРОВЕРКЕ</span>
              <span className="font-bold text-white">{pendingCount}</span>
            </div>
            <div className="border border-emerald-500/50 bg-emerald-950/40 shadow-[0_0_14px_rgba(16,185,129,0.25)] text-emerald-300 px-2.5 py-1.5 text-center">
              <span className="text-emerald-400 text-[10px] block font-bold">ПРОВЕРЕНО</span>
              <span className="font-bold text-emerald-200">{reviewedCount}</span>
            </div>
          </div>

          <a href="/api/admin/export-csv" download="reports_summary_32_tasks.csv">
            <Button variant="primary" size="md" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span>Экспорт ведомости CSV</span>
            </Button>
          </a>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="border border-zinc-800 bg-zinc-900 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
              Поиск по ФИО / Заданию
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Иванов..."
                className="w-full h-8 border border-zinc-800 bg-zinc-950 px-2.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-400 font-mono"
              />
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Module Filter */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
              Модуль (3 модуля)
            </label>
            <select
              value={selectedModule}
              onChange={(e) => {
                setSelectedModule(e.target.value);
                setSelectedTask('ALL');
              }}
              className="w-full h-8 border border-zinc-800 px-2 text-xs font-mono text-zinc-100 bg-zinc-950 focus:outline-none focus:border-zinc-400 cursor-pointer"
            >
              <option value="ALL">Все модули</option>
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.code} ({m.total_tasks} зад.)
                </option>
              ))}
            </select>
          </div>

          {/* Task Filter */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
              Задание
            </label>
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              className="w-full h-8 border border-zinc-800 px-2 text-xs font-mono text-zinc-100 bg-zinc-950 focus:outline-none focus:border-zinc-400 cursor-pointer truncate"
            >
              <option value="ALL">Все задания</option>
              {filteredTasksForSelect.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.module_code} №{t.task_number}: {t.title.substring(0, 24)}...
                </option>
              ))}
            </select>
          </div>

          {/* Group Filter */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
              Группа
            </label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full h-8 border border-zinc-800 px-2 text-xs font-mono text-zinc-100 bg-zinc-950 focus:outline-none focus:border-zinc-400 cursor-pointer"
            >
              <option value="ALL">Все группы</option>
              {availableGroups.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
              Статус
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full h-8 border border-zinc-800 px-2 text-xs font-mono text-zinc-100 bg-zinc-950 focus:outline-none focus:border-zinc-400 cursor-pointer"
            >
              <option value="ALL">Все статусы</option>
              <option value="pending">На проверке</option>
              <option value="reviewed">Проверено</option>
              <option value="rejected">На доработку</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="border border-zinc-800 bg-zinc-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-900 border-b border-zinc-800 font-mono text-[11px] text-zinc-400 uppercase tracking-wider select-none">
                <th className="py-2.5 px-4 font-semibold">Студент</th>
                <th className="py-2.5 px-4 font-semibold">Группа</th>
                <th className="py-2.5 px-4 font-semibold whitespace-nowrap">Модуль / Задание</th>
                <th className="py-2.5 px-4 font-semibold whitespace-nowrap">Дата сдачи</th>
                <th className="py-2.5 px-4 font-semibold">Статус</th>
                <th className="py-2.5 px-4 font-semibold">Оценка</th>
                <th className="py-2.5 px-4 font-semibold text-right">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 font-mono">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500 font-mono text-xs">
                    Отчётов по выбранным критериям не найдено.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => {
                  let statusBadge = <Badge variant="neutral">НЕ СДАВАЛ</Badge>;
                  if (sub.status === 'pending') {
                    statusBadge = (
                      <Badge variant="pending" className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>НА ПРОВЕРКЕ</span>
                      </Badge>
                    );
                  } else if (sub.status === 'reviewed') {
                    statusBadge = (
                      <Badge variant="reviewed" className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>ПРОВЕРЕНО</span>
                      </Badge>
                    );
                  } else if (sub.status === 'rejected') {
                    statusBadge = (
                      <Badge variant="rejected" className="flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                        <span>НА ДОРАБОТКУ</span>
                      </Badge>
                    );
                  }

                  const formattedDate = new Date(sub.submitted_at).toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr
                      key={sub.id}
                      className="bg-zinc-950/60 hover:bg-zinc-800/60 transition-colors group border-b border-zinc-800/80 last:border-0"
                    >
                      <td className="py-3 px-4 font-medium text-white whitespace-nowrap">
                        {sub.student_name}
                      </td>
                      <td className="py-3 px-4 font-mono text-zinc-300 whitespace-nowrap">
                        <span className="bg-zinc-800 border border-zinc-700 px-1.5 py-0.5">
                          {sub.student_group}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs whitespace-nowrap">
                        <span className="inline-block bg-zinc-800 text-zinc-100 border border-zinc-700 px-2 py-0.5 font-bold">
                          {sub.task_module} - №{sub.task_number}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-zinc-500 whitespace-nowrap">
                        {formattedDate}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">{statusBadge}</td>
                      <td className="py-3 px-4 font-mono text-white">
                        {sub.score !== null ? `${sub.score} б.` : '—'}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <Link href={`/admin/submissions/${sub.id}`}>
                          <Button
                            variant={sub.status === 'pending' ? 'primary' : 'outline'}
                            size="sm"
                            className="inline-flex items-center gap-1.5"
                          >
                            <span>{sub.status === 'pending' ? 'Проверить' : 'Открыть'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
