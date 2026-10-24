'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SubmissionWithDetails, Task, ModuleInfo, StudentWithStats } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import {
  Download,
  Search,
  ExternalLink,
  Clock,
  CheckCircle2,
  Table,
  LayoutGrid,
  Award,
  X,
  User,
  BookOpen,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  Users,
  CheckCheck,
  Loader2,
  Sparkles,
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
  const router = useRouter();

  // Overrides for immediate optimistic UI update after bulk actions
  const [overrideSubmissions, setOverrideSubmissions] = useState<SubmissionWithDetails[] | null>(
    null
  );
  const [overrideStudents, setOverrideStudents] = useState<StudentWithStats[] | null>(null);

  const currentSubmissions = overrideSubmissions ?? submissions;
  const currentStudents = overrideStudents ?? students;

  // Bulk grade modal state
  const [isBulkModalOpen, setIsBulkModalOpen] = useState<boolean>(false);
  const [bulkScope, setBulkScope] = useState<'group' | 'all' | 'student'>('group');
  const [bulkTargetStudentId, setBulkTargetStudentId] = useState<string>('');
  const [isBulkLoading, setIsBulkLoading] = useState<boolean>(false);
  const [bulkSuccessMsg, setBulkSuccessMsg] = useState<string | null>(null);

  // Select first available group by default (no "Все группы")
  const [selectedGroup, setSelectedGroup] = useState<string>(
    availableGroups.length > 0 ? availableGroups[0] : ''
  );
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [groupSearchQuery, setGroupSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'passed'>('name');
  const [viewMode, setViewMode] = useState<'matrix' | 'cards'>('matrix');
  const [academicYear, setAcademicYear] = useState<string>('2026/2027');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [highlightedStudentId, setHighlightedStudentId] = useState<string | null>(null);

  // Selected submission modal for instant inspection
  const [selectedSub, setSelectedSub] = useState<SubmissionWithDetails | null>(null);

  const highlightedStudent = useMemo(() => {
    const targetId = bulkTargetStudentId || highlightedStudentId;
    if (!targetId) return null;
    return currentStudents.find(s => s.id === targetId) || null;
  }, [currentStudents, bulkTargetStudentId, highlightedStudentId]);

  const handleBulkGradeFive = async (
    overrideScope?: 'group' | 'all' | 'student',
    overrideStudentId?: string
  ) => {
    const activeScope = overrideScope || bulkScope;
    const activeStudentId =
      overrideStudentId || bulkTargetStudentId || highlightedStudentId || undefined;

    try {
      setIsBulkLoading(true);
      const res = await fetch('/api/admin/submissions/bulk-grade-five', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scope: activeScope,
          groupId: selectedGroup,
          studentId: activeStudentId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Ошибка при закрытии работ на 5');
        return;
      }

      if (data.submissions) {
        setOverrideSubmissions(data.submissions);
      }
      if (data.students) {
        setOverrideStudents(data.students);
      }

      setBulkSuccessMsg(
        `Успешно закрыто на «5»: ${data.count} заданий у ${data.studentsCount} студ.!`
      );
      setTimeout(() => {
        setBulkSuccessMsg(null);
        setIsBulkModalOpen(false);
      }, 1500);

      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Ошибка при выполнении операции');
    } finally {
      setIsBulkLoading(false);
    }
  };

  // Quick lookup map: `${userId}:${taskId}` -> Submission
  const subMap = useMemo(() => {
    const map = new Map<string, SubmissionWithDetails>();
    for (const s of currentSubmissions) {
      map.set(`${s.user_id}:${s.task_id}`, s);
    }
    return map;
  }, [currentSubmissions]);

  // Map of pending submissions count per student
  const studentPendingMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const sub of currentSubmissions) {
      if (sub.status === 'pending') {
        map.set(sub.user_id, (map.get(sub.user_id) || 0) + 1);
      }
    }
    return map;
  }, [currentSubmissions]);

  const studentPendingCount = (studentId: string) => studentPendingMap.get(studentId) || 0;

  // Aggregate stats per group for the sidebar
  const groupStats = useMemo(() => {
    const map = new Map<
      string,
      { studentCount: number; passedCount: number; pendingCount: number }
    >();

    for (const s of currentStudents) {
      const grp = s.group_name || 'Без группы';
      if (!map.has(grp)) {
        map.set(grp, { studentCount: 0, passedCount: 0, pendingCount: 0 });
      }
      const item = map.get(grp)!;
      item.studentCount++;
      item.passedCount += s.passed_count;
    }

    for (const sub of currentSubmissions) {
      const grp = sub.student_group || 'Без группы';
      if (map.has(grp) && sub.status === 'pending') {
        map.get(grp)!.pendingCount++;
      }
    }

    return map;
  }, [currentStudents, currentSubmissions]);

  // Filter tasks based on selected module
  const filteredTasks = useMemo(() => {
    if (selectedModule === 'ALL') return tasks;
    return tasks.filter(t => t.module_id === selectedModule);
  }, [tasks, selectedModule]);

  // Filter groups in the sidebar by groupSearchQuery
  const filteredSidebarGroups = useMemo(() => {
    if (!groupSearchQuery.trim()) return availableGroups;
    const q = groupSearchQuery.toLowerCase();
    return availableGroups.filter(g => g.toLowerCase().includes(q));
  }, [availableGroups, groupSearchQuery]);

  // Filter students in the sidebar by selectedGroup and groupSearchQuery
  const sidebarStudents = useMemo(() => {
    return currentStudents.filter(s => {
      if (selectedGroup && s.group_name !== selectedGroup) {
        return false;
      }
      if (groupSearchQuery.trim()) {
        const q = groupSearchQuery.toLowerCase();
        const matchName = s.full_name.toLowerCase().includes(q);
        const matchGroup = s.group_name.toLowerCase().includes(q);
        const matchUser = s.username.toLowerCase().includes(q);
        if (!matchName && !matchGroup && !matchUser) return false;
      }
      return true;
    });
  }, [currentStudents, selectedGroup, groupSearchQuery]);

  // Filter and sort students for the main table/cards
  const filteredStudents = useMemo(() => {
    let result = currentStudents.filter(s => {
      if (selectedGroup && s.group_name !== selectedGroup) {
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
      if (a.group_name !== b.group_name) {
        return a.group_name.localeCompare(b.group_name);
      }
      return a.full_name.localeCompare(b.full_name);
    });

    return result;
  }, [currentStudents, selectedGroup, searchQuery, sortBy]);

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

    for (const sub of currentSubmissions) {
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
  }, [filteredStudents, filteredTasks, currentSubmissions]);

  // Export CSV URL
  const exportUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (selectedGroup) params.set('group', selectedGroup);
    if (selectedModule !== 'ALL') params.set('module', selectedModule);
    const qs = params.toString();
    return `/api/admin/export-csv${qs ? `?${qs}` : ''}`;
  }, [selectedGroup, selectedModule]);

  // Handler to scroll and highlight a student in the table
  const handleStudentClick = (studentId: string) => {
    if (highlightedStudentId === studentId) {
      setHighlightedStudentId(null);
    } else {
      setHighlightedStudentId(studentId);
      const el = document.getElementById(`student-row-${studentId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div
      className={
        isFullscreen
          ? 'fixed inset-0 z-50 bg-zinc-950 p-3 sm:p-5 overflow-y-auto w-screen h-screen'
          : 'w-full space-y-4'
      }
    >
      {/* Top Header / Actions Bar */}
      <div className="border border-zinc-800 bg-zinc-900/90 p-3.5 space-y-3 font-mono">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0">
              <Table className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 flex-wrap">
                <span>Сводная ведомость оценок</span>
                {selectedGroup && (
                  <span className="text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded text-[11px]">
                    Группа {selectedGroup}
                  </span>
                )}
                {selectedModule !== 'ALL' && (
                  <span className="text-sky-400 font-bold bg-sky-950/80 border border-sky-500/30 px-2 py-0.5 rounded text-[11px]">
                    {modules.find(m => m.id === selectedModule)?.code}
                  </span>
                )}
              </h2>
              <p className="text-xs text-zinc-400">
                Интерактивная таблица 32 заданий с быстрой проверкой без скачивания CSV
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-2.5 py-1.5 border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono flex items-center gap-1.5 rounded transition cursor-pointer"
              title={isFullscreen ? 'Свернуть' : 'Развернуть на весь экран'}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Свернуть</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>На весь экран</span>
                </>
              )}
            </button>

            {/* Toggle Sidebar */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="px-2.5 py-1.5 border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono flex items-center gap-1.5 rounded transition cursor-pointer"
              title={isSidebarOpen ? 'Скрыть панель журнала' : 'Показать панель журнала'}
            >
              {isSidebarOpen ? (
                <>
                  <PanelLeftClose className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="hidden sm:inline">Скрыть журнал</span>
                </>
              ) : (
                <>
                  <PanelLeftOpen className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="hidden sm:inline">Журнал</span>
                </>
              )}
            </button>

            {/* View Mode Toggle */}
            <div className="inline-flex rounded border border-zinc-800 bg-zinc-950 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('matrix')}
                className={`px-3 py-1 flex items-center gap-1.5 transition cursor-pointer rounded-sm ${
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
                className={`px-3 py-1 flex items-center gap-1.5 transition cursor-pointer rounded-sm ${
                  viewMode === 'cards'
                    ? 'bg-zinc-800 text-white font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Карточки</span>
              </button>
            </div>

            {/* Bulk Close All on 5 Button */}
            <button
              type="button"
              onClick={() => {
                setBulkScope('group');
                setBulkTargetStudentId('');
                setIsBulkModalOpen(true);
              }}
              className="px-2.5 py-1.5 border border-emerald-500/80 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 text-xs font-mono font-bold flex items-center gap-1.5 rounded transition cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.25)] hover:shadow-[0_0_16px_rgba(16,185,129,0.4)]"
              title="Закрыть все 32 задания на оценку 5"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Закрыть все на 5</span>
            </button>

            {/* CSV Export Button */}
            <a href={exportUrl} download>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 font-mono text-xs"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>CSV</span>
              </Button>
            </a>
          </div>
        </div>

        {/* Filter Controls (Module, Search student, Sort) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-zinc-800/80 text-xs">
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
              Поиск по студентам:
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

      {/* Main Content Area: Left Sidebar 'Журнал' + Right Table */}
      <div className="flex flex-col lg:flex-row items-start gap-4 w-full">
        {/* LEFT COLUMN: ЖУРНАЛ С ГРУППАМИ И СТУДЕНТАМИ */}
        {isSidebarOpen && (
          <aside className="w-full lg:w-80 xl:w-80 2xl:w-96 shrink-0 border border-zinc-800 bg-zinc-950 p-3.5 space-y-3.5 font-mono text-xs rounded shadow-2xl lg:sticky lg:top-16">
            {/* Header: Title 'Журнал' + Year Dropdown */}
            <div className="flex items-center justify-between gap-2 border-b border-zinc-800/80 pb-2.5">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-zinc-300" />
                <h3 className="font-bold text-white text-sm">Журнал</h3>
              </div>

              <div className="relative">
                <select
                  value={academicYear}
                  onChange={e => setAcademicYear(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700/80 text-zinc-200 text-[11px] font-bold px-2 py-1 pr-6 rounded focus:outline-none focus:border-zinc-500 appearance-none cursor-pointer"
                >
                  <option value="2026/2027">2026/2027</option>
                  <option value="2025/2026">2025/2026</option>
                  <option value="КОД 2026">КОД 2026</option>
                </select>
                <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-1.5 top-2 pointer-events-none" />
              </div>
            </div>

            {/* Search Input for Groups & Students */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={groupSearchQuery}
                onChange={e => setGroupSearchQuery(e.target.value)}
                placeholder="Поиск по группам и студентам..."
                className="w-full bg-zinc-900/90 border border-zinc-800 text-zinc-200 pl-8 pr-3 py-1.5 rounded text-xs placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 font-mono"
              />
            </div>

            {/* SECTION 1: Groups Selector (ONLY Individual Groups, no 'Все группы') */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1 font-bold uppercase tracking-wider">
                <span>Группы:</span>
                <span className="text-zinc-500 font-normal">{availableGroups.length}</span>
              </div>

              <div className="space-y-1.5 max-h-[190px] overflow-y-auto pr-1">
                {filteredSidebarGroups.map(grp => {
                  const gStat = groupStats.get(grp) || {
                    studentCount: 0,
                    passedCount: 0,
                    pendingCount: 0,
                  };
                  const isSelected = selectedGroup === grp;

                  return (
                    <button
                      key={grp}
                      type="button"
                      onClick={() => setSelectedGroup(grp)}
                      className={`w-full text-left p-2 rounded transition cursor-pointer text-xs ${
                        isSelected
                          ? 'bg-[#1e3a5f] border border-[#3b82f6] text-white font-bold shadow-[0_0_10px_rgba(30,58,95,0.6)]'
                          : 'bg-zinc-900/90 hover:bg-zinc-800/90 text-zinc-300 border border-zinc-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{grp}</span>
                        {gStat.pendingCount > 0 && (
                          <span className="text-[9px] bg-yellow-950 text-yellow-300 border border-yellow-500/50 px-1 py-0.2 rounded animate-pulse">
                            {gStat.pendingCount} ⏳
                          </span>
                        )}
                      </div>
                      <div
                        className={`text-[10px] font-normal mt-0.5 flex items-center justify-between ${
                          isSelected ? 'text-blue-200' : 'text-zinc-400'
                        }`}
                      >
                        <span>Сетевое администрирование</span>
                        <span>{gStat.studentCount} студ.</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION 2: Students of the selected group (interactive quick selection) */}
            <div className="space-y-2 pt-2.5 border-t border-zinc-800/80">
              <div className="flex items-center justify-between text-[11px] px-1">
                <span className="text-zinc-200 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Студенты ({selectedGroup || 'Группа не выбрана'})</span>
                </span>
                <span className="text-zinc-400 font-bold">{sidebarStudents.length} чел.</span>
              </div>

              <div className="space-y-1.5 max-h-[calc(100vh-450px)] min-h-[220px] overflow-y-auto pr-1">
                {sidebarStudents.length === 0 ? (
                  <div className="text-center text-zinc-500 text-[11px] py-8">
                    Студентов в этой группе не найдено
                  </div>
                ) : (
                  sidebarStudents.map(student => {
                    const pendingForStudent = studentPendingCount(student.id);
                    const isHighlighted = highlightedStudentId === student.id;

                    return (
                      <div
                        key={student.id}
                        onClick={() => handleStudentClick(student.id)}
                        className={`p-2 rounded border transition-all cursor-pointer text-xs select-none ${
                          isHighlighted
                            ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)] ring-2 ring-emerald-500'
                            : 'bg-zinc-900/80 hover:bg-zinc-800/90 border-zinc-800 text-zinc-200'
                        }`}
                        title="Нажмите, чтобы выделить студента в таблице"
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <div className="font-bold truncate text-[11px] text-white hover:text-emerald-300 transition">
                            {student.full_name}
                          </div>
                          <span className="text-emerald-400 font-bold text-[11px] shrink-0">
                            {student.total_score} б.
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-1">
                          <span>{student.group_name}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-zinc-300 font-semibold">
                              {student.passed_count}/32 сдано
                            </span>
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                setBulkScope('student');
                                setBulkTargetStudentId(student.id);
                                setIsBulkModalOpen(true);
                              }}
                              className="px-1 py-0.5 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-[9px] font-bold flex items-center gap-0.5 transition cursor-pointer"
                              title="Закрыть все 32 задания студента на 5"
                            >
                              <CheckCheck className="w-2.5 h-2.5" />
                              <span>Все на 5</span>
                            </button>
                          </div>
                        </div>

                        {pendingForStudent > 0 && (
                          <div className="mt-1 pt-1 border-t border-zinc-800/60 flex items-center gap-1 text-[10px] text-yellow-300 font-bold">
                            <Clock className="w-3 h-3 text-yellow-400" />
                            <span>{pendingForStudent} на проверке</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </aside>
        )}

        {/* RIGHT COLUMN: The Table / Cards (Takes all available width) */}
        <div className="flex-1 min-w-0 w-full space-y-4">
          {/* KPI Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
            <div className="border border-zinc-800 bg-zinc-900/60 p-2.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase block">Студентов</span>
                <span className="text-base font-bold text-white">{stats.totalStudents}</span>
              </div>
              <User className="w-4 h-4 text-zinc-500" />
            </div>

            <div className="border border-zinc-800 bg-zinc-900/60 p-2.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase block">Зачтено заданий</span>
                <span className="text-base font-bold text-emerald-400">
                  {stats.totalPassedSubs}
                </span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>

            <div className="border border-zinc-800 bg-zinc-900/60 p-2.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase block">На проверке</span>
                <span
                  className={`text-base font-bold ${
                    stats.pendingInScope > 0 ? 'text-amber-400' : 'text-zinc-400'
                  }`}
                >
                  {stats.pendingInScope}
                </span>
              </div>
              <Clock
                className={`w-4 h-4 ${
                  stats.pendingInScope > 0 ? 'text-amber-400' : 'text-zinc-600'
                }`}
              />
            </div>

            <div className="border border-zinc-800 bg-zinc-900/60 p-2.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase block">Ср. балл / Сдача</span>
                <span className="text-base font-bold text-cyan-300">
                  {stats.avgScore} б. • {stats.avgPassed} зад.
                </span>
              </div>
              <Award className="w-4 h-4 text-cyan-400" />
            </div>
          </div>

          {/* Original SUDOSTUDY Status Legend */}
          <div className="border border-zinc-800 bg-zinc-950/80 p-2.5 flex items-center gap-3 flex-wrap font-mono text-[11px] text-zinc-400">
            <span className="font-bold uppercase tracking-wider text-zinc-300">Легенда:</span>
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
              <span>Удовл.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-rose-950 border border-rose-500/70 text-rose-300 font-bold flex items-center justify-center text-[10px]">
                2
              </span>
              <span>На доработку</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-yellow-950 border border-yellow-500/70 text-yellow-300 font-bold flex items-center justify-center text-[10px] animate-pulse">
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
          </div>

          {/* VIEW 1: MATRIX FULL-SCREEN TABLE */}
          {viewMode === 'matrix' && (
            <div className="border border-zinc-800 bg-zinc-900/40 w-full overflow-hidden shadow-xl">
              <div
                className={`overflow-x-auto overflow-y-auto relative ${
                  isFullscreen
                    ? 'max-h-[calc(100vh-250px)]'
                    : 'max-h-[calc(100vh-280px)] min-h-[480px]'
                }`}
              >
                <table className="w-full text-left font-mono border-collapse text-xs">
                  <thead className="bg-zinc-950 text-zinc-300 uppercase sticky top-0 z-30 shadow-md">
                    {/* Super Header: Grouping by Module */}
                    <tr className="border-b border-zinc-800 text-[10px]">
                      <th
                        className="p-2.5 sticky left-0 bg-zinc-950 z-40 border-r border-zinc-800 min-w-[210px]"
                        colSpan={2}
                      >
                        Студент / Группа
                      </th>
                      <th
                        className="p-2 border-r border-zinc-800 text-center bg-zinc-950/90"
                        colSpan={4}
                      >
                        Сводка
                      </th>
                      {selectedModule === 'ALL' || selectedModule === 'module-1' ? (
                        <th
                          className="p-2 border-r border-zinc-800 text-center bg-sky-950/50 text-sky-300 font-bold"
                          colSpan={tasks.filter(t => t.module_id === 'module-1').length}
                        >
                          Модуль 1: Сетевая инфраструктура (11 заданий)
                        </th>
                      ) : null}
                      {selectedModule === 'ALL' || selectedModule === 'module-2' ? (
                        <th
                          className="p-2 border-r border-zinc-800 text-center bg-amber-950/50 text-amber-300 font-bold"
                          colSpan={tasks.filter(t => t.module_id === 'module-2').length}
                        >
                          Модуль 2: Системное администрирование (11 заданий)
                        </th>
                      ) : null}
                      {selectedModule === 'ALL' || selectedModule === 'module-3' ? (
                        <th
                          className="p-2 border-r border-zinc-800 text-center bg-emerald-950/50 text-emerald-300 font-bold"
                          colSpan={tasks.filter(t => t.module_id === 'module-3').length}
                        >
                          Модуль 3: Информационная безопасность (10 заданий)
                        </th>
                      ) : null}
                    </tr>

                    {/* Task Numbers Sub-header */}
                    <tr className="border-b border-zinc-800 text-[11px]">
                      <th className="p-2.5 sticky left-0 bg-zinc-950 z-40 border-r border-zinc-800">
                        ФИО студента
                      </th>
                      <th className="p-2 border-r border-zinc-800 text-center min-w-[75px]">
                        Группа
                      </th>
                      <th className="p-2 border-r border-zinc-800 text-center min-w-[65px] text-emerald-400">
                        Сдано
                      </th>
                      <th className="p-2 border-r border-zinc-800 text-center min-w-[55px] text-cyan-400">
                        %
                      </th>
                      <th className="p-2 border-r border-zinc-800 text-center min-w-[65px] text-white">
                        Балл
                      </th>
                      <th className="p-2 border-r border-zinc-800 text-center min-w-[55px] text-zinc-400">
                        Ср.
                      </th>

                      {filteredTasks.map(t => (
                        <th
                          key={t.id}
                          className="p-1.5 border-r border-zinc-800/80 text-center min-w-[42px] max-w-[48px] hover:bg-zinc-900 transition cursor-help"
                          title={`${t.module_code} №${t.task_number}: ${t.title}`}
                        >
                          <span className="text-[9px] block font-bold text-zinc-400">
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
                        const avg =
                          passedCount > 0 ? (studentScoreSum / passedCount).toFixed(1) : '—';
                        const isHighlighted = highlightedStudentId === student.id;

                        return (
                          <tr
                            key={student.id}
                            id={`student-row-${student.id}`}
                            className={`transition-colors ${
                              isHighlighted
                                ? 'bg-emerald-950/60 ring-2 ring-emerald-500 font-semibold'
                                : 'hover:bg-zinc-800/40'
                            }`}
                          >
                            {/* Sticky Left Name column */}
                            <td
                              className={`p-2.5 sticky left-0 z-20 border-r border-zinc-800 whitespace-nowrap shadow-[3px_0_8px_rgba(0,0,0,0.6)] ${
                                isHighlighted ? 'bg-zinc-800 text-emerald-300' : 'bg-zinc-900'
                              }`}
                            >
                              <div className="font-bold text-white hover:text-emerald-400 transition">
                                {student.full_name}
                              </div>
                              <div className="text-[10px] text-zinc-500 font-mono">
                                {student.username}
                              </div>
                            </td>

                            {/* Group badge */}
                            <td className="p-2 border-r border-zinc-800 text-center whitespace-nowrap text-zinc-300">
                              <span className="bg-zinc-950 border border-zinc-800 px-1.5 py-0.5 rounded text-[10px]">
                                {student.group_name}
                              </span>
                            </td>

                            {/* Passed / Total */}
                            <td className="p-2 border-r border-zinc-800 text-center whitespace-nowrap font-bold text-emerald-400">
                              {passedCount}/{filteredTasks.length}
                            </td>

                            {/* Percentage */}
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

                            {/* Total Score */}
                            <td className="p-2 border-r border-zinc-800 text-center whitespace-nowrap font-bold text-white">
                              {studentScoreSum} б.
                            </td>

                            {/* Average */}
                            <td className="p-2 border-r border-zinc-800 text-center whitespace-nowrap text-zinc-400">
                              {avg}
                            </td>

                            {/* 32 Task cells with original SUDOSTUDY design */}
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
                                    title={`${task.module_code} №${task.task_number}: На проверке`}
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
                                } else if (score === 2 || !sub.is_passed) {
                                  colorClass = 'bg-rose-950/80 border-rose-500/70 text-rose-300';
                                }

                                return (
                                  <td
                                    key={task.id}
                                    className="p-1 border-r border-zinc-800/60 text-center cursor-pointer"
                                    onClick={() => setSelectedSub(sub)}
                                    title={`${task.module_code} №${task.task_number}: ${score} б.`}
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
                  let totalScore = 0;
                  const studentSubs = tasks.map(task => {
                    const sub = subMap.get(`${student.id}:${task.id}`);
                    if (sub && sub.status === 'reviewed' && sub.is_passed) {
                      totalScore += sub.score || 0;
                    }
                    return { task, submission: sub };
                  });

                  const passedTasks = studentSubs.filter(
                    s => s.submission?.status === 'reviewed' && s.submission?.is_passed
                  );
                  const pendingTasks = studentSubs.filter(s => s.submission?.status === 'pending');
                  const progressPct = Math.round((passedTasks.length / tasks.length) * 100);

                  return (
                    <div
                      key={student.id}
                      className="border border-zinc-800 bg-zinc-900/70 p-4 space-y-3 font-mono hover:border-zinc-700 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-white text-sm hover:text-emerald-400 transition">
                            {student.full_name}
                          </h3>
                          <div className="text-[11px] text-zinc-400 mt-0.5">
                            Группа:{' '}
                            <span className="text-zinc-200 font-bold">{student.group_name}</span> •{' '}
                            {student.username}
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
        </div>
      </div>

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
                className="text-zinc-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-zinc-950 p-2.5 border border-zinc-800 space-y-0.5">
                <span className="text-zinc-500 text-[10px] uppercase block">Задание:</span>
                <span className="text-white font-bold">
                  {selectedSub.task_module?.toUpperCase()} №{selectedSub.task_number}:{' '}
                  {selectedSub.task_title}
                </span>
              </div>

              <div className="bg-zinc-950 p-2.5 border border-zinc-800 space-y-0.5">
                <span className="text-zinc-500 text-[10px] uppercase block">Статус работы:</span>
                <span className="font-bold text-white">
                  {selectedSub.status === 'reviewed' && selectedSub.is_passed && (
                    <span className="text-emerald-400">✓ Зачтено</span>
                  )}
                  {selectedSub.status === 'reviewed' && !selectedSub.is_passed && (
                    <span className="text-rose-400">✗ Не зачтено</span>
                  )}
                  {selectedSub.status === 'pending' && (
                    <span className="text-amber-400">⏳ Ожидает проверки преподавателя</span>
                  )}
                  {selectedSub.status === 'rejected' && (
                    <span className="text-rose-400">✗ Отправлено на доработку</span>
                  )}
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

              {selectedSub.feedback && (
                <div className="bg-zinc-950 p-2.5 border border-zinc-800 space-y-0.5">
                  <span className="text-zinc-500 text-[10px] uppercase block">
                    Комментарий преподавателя:
                  </span>
                  <p className="text-zinc-300 italic">{selectedSub.feedback}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800 gap-2 flex-wrap">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setBulkScope('student');
                  setBulkTargetStudentId(selectedSub.user_id);
                  setIsBulkModalOpen(true);
                }}
                className="text-xs border-emerald-500/50 text-emerald-300 hover:bg-emerald-950/60 flex items-center gap-1.5"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Закрыть все 32 работы студента на 5</span>
              </Button>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/submissions/${selectedSub.id}`}
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition underline underline-offset-4"
                >
                  <span>Проверка отчета</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedSub(null)}
                  className="text-xs"
                >
                  Закрыть
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BULK GRADE 5 MODAL */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 max-w-md w-full p-6 shadow-2xl space-y-4 font-mono text-xs animate-in fade-in zoom-in-95 duration-150 rounded">
            <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-emerald-950 border border-emerald-500/60 flex items-center justify-center text-emerald-400">
                  <CheckCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Закрытие всех работ на «5»</h3>
                  <p className="text-[11px] text-zinc-400">Массовое выставление оценки «Отлично»</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !isBulkLoading && setIsBulkModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 cursor-pointer"
                disabled={isBulkLoading}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {bulkSuccessMsg ? (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-center font-bold rounded">
                ✓ {bulkSuccessMsg}
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <span className="text-[11px] uppercase text-zinc-400 font-bold block">
                    Выберите область применения:
                  </span>

                  <label className="flex items-start gap-2.5 p-2.5 rounded border border-zinc-800 bg-zinc-950/80 hover:border-zinc-700 cursor-pointer transition">
                    <input
                      type="radio"
                      name="bulkScope"
                      value="group"
                      checked={bulkScope === 'group'}
                      onChange={() => setBulkScope('group')}
                      className="mt-0.5 cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-zinc-200">
                        Для текущей группы:{' '}
                        <span className="text-emerald-400">{selectedGroup || 'Не выбрана'}</span>
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        Все 32 задания у каждого студента группы {selectedGroup} получат оценку 5
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-2.5 rounded border border-zinc-800 bg-zinc-950/80 hover:border-zinc-700 cursor-pointer transition">
                    <input
                      type="radio"
                      name="bulkScope"
                      value="all"
                      checked={bulkScope === 'all'}
                      onChange={() => setBulkScope('all')}
                      className="mt-0.5 cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-zinc-200">Для всех групп и студентов</div>
                      <div className="text-[10px] text-zinc-400">
                        Закрыть абсолютно все работы всех {currentStudents.length} студентов базы
                      </div>
                    </div>
                  </label>

                  {highlightedStudent && (
                    <label className="flex items-start gap-2.5 p-2.5 rounded border border-zinc-800 bg-zinc-950/80 hover:border-zinc-700 cursor-pointer transition">
                      <input
                        type="radio"
                        name="bulkScope"
                        value="student"
                        checked={bulkScope === 'student'}
                        onChange={() => setBulkScope('student')}
                        className="mt-0.5 cursor-pointer"
                      />
                      <div>
                        <div className="font-bold text-zinc-200">
                          Только для студента:{' '}
                          <span className="text-emerald-400">{highlightedStudent.full_name}</span>
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          Закрыть все 32 задания на 5 только данному студенту (
                          {highlightedStudent.group_name})
                        </div>
                      </div>
                    </label>
                  )}
                </div>

                <div className="p-2.5 bg-amber-950/40 border border-amber-500/40 text-amber-200 text-[11px] rounded flex items-start gap-2">
                  <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    Все 32 задания выбранных студентов получат статус «Зачтено», максимальный балл 5
                    и автоматическую рецензию преподавателя.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isBulkLoading}
                    onClick={() => setIsBulkModalOpen(false)}
                  >
                    Отмена
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    disabled={isBulkLoading}
                    onClick={() => handleBulkGradeFive()}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                  >
                    {isBulkLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Применение...</span>
                      </>
                    ) : (
                      <>
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Закрыть работы на 5</span>
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
