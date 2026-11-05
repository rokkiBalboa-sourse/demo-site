'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ModuleInfo, Task, Submission, ExamYearSettings } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Layers, Clock, ArrowRight, Lock, Calendar, CheckCircle2 } from 'lucide-react';

interface StudentModulesSectionProps {
  modules: ModuleInfo[];
  allTasks: Task[];
  submissions: Submission[];
  examSettings: ExamYearSettings;
  userGroup: string;
}

export function StudentModulesSection({
  modules,
  allTasks,
  submissions,
  examSettings,
  userGroup,
}: StudentModulesSectionProps) {
  // Check group restriction
  const groupAssignment = examSettings.mode === 'restricted' ? examSettings.groupAssignments?.[userGroup] : null;

  const isStrictYear = groupAssignment && (groupAssignment.year === 2026 || groupAssignment.year === 2027);
  const strictYear = isStrictYear ? (groupAssignment.year as 2026 | 2027) : null;

  const [selectedYear, setSelectedYear] = useState<number>(() => {
    if (strictYear) return strictYear;
    return examSettings.defaultYear || 2026;
  });

  const activeYear = strictYear || selectedYear;

  // Filter modules for active year
  const yearModules = useMemo(() => {
    let mods = modules.filter(m => (m.year || 2026) === activeYear);
    if (groupAssignment?.allowedModules && groupAssignment.allowedModules.length > 0) {
      mods = mods.filter(m => groupAssignment.allowedModules?.includes(m.id));
    }
    return mods;
  }, [modules, activeYear, groupAssignment]);

  // Year stats
  const yearTasks = useMemo(() => {
    const modIds = new Set(yearModules.map(m => m.id));
    return allTasks.filter(t => modIds.has(t.module_id));
  }, [yearModules, allTasks]);

  const yearTaskIds = useMemo(() => new Set(yearTasks.map(t => t.id)), [yearTasks]);

  const yearSubmissions = useMemo(
    () => submissions.filter(s => yearTaskIds.has(s.task_id)),
    [submissions, yearTaskIds]
  );

  const yearPassedCount = yearSubmissions.filter(s => s.status === 'reviewed' && s.is_passed).length;
  const yearPendingCount = yearSubmissions.filter(s => s.status === 'pending').length;

  return (
    <div id="modules" className="space-y-5">
      {/* Year Selection Tabs or Assignment Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-100">
            Экзаменационные модули ({activeYear} год)
          </h2>
          {isStrictYear && (
            <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700 px-2 py-0.5 rounded">
              Назначено для группы {userGroup}
            </span>
          )}
        </div>

        {/* Tab Switcher if unrestricted */}
        {!isStrictYear && (
          <div className="inline-flex p-1 bg-zinc-900 border border-zinc-800 rounded font-mono text-xs">
            <button
              type="button"
              onClick={() => setSelectedYear(2026)}
              className={`px-3 py-1 rounded transition flex items-center gap-1.5 cursor-pointer ${
                activeYear === 2026
                  ? 'bg-zinc-800 text-white font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <span>2026 год</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedYear(2027)}
              className={`px-3 py-1 rounded transition flex items-center gap-1.5 cursor-pointer ${
                activeYear === 2027
                  ? 'bg-zinc-800 text-white font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>2027 год</span>
            </button>
          </div>
        )}
      </div>

      {/* Subheader info & stats for the active year */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-zinc-400 bg-zinc-900/40 border border-zinc-800/80 px-4 py-2.5 rounded">
        <div className="flex items-center gap-2">
          <span>Программа {activeYear} года:</span>
          <strong className="text-zinc-200">
            {yearModules.length} модуля • {yearTasks.length} заданий
          </strong>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-zinc-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Сдано: {yearPassedCount} из {yearTasks.length}</span>
          </span>
          {yearPendingCount > 0 && (
            <span className="flex items-center gap-1 text-amber-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>На проверке: {yearPendingCount}</span>
            </span>
          )}
        </div>
      </div>

      {/* Grid of Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {yearModules.map(mod => {
          const moduleTasks = allTasks.filter(t => t.module_id === mod.id);
          const moduleTaskIds = new Set(moduleTasks.map(t => t.id));

          const moduleSubmissions = submissions.filter(s => moduleTaskIds.has(s.task_id));
          const modPassed = moduleSubmissions.filter(
            s => s.status === 'reviewed' && s.is_passed
          ).length;
          const modPending = moduleSubmissions.filter(s => s.status === 'pending').length;
          const progressPercent = mod.total_tasks > 0 ? Math.round((modPassed / mod.total_tasks) * 100) : 0;

          return (
            <div
              key={mod.id}
              className="border border-zinc-800 bg-zinc-900/60 p-6 flex flex-col justify-between hover:border-zinc-500 transition-colors group rounded"
            >
              <div className="space-y-4">
                {/* Module Code & Tasks Badge */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold bg-white text-zinc-950 px-2 py-0.5 rounded">
                    {mod.code}
                  </span>
                  <span className="font-mono text-xs text-zinc-400 border border-zinc-800 bg-zinc-900 px-2 py-0.5 rounded">
                    {mod.total_tasks} заданий
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-base font-bold text-white font-mono group-hover:text-zinc-100">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono mt-2 line-clamp-3 leading-relaxed">
                    {mod.description}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2 border-t border-zinc-800">
                  <div className="flex justify-between text-xs font-mono text-zinc-400">
                    <span>Прогресс сдачи:</span>
                    <span className="font-bold text-zinc-200">
                      {modPassed} / {mod.total_tasks} ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 overflow-hidden rounded-full">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  {modPending > 0 && (
                    <div className="text-[11px] font-mono text-amber-300 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>Ожидают проверки: {modPending}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-6 mt-4 border-t border-zinc-800">
                <Link href={`/modules/${mod.id}`}>
                  <Button
                    variant="primary"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <span>Открыть список заданий</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

