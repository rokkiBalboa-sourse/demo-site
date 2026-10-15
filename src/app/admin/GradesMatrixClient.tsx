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
} from 'lucide-react';

interface GradesMatrixClientProps {
  students: StudentWithStats[];
  tasks: Task[];
  submissions: SubmissionWithDetails[];
  modules: ModuleInfo[];
  availableGroups: string[];
}

// Deterministic pleasing colors for student avatar circles matching INKSPO
const AVATAR_PALETTE = [
  'bg-purple-900/90 text-purple-200 border-purple-500/40',
  'bg-blue-900/90 text-blue-200 border-blue-500/40',
  'bg-emerald-900/90 text-emerald-200 border-emerald-500/40',
  'bg-amber-900/90 text-amber-200 border-amber-500/40',
  'bg-rose-900/90 text-rose-200 border-rose-500/40',
  'bg-cyan-900/90 text-cyan-200 border-cyan-500/40',
  'bg-teal-900/90 text-teal-200 border-teal-500/40',
  'bg-indigo-900/90 text-indigo-200 border-indigo-500/40',
];

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return (fullName.slice(0, 2) || '').toUpperCase();
}

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

export function GradesMatrixClient({
  students,
  tasks,
  submissions,
  modules,
  availableGroups,
}: GradesMatrixClientProps) {
  // Select 9СА-351К or ИСА-351К by default if present, else first available or 'ALL'
  const defaultGroup = useMemo(() => {
    const found351 = availableGroups.find(g => g.includes('351'));
    if (found351) return found351;
    return availableGroups[0] || 'ALL';
  }, [availableGroups]);

  const [selectedGroup, setSelectedGroup] = useState<string>(defaultGroup);
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

  // Quick lookup map: `${userId}:${taskId}` -> Submission
  const subMap = useMemo(() => {
    const map = new Map<string, SubmissionWithDetails>();
    for (const s of submissions) {
      map.set(`${s.user_id}:${s.task_id}`, s);
    }
    return map;
  }, [submissions]);

  // Map of pending submissions count per student
  const studentPendingMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const sub of submissions) {
      if (sub.status === 'pending') {
        map.set(sub.user_id, (map.get(sub.user_id) || 0) + 1);
      }
    }
    return map;
  }, [submissions]);

  // Stats per group for the left sidebar
  const groupStats = useMemo(() => {
    const map = new Map<
      string,
      { studentCount: number; passedCount: number; pendingCount: number }
    >();

    for (const s of students) {
      const grp = s.group_name || 'Без группы';
      if (!map.has(grp)) {
        map.set(grp, { studentCount: 0, passedCount: 0, pendingCount: 0 });
      }
      const item = map.get(grp)!;
      item.studentCount++;
      item.passedCount += s.passed_count;
    }

    for (const sub of submissions) {
      const grp = sub.student_group || 'Без группы';
      if (map.has(grp) && sub.status === 'pending') {
        map.get(grp)!.pendingCount++;
      }
    }

    return map;
  }, [students, submissions]);

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

  // Filter and sort students for the main table/cards
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
      return {
        totalStudents: 0,
        avgScore: 0,
        avgPassed: 0,
        pendingInScope: 0,
        totalPassedSubs: 0,
        absoluteSuccessPct: 0,
        qualitySuccessPct: 0,
      };
    }

    let totalScoreSum = 0;
    let totalPassedSum = 0;
    let pendingCount = 0;
    let studentsPassedAll = 0;
    let studentsGoodOrExcellent = 0;

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

    for (const s of filteredStudents) {
      let passed = 0;
      const scores: number[] = [];
      for (const t of filteredTasks) {
        const sub = subMap.get(`${s.id}:${t.id}`);
        if (sub && sub.status === 'reviewed' && sub.is_passed) {
          passed++;
          if (sub.score) scores.push(sub.score);
        }
      }
      if (passed > 0 && passed >= Math.floor(filteredTasks.length * 0.5)) {
        studentsPassedAll++;
      }
      const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      if (avg >= 4.0) {
        studentsGoodOrExcellent++;
      }
    }

    const avgScore = totalPassedSum > 0 ? (totalScoreSum / totalPassedSum).toFixed(1) : '0';
    const avgPassed = (totalPassedSum / totalStudents).toFixed(1);
    const absoluteSuccessPct = Math.round((studentsPassedAll / totalStudents) * 100);
    const qualitySuccessPct = Math.round((studentsGoodOrExcellent / totalStudents) * 100);

    return {
      totalStudents,
      avgScore,
      avgPassed,
      pendingInScope: pendingCount,
      totalPassedSubs: totalPassedSum,
      absoluteSuccessPct,
      qualitySuccessPct,
    };
  }, [filteredStudents, filteredTasks, submissions, subMap]);

  // Export CSV URL
  const exportUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (selectedGroup !== 'ALL') params.set('group', selectedGroup);
    if (selectedModule !== 'ALL') params.set('module', selectedModule);
    const qs = params.toString();
    return `/api/admin/export-csv${qs ? `?${qs}` : ''}`;
  }, [selectedGroup, selectedModule]);

  return (
    <div
      className={
        isFullscreen
          ? 'fixed inset-0 z-50 bg-[#0f1115] p-3 sm:p-5 overflow-y-auto w-screen h-screen'
          : 'w-full space-y-4'
      }
    >
      {/* INKSPO-STYLE LAYOUT: LEFT SIDEBAR (ЖУРНАЛЫ) + RIGHT MAIN CONTENT */}
      <div className="flex flex-col xl:flex-row items-start gap-4 w-full">
        {/* ============================================================== */}
        {/* LEFT COLUMN: ЖУРНАЛЫ (GROUPS SIDEBAR) — AS IN INKSPO          */}
        {/* ============================================================== */}
        {isSidebarOpen && (
          <aside className="w-full xl:w-72 2xl:w-80 shrink-0 border border-zinc-800 bg-[#12141a] p-3 space-y-3 font-mono text-xs rounded-lg shadow-xl xl:sticky xl:top-16">
            {/* Header: Title 'Журналы' + Academic Year Dropdown */}
            <div className="flex items-center justify-between gap-2 border-b border-zinc-800 pb-2.5">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-zinc-300" />
                <h3 className="font-bold text-white text-sm">Журналы</h3>
              </div>

              <div className="relative">
                <select
                  value={academicYear}
                  onChange={e => setAcademicYear(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 text-zinc-200 text-[11px] font-bold px-2 py-1 pr-6 rounded focus:outline-none focus:border-zinc-500 appearance-none cursor-pointer"
                >
                  <option value="2026/2027">2026/2027</option>
                  <option value="2025/2026">2025/2026</option>
                  <option value="КОД 2026">КОД 2026</option>
                </select>
                <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-1.5 top-2 pointer-events-none" />
              </div>
            </div>

            {/* Search Input for Groups */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={groupSearchQuery}
                onChange={e => setGroupSearchQuery(e.target.value)}
                placeholder="Поиск..."
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 pl-8 pr-3 py-1.5 rounded text-xs placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            {/* Groups List (Pill Buttons matching INKSPO screenshot) */}
            <div className="space-y-1.5 max-h-[calc(100vh-230px)] min-h-[360px] overflow-y-auto pr-1">
              {/* Option: Все группы */}
              <button
                type="button"
                onClick={() => setSelectedGroup('ALL')}
                className={`w-full text-left p-2.5 rounded-md transition cursor-pointer text-xs ${
                  selectedGroup === 'ALL'
                    ? 'bg-[#1e3a5f] border border-[#3b82f6] text-white font-bold shadow-[0_0_12px_rgba(30,58,95,0.7)]'
                    : 'bg-zinc-900/80 hover:bg-zinc-800/80 text-zinc-300 border border-zinc-800/80'
                }`}
              >
                <div className="font-bold text-xs flex items-center justify-between">
                  <span>Все группы ({availableGroups.length})</span>
                  <span className="text-[10px] text-zinc-400 font-normal">
                    {students.length} студ.
                  </span>
                </div>
                <div
                  className={`text-[10px] font-normal mt-0.5 ${
                    selectedGroup === 'ALL' ? 'text-blue-200' : 'text-zinc-500'
                  }`}
                >
                  Сводная ведомость • 32 задания
                </div>
              </button>

              {/* Individual Groups */}
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
                    className={`w-full text-left p-2.5 rounded-md transition cursor-pointer text-xs ${
                      isSelected
                        ? 'bg-[#1e3a5f] border border-[#3b82f6] text-white font-bold shadow-[0_0_12px_rgba(30,58,95,0.7)]'
                        : 'bg-zinc-900/80 hover:bg-zinc-800/80 text-zinc-300 border border-zinc-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{grp}</span>
                      {gStat.pendingCount > 0 ? (
                        <span className="text-[9px] bg-yellow-950 text-yellow-300 border border-yellow-500/50 px-1 py-0.2 rounded animate-pulse font-bold">
                          {gStat.pendingCount} ⏳
                        </span>
                      ) : (
                        <span className="text-[10px] text-zinc-500 font-normal">
                          {gStat.studentCount} студ.
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-[10px] font-normal mt-0.5 truncate ${
                        isSelected ? 'text-blue-200' : 'text-zinc-400'
                      }`}
                    >
                      УП.01 Учебная практика
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        {/* ============================================================== */}
        {/* RIGHT COLUMN: MAIN CONTENT & JOURNAL TABLE (INKSPO STYLE)     */}
        {/* ============================================================== */}
        <div className="flex-1 min-w-0 w-full space-y-3 font-mono">
          {/* Top Breadcrumb Header Bar */}
          <div className="border border-zinc-800 bg-[#12141a] p-3 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
            {/* Breadcrumb matching INKSPO */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-1.5 border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded transition cursor-pointer"
                title={isSidebarOpen ? 'Скрыть журналы' : 'Показать журналы'}
              >
                {isSidebarOpen ? (
                  <PanelLeftClose className="w-4 h-4 text-zinc-300" />
                ) : (
                  <PanelLeftOpen className="w-4 h-4 text-zinc-300" />
                )}
              </button>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-400 font-bold">Журналы</span>
                <span className="text-zinc-600">&gt;</span>
                <span className="text-white font-bold bg-[#1e3a5f] border border-[#3b82f6] px-2 py-0.5 rounded text-[11px]">
                  {selectedGroup === 'ALL' ? 'Все группы' : selectedGroup}
                </span>
                <span className="text-zinc-400 hidden sm:inline">- УП.01 Учебная практика</span>
                {selectedModule !== 'ALL' && (
                  <span className="text-sky-300 font-bold bg-sky-950/80 border border-sky-500/40 px-2 py-0.5 rounded text-[10px]">
                    {modules.find(m => m.id === selectedModule)?.code}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons Toolbar */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              {/* Semester badge matching INKSPO */}
              <div className="bg-[#1e293b] border border-blue-500/30 text-blue-300 px-2.5 py-1 rounded text-[11px] font-bold">
                5-й семестр (32 зад.)
              </div>

              {/* View Mode Toggle */}
              <div className="inline-flex rounded border border-zinc-800 bg-zinc-950 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('matrix')}
                  className={`px-2.5 py-1 flex items-center gap-1.5 transition cursor-pointer rounded-sm ${
                    viewMode === 'matrix'
                      ? 'bg-zinc-800 text-white font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Table className="w-3 h-3" />
                  <span>Таблица</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  className={`px-2.5 py-1 flex items-center gap-1.5 transition cursor-pointer rounded-sm ${
                    viewMode === 'cards'
                      ? 'bg-zinc-800 text-white font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3 h-3" />
                  <span>Карточки</span>
                </button>
              </div>

              {/* Fullscreen Toggle */}
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="px-2.5 py-1 border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono flex items-center gap-1.5 rounded transition cursor-pointer"
                title={isFullscreen ? 'Свернуть' : 'Развернуть на весь экран'}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-3 h-3 text-amber-400" />
                    <span>Свернуть</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3 h-3 text-emerald-400" />
                    <span>На весь экран</span>
                  </>
                )}
              </button>

              {/* CSV Export Button */}
              <a href={exportUrl} download>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5 font-mono text-xs h-7 px-2.5"
                >
                  <Download className="w-3 h-3 text-emerald-400" />
                  <span>CSV</span>
                </Button>
              </a>
            </div>
          </div>

          {/* Quick Filters Strip (Module, Student Search, Sort) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-[#12141a] border border-zinc-800 p-2.5 rounded-lg text-xs">
            <div>
              <label className="block text-[10px] uppercase text-zinc-400 mb-1 font-bold">
                Модуль:
              </label>
              <select
                value={selectedModule}
                onChange={e => setSelectedModule(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 text-zinc-200 px-2 py-1 text-xs rounded focus:outline-none focus:border-blue-500 font-mono cursor-pointer"
              >
                <option value="ALL">Все модули (32 задания)</option>
                {modules.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.code}: {m.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-zinc-400 mb-1 font-bold">
                Поиск студента:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="ФИО студента..."
                  className="w-full bg-zinc-900 border border-zinc-700 text-zinc-200 pl-7 pr-3 py-1 text-xs rounded focus:outline-none focus:border-blue-500 font-mono"
                />
                <Search className="w-3 h-3 text-zinc-500 absolute left-2 top-2" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-zinc-400 mb-1 font-bold">
                Сортировка:
              </label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as 'name' | 'score' | 'passed')}
                className="w-full bg-zinc-900 border border-zinc-700 text-zinc-200 px-2 py-1 text-xs rounded focus:outline-none focus:border-blue-500 font-mono cursor-pointer"
              >
                <option value="name">По алфавиту (ФИО)</option>
                <option value="score">По суммарному баллу (↓)</option>
                <option value="passed">По сданным заданиям (↓)</option>
              </select>
            </div>
          </div>

          {/* Status Legend Strip */}
          <div className="border border-zinc-800 bg-[#12141a] px-3 py-1.5 rounded-lg flex items-center gap-3.5 flex-wrap text-[11px] text-zinc-400">
            <span className="font-bold uppercase tracking-wider text-zinc-300 text-[10px]">
              Оценки:
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-sm bg-[#10b981] text-zinc-950 font-bold flex items-center justify-center text-[10px]">
                5
              </span>
              <span>Отлично</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-sm bg-[#f59e0b] text-zinc-950 font-bold flex items-center justify-center text-[10px]">
                4
              </span>
              <span>Хорошо</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-sm bg-[#eab308] text-zinc-950 font-bold flex items-center justify-center text-[10px]">
                3
              </span>
              <span>Удовл.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-sm bg-[#ef4444] text-white font-bold flex items-center justify-center text-[10px]">
                Н/А
              </span>
              <span>Не сдано (2)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-sm bg-[#8b5cf6] text-white font-bold flex items-center justify-center text-[10px] animate-pulse">
                Н/Б
              </span>
              <span>На проверке</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-600 flex items-center justify-center text-[10px]">
                —
              </span>
              <span>Не сдавал</span>
            </div>
          </div>

          {/* ============================================================== */}
          {/* VIEW 1: INKSPO JOURNAL TABLE                                   */}
          {/* ============================================================== */}
          {viewMode === 'matrix' && (
            <div className="border border-zinc-800 bg-[#12141a] rounded-lg overflow-hidden shadow-2xl">
              <div
                className={`overflow-x-auto overflow-y-auto relative ${
                  isFullscreen
                    ? 'max-h-[calc(100vh-250px)]'
                    : 'max-h-[calc(100vh-270px)] min-h-[480px]'
                }`}
              >
                <table className="w-full text-left font-mono border-collapse text-xs select-none">
                  <thead className="bg-[#181a20] text-zinc-300 uppercase sticky top-0 z-30 shadow-md">
                    {/* Header Row 1: Module groupings */}
                    <tr className="border-b border-zinc-800 text-[10px]">
                      {/* Left: Sticky ФИО Column */}
                      <th
                        className="p-2.5 sticky left-0 bg-[#181a20] z-40 border-r border-zinc-800 min-w-[260px] max-w-[290px] shadow-[4px_0_10px_rgba(0,0,0,0.5)]"
                        rowSpan={2}
                      >
                        <div className="flex items-center justify-between text-zinc-200">
                          <span className="font-bold text-xs uppercase tracking-wider">ФИО</span>
                          <span className="text-[10px] text-zinc-400 font-normal">
                            {filteredStudents.length} студентов
                          </span>
                        </div>
                      </th>

                      {/* Center: Module headers */}
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

                      {/* Right: Summary super-header */}
                      <th
                        className="p-2 border-l border-zinc-800 text-center bg-zinc-900 text-zinc-200 font-bold"
                        colSpan={4}
                      >
                        Итоговая / Сводка
                      </th>
                    </tr>

                    {/* Header Row 2: Task numbers and summary sub-headers */}
                    <tr className="border-b border-zinc-800 text-[11px]">
                      {filteredTasks.map(t => (
                        <th
                          key={t.id}
                          className="p-1 border-r border-zinc-800/80 text-center min-w-[34px] max-w-[40px] hover:bg-zinc-800/60 transition cursor-help"
                          title={`${t.module_code} №${t.task_number}: ${t.title}`}
                        >
                          <span className="text-[8px] block text-zinc-500 font-bold">
                            {t.module_code.replace('module-', 'M')}
                          </span>
                          <span className="text-[10px] font-bold text-white">№{t.task_number}</span>
                        </th>
                      ))}

                      {/* Summary columns */}
                      <th className="p-1.5 border-l border-r border-zinc-800 text-center min-w-[55px] text-emerald-400 font-bold">
                        Сдано
                      </th>
                      <th className="p-1.5 border-r border-zinc-800 text-center min-w-[45px] text-cyan-400 font-bold">
                        %
                      </th>
                      <th className="p-1.5 border-r border-zinc-800 text-center min-w-[55px] text-white font-bold">
                        Балл
                      </th>
                      <th className="p-1.5 border-zinc-800 text-center min-w-[65px] text-yellow-400 font-bold">
                        Итог
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-zinc-800/80">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td
                          colSpan={filteredTasks.length + 5}
                          className="p-12 text-center text-zinc-500 font-mono"
                        >
                          Студентов по заданным критериям не найдено.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((student, idx) => {
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
                        const avgScore =
                          passedCount > 0 ? (studentScoreSum / passedCount).toFixed(1) : '0';
                        const isHighlighted = highlightedStudentId === student.id;

                        // Check if student is "Староста" (e.g. Чукалов or marked)
                        const isElder =
                          student.full_name.toLowerCase().includes('чукалов') ||
                          student.username.toLowerCase().includes('chukalov');

                        // Final grade badge calculation
                        let finalBadge = (
                          <span className="bg-[#ef4444] text-white px-2 py-0.5 rounded text-[10px] font-bold">
                            Н/А
                          </span>
                        );
                        if (pct >= 85) {
                          finalBadge = (
                            <span className="bg-[#10b981] text-zinc-950 px-2 py-0.5 rounded text-[10px] font-bold">
                              5
                            </span>
                          );
                        } else if (pct >= 65) {
                          finalBadge = (
                            <span className="bg-[#f59e0b] text-zinc-950 px-2 py-0.5 rounded text-[10px] font-bold">
                              4
                            </span>
                          );
                        } else if (pct >= 40) {
                          finalBadge = (
                            <span className="bg-[#eab308] text-zinc-950 px-2 py-0.5 rounded text-[10px] font-bold">
                              3
                            </span>
                          );
                        }

                        return (
                          <tr
                            key={student.id}
                            id={`student-row-${student.id}`}
                            className={`transition-colors ${
                              isHighlighted
                                ? 'bg-blue-950/40 ring-1 ring-blue-500 font-semibold'
                                : 'hover:bg-zinc-850/60'
                            }`}
                          >
                            {/* Pinned Left Student Column: Number + Avatar + Full Name */}
                            <td
                              className={`p-2 sticky left-0 z-20 border-r border-zinc-800 whitespace-nowrap shadow-[4px_0_10px_rgba(0,0,0,0.5)] ${
                                isHighlighted ? 'bg-zinc-800 text-blue-200' : 'bg-[#14161d]'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {/* Row numbering */}
                                <span className="text-zinc-500 text-[10px] w-5 text-right font-mono shrink-0">
                                  {idx + 1}.
                                </span>

                                {/* Colored initials avatar circle matching INKSPO */}
                                <div
                                  className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-[9px] shrink-0 ${getAvatarColor(
                                    student.full_name
                                  )}`}
                                >
                                  {getInitials(student.full_name)}
                                </div>

                                {/* Student Full Name */}
                                <div className="truncate max-w-[170px] text-xs font-semibold text-zinc-100 hover:text-white transition">
                                  {student.full_name}
                                </div>

                                {/* Starosta badge if applicable */}
                                {isElder && (
                                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/50 px-1.5 py-0.2 rounded-full text-[9px] font-bold tracking-tight shrink-0">
                                    Староста
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* 32 Task cells styled like INKSPO */}
                            {filteredTasks.map(task => {
                              const sub = subMap.get(`${student.id}:${task.id}`);

                              if (!sub) {
                                return (
                                  <td
                                    key={task.id}
                                    className="p-0.5 border-r border-zinc-800/60 text-center text-zinc-700 select-none"
                                  >
                                    <div className="w-7 h-7 mx-auto flex items-center justify-center text-zinc-700 text-[10px]">
                                      —
                                    </div>
                                  </td>
                                );
                              }

                              if (sub.status === 'pending') {
                                return (
                                  <td
                                    key={task.id}
                                    className="p-0.5 border-r border-zinc-800/60 text-center cursor-pointer"
                                    onClick={() => setSelectedSub(sub)}
                                    title={`${task.module_code} №${task.task_number}: На проверке`}
                                  >
                                    <div className="w-7 h-7 mx-auto flex items-center justify-center rounded-sm bg-[#8b5cf6] text-white font-bold text-[10px] animate-pulse shadow-sm">
                                      Н/Б
                                    </div>
                                  </td>
                                );
                              }

                              if (sub.status === 'reviewed') {
                                const score = sub.score;
                                let bgClass = 'bg-[#10b981] text-zinc-950'; // 5 - green
                                let label = score ? String(score) : '5';

                                if (score === 4) {
                                  bgClass = 'bg-[#f59e0b] text-zinc-950'; // 4 - amber
                                } else if (score === 3) {
                                  bgClass = 'bg-[#eab308] text-zinc-950'; // 3 - yellow
                                } else if (score === 2 || !sub.is_passed) {
                                  bgClass = 'bg-[#ef4444] text-white'; // 2 - red
                                  label = 'Н/А';
                                }

                                return (
                                  <td
                                    key={task.id}
                                    className="p-0.5 border-r border-zinc-800/60 text-center cursor-pointer"
                                    onClick={() => setSelectedSub(sub)}
                                    title={`${task.module_code} №${task.task_number}: Оценка ${score} б.`}
                                  >
                                    <div
                                      className={`w-7 h-7 mx-auto flex items-center justify-center rounded-sm font-bold text-xs shadow-sm hover:scale-105 transition ${bgClass}`}
                                    >
                                      {label}
                                    </div>
                                  </td>
                                );
                              }

                              if (sub.status === 'rejected') {
                                return (
                                  <td
                                    key={task.id}
                                    className="p-0.5 border-r border-zinc-800/60 text-center cursor-pointer"
                                    onClick={() => setSelectedSub(sub)}
                                    title={`${task.module_code} №${task.task_number}: Не сдано`}
                                  >
                                    <div className="w-7 h-7 mx-auto flex items-center justify-center rounded-sm bg-[#ef4444] text-white font-bold text-[10px] hover:scale-105 transition shadow-sm">
                                      Н/А
                                    </div>
                                  </td>
                                );
                              }

                              return (
                                <td
                                  key={task.id}
                                  className="p-0.5 border-r border-zinc-800/60 text-center text-zinc-700"
                                >
                                  <div className="w-7 h-7 mx-auto flex items-center justify-center text-zinc-700 text-[10px]">
                                    —
                                  </div>
                                </td>
                              );
                            })}

                            {/* Summary Columns: Сдано, %, Балл, Итог */}
                            <td className="p-2 border-l border-r border-zinc-800 text-center whitespace-nowrap font-bold text-emerald-400 text-xs">
                              {passedCount}/{filteredTasks.length}
                            </td>

                            <td className="p-2 border-r border-zinc-800 text-center whitespace-nowrap text-xs">
                              <span
                                className={`font-bold ${
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

                            <td className="p-2 border-r border-zinc-800 text-center whitespace-nowrap font-bold text-white text-xs">
                              {studentScoreSum} б.
                            </td>

                            <td className="p-2 border-zinc-800 text-center whitespace-nowrap text-xs font-bold">
                              {finalBadge}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>

                  {/* INKSPO Table Footer Rows */}
                  {filteredStudents.length > 0 && (
                    <tfoot className="bg-[#14161d] text-zinc-300 font-bold text-xs border-t-2 border-zinc-700 divide-y divide-zinc-800/80">
                      <tr>
                        <td className="p-2.5 sticky left-0 bg-[#14161d] z-20 border-r border-zinc-800 text-zinc-400 uppercase text-[10px] tracking-wider">
                          Абсолютная успеваемость, %
                        </td>
                        <td
                          colSpan={filteredTasks.length}
                          className="p-2 text-right text-zinc-500 font-normal pr-4"
                        >
                          Доля сдавших от 50% заданий
                        </td>
                        <td
                          colSpan={4}
                          className="p-2 border-l border-zinc-800 text-center text-emerald-400 font-bold"
                        >
                          {stats.absoluteSuccessPct}%
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 sticky left-0 bg-[#14161d] z-20 border-r border-zinc-800 text-zinc-400 uppercase text-[10px] tracking-wider">
                          Качественная успеваемость, %
                        </td>
                        <td
                          colSpan={filteredTasks.length}
                          className="p-2 text-right text-zinc-500 font-normal pr-4"
                        >
                          Доля сдавших на «4» и «5»
                        </td>
                        <td
                          colSpan={4}
                          className="p-2 border-l border-zinc-800 text-center text-cyan-400 font-bold"
                        >
                          {stats.qualitySuccessPct}%
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 sticky left-0 bg-[#14161d] z-20 border-r border-zinc-800 text-zinc-400 uppercase text-[10px] tracking-wider">
                          Всего проверенных работ
                        </td>
                        <td
                          colSpan={filteredTasks.length}
                          className="p-2 text-right text-zinc-500 font-normal pr-4"
                        >
                          Сумма успешных сдач
                        </td>
                        <td
                          colSpan={4}
                          className="p-2 border-l border-zinc-800 text-center text-white font-bold"
                        >
                          {stats.totalPassedSubs} работ
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW 2: PROGRESS CARDS VIEW                                   */}
          {/* ============================================================== */}
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredStudents.length === 0 ? (
                <div className="col-span-2 p-12 border border-zinc-800 text-center text-zinc-500 font-mono bg-[#12141a] rounded-lg">
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
                      className="border border-zinc-800 bg-[#12141a] p-4 rounded-lg space-y-3 shadow-md hover:border-zinc-700 transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-9 h-9 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 ${getAvatarColor(
                              student.full_name
                            )}`}
                          >
                            {getInitials(student.full_name)}
                          </div>
                          <div>
                            <h3 className="font-bold text-white text-sm hover:text-blue-300 transition">
                              {student.full_name}
                            </h3>
                            <div className="text-[11px] text-zinc-400 mt-0.5">
                              Группа:{' '}
                              <span className="text-zinc-200 font-bold">{student.group_name}</span>{' '}
                              • {student.username}
                            </div>
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
                                  className="h-6 bg-[#8b5cf6] text-white font-bold flex items-center justify-center text-[9px] rounded-sm animate-pulse cursor-pointer shadow-sm"
                                  title={`${task.module_code} №${task.task_number}: На проверке`}
                                >
                                  {task.task_number}⏳
                                </button>
                              );
                            }

                            const score = submission.score;
                            let color = 'bg-[#10b981] text-zinc-950';
                            if (score === 4) color = 'bg-[#f59e0b] text-zinc-950';
                            if (score === 3) color = 'bg-[#eab308] text-zinc-950';
                            if (score === 2 || !submission.is_passed)
                              color = 'bg-[#ef4444] text-white';

                            return (
                              <button
                                key={task.id}
                                type="button"
                                onClick={() => setSelectedSub(submission)}
                                className={`h-6 font-bold flex items-center justify-center text-[10px] rounded-sm cursor-pointer hover:scale-105 transition shadow-sm ${color}`}
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
          <div className="bg-[#14161d] border border-zinc-700 max-w-lg w-full p-6 shadow-2xl space-y-4 font-mono text-xs rounded-lg animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded">
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
                className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-zinc-900 p-2.5 border border-zinc-800 space-y-0.5 rounded">
                <span className="text-zinc-500 text-[10px] uppercase block">Задание:</span>
                <span className="text-white font-bold">
                  {selectedSub.task_module?.toUpperCase()} №{selectedSub.task_number}:{' '}
                  {selectedSub.task_title}
                </span>
              </div>

              <div className="bg-zinc-900 p-2.5 border border-zinc-800 space-y-0.5 rounded">
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

              <div className="bg-zinc-900 p-2.5 border border-zinc-800 space-y-0.5 rounded">
                <span className="text-zinc-500 text-[10px] uppercase block">Оценка:</span>
                <span className="font-bold text-emerald-400 text-sm">
                  {selectedSub.score !== null
                    ? `${selectedSub.score} из 5 баллов`
                    : 'Не выставлена'}
                </span>
              </div>

              {selectedSub.feedback && (
                <div className="bg-zinc-900 p-2.5 border border-zinc-800 space-y-0.5 rounded">
                  <span className="text-zinc-500 text-[10px] uppercase block">
                    Комментарий преподавателя:
                  </span>
                  <p className="text-zinc-300 italic">{selectedSub.feedback}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
              <Link
                href={`/admin/submissions/${selectedSub.id}`}
                className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition underline underline-offset-4"
              >
                <span>Открыть полную проверку отчета</span>
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
      )}
    </div>
  );
}
