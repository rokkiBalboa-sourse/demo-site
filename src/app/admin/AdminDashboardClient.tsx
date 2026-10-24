'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { SubmissionWithDetails, Task, ModuleInfo, StudentWithStats } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Download,
  FileSpreadsheet,
  Search,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Users,
  ClipboardList,
  Settings,
  GraduationCap,
  Database,
} from 'lucide-react';

import { StudentsManagementClient } from './StudentsManagementClient';
import { AdminSettingsClient } from './AdminSettingsClient';
import { GradesMatrixClient } from './GradesMatrixClient';

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
  const [activeTab, setActiveTab] = useState<'submissions' | 'grades' | 'students' | 'settings'>(
    'submissions'
  );
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [selectedTask, setSelectedTask] = useState<string>('ALL');
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTasksForSelect = useMemo(() => {
    if (selectedModule === 'ALL') return tasks;
    return tasks.filter(t => t.module_id === selectedModule);
  }, [tasks, selectedModule]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter(sub => {
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
  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const reviewedCount = submissions.filter(s => s.status === 'reviewed').length;
  const totalCount = submissions.length;

  const exportMatrixUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (selectedGroup !== 'ALL') params.set('group', selectedGroup);
    if (selectedModule !== 'ALL') params.set('module', selectedModule);
    const qs = params.toString();
    return `/api/admin/export-csv${qs ? `?${qs}` : ''}`;
  }, [selectedGroup, selectedModule]);

  const exportJournalUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set('mode', 'journal');
    if (selectedGroup !== 'ALL') params.set('group', selectedGroup);
    if (selectedModule !== 'ALL') params.set('module', selectedModule);
    if (selectedStatus !== 'ALL') params.set('status', selectedStatus);
    return `/api/admin/export-csv?${params.toString()}`;
  }, [selectedGroup, selectedModule, selectedStatus]);

  return (
    <div className="space-y-4">
      {/* Top Level Section Tabs */}
      <div className="flex items-center gap-1 border-b border-zinc-800 pb-px font-mono text-xs">
        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-3 py-2 font-medium text-xs flex items-center gap-1.5 transition-colors border-b-2 ${
            activeTab === 'submissions'
              ? 'border-white text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <ClipboardList className="w-3.5 h-3.5" />
          <span>Отчёты</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
            {submissions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('grades')}
          className={`px-3 py-2 font-medium text-xs flex items-center gap-1.5 transition-colors border-b-2 ${
            activeTab === 'grades'
              ? 'border-emerald-500 text-emerald-300'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Ведомость</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`px-3 py-2 font-medium text-xs flex items-center gap-1.5 transition-colors border-b-2 ${
            activeTab === 'students'
              ? 'border-white text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <span>Студенты</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
            {students.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-3 py-2 font-medium text-xs flex items-center gap-1.5 transition-colors border-b-2 ${
            activeTab === 'settings'
              ? 'border-white text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Настройки</span>
        </button>
      </div>

      {activeTab === 'settings' ? (
        <AdminSettingsClient />
      ) : activeTab === 'students' ? (
        <StudentsManagementClient initialStudents={students} availableGroups={availableGroups} />
      ) : activeTab === 'grades' ? (
        <GradesMatrixClient
          students={students}
          tasks={tasks}
          submissions={submissions}
          modules={modules}
          availableGroups={availableGroups}
        />
      ) : (
        <>
          {/* Submissions Top Bar & Filters */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-white font-mono">Журнал отчётов</span>
                <span className="text-xs text-zinc-400 font-mono">
                  {totalCount} всего •{' '}
                  <span className="text-amber-400">{pendingCount} на проверке</span> •{' '}
                  <span className="text-emerald-400">{reviewedCount} проверено</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a href={exportMatrixUrl} download>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs px-3 flex items-center gap-1.5 border-zinc-700 bg-zinc-900"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Ведомость (CSV)</span>
                  </Button>
                </a>
                <a href={exportJournalUrl} download>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs px-3 flex items-center gap-1.5 border-zinc-700 bg-zinc-900"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Журнал (CSV)</span>
                  </Button>
                </a>
              </div>
            </div>

            {/* Filter Bar: Compact single row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 border border-zinc-800 bg-zinc-900/50 p-2.5">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Поиск (ФИО, задание)..."
                  className="w-full h-7 border border-zinc-800 bg-zinc-950 px-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 font-mono"
                />
                <Search className="w-3 h-3 text-zinc-500 absolute right-2 top-2 pointer-events-none" />
              </div>

              <select
                value={selectedModule}
                onChange={e => {
                  setSelectedModule(e.target.value);
                  setSelectedTask('ALL');
                }}
                className="h-7 border border-zinc-800 px-2 text-xs font-mono text-zinc-200 bg-zinc-950 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Все модули</option>
                {modules.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.code} ({m.total_tasks} зад.)
                  </option>
                ))}
              </select>

              <select
                value={selectedTask}
                onChange={e => setSelectedTask(e.target.value)}
                className="h-7 border border-zinc-800 px-2 text-xs font-mono text-zinc-200 bg-zinc-950 focus:outline-none cursor-pointer truncate"
              >
                <option value="ALL">Все задания</option>
                {filteredTasksForSelect.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.module_code} №{t.task_number}: {t.title.substring(0, 24)}...
                  </option>
                ))}
              </select>

              <select
                value={selectedGroup}
                onChange={e => setSelectedGroup(e.target.value)}
                className="h-7 border border-zinc-800 px-2 text-xs font-mono text-zinc-200 bg-zinc-950 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Все группы</option>
                {availableGroups.map(g => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="h-7 border border-zinc-800 px-2 text-xs font-mono text-zinc-200 bg-zinc-950 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Все статусы</option>
                <option value="pending">На проверке ({pendingCount})</option>
                <option value="reviewed">Проверено ({reviewedCount})</option>
              </select>
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
                    <th className="py-2.5 px-4 font-semibold whitespace-nowrap">
                      Модуль / Задание
                    </th>
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
                    filteredSubmissions.map(sub => {
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
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {statusBadge}
                              {sub.allow_retake && (
                                <span className="text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 px-1.5 py-0.5">
                                  ПЕРЕСДАЧА
                                </span>
                              )}
                            </div>
                          </td>
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
