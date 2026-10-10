import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { Header } from '@/components/Header';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  BookOpen,
  ExternalLink,
  Sparkles,
  Terminal,
  Compass,
  Server,
  Laptop,
  ClipboardCheck,
  Lock,
} from 'lucide-react';
import { PREPARATION_TOPICS } from '@/lib/preparation-data';

export default async function StudentHomePage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  if (session.role === 'admin') {
    redirect('/admin');
  }

  const modules = db.getAllModules();
  const allTasks = await db.getAllTasks();
  const submissions = await db.getUserSubmissions(session.id);

  const subMap = new Map(submissions.map((s) => [s.task_id, s]));

  // Global Statistics
  const totalTasksCount = allTasks.length; // 32
  const passedCount = submissions.filter((s) => s.status === 'reviewed' && s.is_passed).length;
  const pendingCount = submissions.filter((s) => s.status === 'pending').length;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Header user={session} />

      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full space-y-8">
        {/* Welcome & Exam Overview Banner */}
        <div className="border border-zinc-800 bg-zinc-900/60 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-xs text-zinc-500 uppercase">Студент</span>
                <span className="text-zinc-600">•</span>
                <span className="font-mono text-xs bg-zinc-800 border border-zinc-700 px-2 py-0.5 font-semibold text-zinc-200">
                  {session.group_name}
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white font-mono sm:text-3xl">
                {session.full_name}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-1.5 max-w-2xl leading-relaxed">
                Интерактивная отчётность по демонстрационному экзамену 09.02.06 «Сетевое и системное
                администрирование». Изучите теоретическую документацию, выберите экзаменационный
                модуль, выполните практику на стенде Proxmox и отправьте консольный отчёт.
              </p>
            </div>

            {/* Total Metrics Counters */}
            <div className="flex items-center gap-3 font-mono text-xs shrink-0">
              <div className="border border-zinc-800 bg-zinc-900/90 px-3.5 py-2.5 text-center min-w-[100px]">
                <div className="text-zinc-500 text-[10px] uppercase font-medium">Всего заданий</div>
                <div className="text-xl font-bold text-zinc-100">{totalTasksCount}</div>
              </div>
              <div className="border border-zinc-800 bg-zinc-900/90 px-3.5 py-2.5 text-center min-w-[100px]">
                <div className="text-zinc-500 text-[10px] uppercase font-medium">На проверке</div>
                <div className="text-xl font-bold text-zinc-100">{pendingCount}</div>
              </div>
              <div className="border border-emerald-500/50 bg-emerald-950/40 shadow-[0_0_14px_rgba(16,185,129,0.25)] text-emerald-300 px-3.5 py-2.5 text-center min-w-[100px]">
                <div className="text-emerald-400 text-[10px] uppercase font-bold tracking-wider">Проверено</div>
                <div className="text-xl font-bold text-emerald-200">{passedCount}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Preparation Block (Подготовка к работе) */}
        <div id="preparation" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Подготовка к работе (3 модуля)</span>
            </h2>
            <span className="text-xs font-mono text-zinc-500">
              Ознакомьтесь перед выполнением заданий
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PREPARATION_TOPICS.map((topic) => {
              const icons = [Server, Laptop, ClipboardCheck];
              const IconComponent = icons[topic.number - 1] || BookOpen;

              return (
                <div
                  key={topic.id}
                  className="border border-zinc-800 bg-zinc-900/60 p-6 flex flex-col justify-between hover:border-zinc-500 transition-colors group"
                >
                  <div className="space-y-4">
                    {/* Header Badges */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold bg-white text-zinc-950 px-2 py-0.5">
                        МОДУЛЬ {topic.number}
                      </span>
                      <span className="font-mono text-xs text-zinc-400 border border-zinc-800 bg-zinc-900 px-2 py-0.5">
                        {topic.badge}
                      </span>
                    </div>

                    {/* Title & Icon */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <IconComponent className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                        <h3 className="text-base font-bold text-white font-mono group-hover:text-zinc-100">
                          {topic.title}
                        </h3>
                      </div>
                      <p className="text-xs text-zinc-400 font-mono mt-1.5 line-clamp-3 leading-relaxed">
                        {topic.description}
                      </p>
                    </div>

                    {/* Metadata Footer */}
                    <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        <span>{topic.duration}</span>
                      </span>
                      <span className="text-[11px] text-zinc-400">Видео и материалы</span>
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="pt-6 mt-4 border-t border-zinc-800">
                    <Link href={`/preparation/${topic.slug}`}>
                      <Button variant="secondary" className="w-full flex items-center justify-center gap-2 text-xs">
                        <span>Перейти к материалу</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3 Modules Section */}
        <div id="modules" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-zinc-400" />
              <span>Экзаменационные модули (3 модуля • 32 задания)</span>
            </h2>
            <span className="text-xs font-mono text-zinc-500">
              Выполняйте модули и задания последовательно
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modules.map((mod) => {
              const isLocked = mod.id === 'module-3';
              const moduleTasks = allTasks.filter((t) => t.module_id === mod.id);
              const moduleTaskIds = new Set(moduleTasks.map((t) => t.id));

              const moduleSubmissions = submissions.filter((s) => moduleTaskIds.has(s.task_id));
              const modPassed = moduleSubmissions.filter((s) => s.status === 'reviewed' && s.is_passed).length;
              const modPending = moduleSubmissions.filter((s) => s.status === 'pending').length;
              const progressPercent = Math.round((modPassed / mod.total_tasks) * 100);

              return (
                <div
                  key={mod.id}
                  className={`border relative flex flex-col justify-between transition-colors overflow-hidden ${
                    isLocked
                      ? 'border-zinc-800 bg-zinc-950/90 p-6'
                      : 'border-zinc-800 bg-zinc-900/60 p-6 hover:border-zinc-500 group'
                  }`}
                >
                  {/* Overlay for locked modules */}
                  {isLocked && (
                    <div className="absolute inset-0 z-20 bg-zinc-950/85 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
                      <div className="bg-zinc-900 border border-zinc-700/80 px-3.5 py-1.5 flex items-center gap-2 mb-2 shadow-2xl">
                        <Lock className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="font-mono text-xs font-bold text-zinc-200 uppercase tracking-widest">
                          В разработке
                        </span>
                      </div>
                      <p className="font-mono text-[11px] text-zinc-400 max-w-[200px] leading-relaxed">
                        Экзаменационный модуль временно заблокирован
                      </p>
                    </div>
                  )}

                  <div className={`space-y-4 ${isLocked ? 'filter grayscale opacity-25 select-none pointer-events-none' : ''}`}>
                    {/* Module Code & Tasks Badge */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold bg-white text-zinc-950 px-2 py-0.5">
                        {mod.code}
                      </span>
                      <span className="font-mono text-xs text-zinc-400 border border-zinc-800 bg-zinc-900 px-2 py-0.5">
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
                      <div className="w-full h-1.5 bg-zinc-800 overflow-hidden">
                        <div
                          className="h-full bg-white transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      {modPending > 0 && (
                        <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 text-zinc-400" />
                          <span>Ожидают проверки: {modPending}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className={`pt-6 mt-4 border-t border-zinc-800 ${isLocked ? 'filter grayscale opacity-25 pointer-events-none' : ''}`}>
                    {isLocked ? (
                      <Button variant="secondary" disabled className="w-full flex items-center justify-center gap-2 cursor-not-allowed">
                        <Lock className="w-3.5 h-3.5" />
                        <span>В разработке</span>
                      </Button>
                    ) : (
                      <Link href={`/modules/${mod.id}`}>
                        <Button variant="primary" className="w-full flex items-center justify-center gap-2">
                          <span>Открыть список заданий</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Base Knowledge Link Footer */}
        <div className="border border-zinc-800 bg-zinc-900/40 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-zinc-400" />
            <span className="text-xs font-mono text-zinc-400">
              Официальная база знаний демонстрационного экзамена 09.02.06:
            </span>
          </div>
          <a
            href="https://demo.sudostudy.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-white hover:underline"
          >
            <span>demo.sudostudy.dev</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </main>
    </div>
  );
}
