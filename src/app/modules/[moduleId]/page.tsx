import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { Header } from '@/components/Header';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  ChevronLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Server,
  FileCode2,
  BookOpen,
  Lock,
} from 'lucide-react';

interface ModulePageProps {
  params: Promise<{ moduleId: string }>;
}

export default async function ModuleDetailPage({ params }: ModulePageProps) {
  const { moduleId } = await params;
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  if (session.role === 'admin') {
    redirect('/admin');
  }

  const moduleInfo = db.getModuleById(moduleId);
  if (!moduleInfo) {
    notFound();
  }

  if (moduleId === 'module-3') {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col">
        <Header user={session} />

        <main className="max-w-2xl mx-auto px-4 py-16 flex-1 w-full space-y-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Назад ко всем модулям</span>
            </Link>
          </div>

          <div className="border border-zinc-800 bg-zinc-900/60 p-8 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-950 border border-zinc-800 text-zinc-400 mb-1">
              <Lock className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <div className="font-mono text-xs uppercase tracking-widest text-zinc-500 font-bold">
                {moduleInfo.code} • В РАЗРАБОТКЕ
              </div>
              <h1 className="text-xl font-bold font-mono text-white">
                {moduleInfo.title}
              </h1>
            </div>

            <p className="font-mono text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
              Данный экзаменационный модуль временно заблокирован и находится в процессе разработки. Пожалуйста, выполняйте практические задания Модуля 1.
            </p>

            <div className="pt-4 flex items-center justify-center gap-3">
              <Link href="/modules/module-1">
                <Button variant="primary" className="flex items-center gap-2">
                  <span>Перейти к Модулю 1</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/">
                <Button variant="secondary">
                  <span>На главную</span>
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const tasks = await db.getTasksByModule(moduleId);
  const submissions = await db.getUserSubmissions(session.id);
  const subMap = new Map(submissions.map((s) => [s.task_id, s]));

  const passedCount = tasks.filter((t) => {
    const s = subMap.get(t.id);
    return s?.status === 'reviewed' && s?.is_passed;
  }).length;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Header user={session} />

      <main className="max-w-5xl mx-auto px-4 py-6 flex-1 w-full space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Назад ко всем модулям</span>
          </Link>
        </div>

        {/* Module Header Card */}
        <div className="border border-zinc-800 bg-zinc-900/60 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-xs font-bold bg-white text-zinc-950 px-2 py-0.5">
                  {moduleInfo.code}
                </span>
                <span className="font-mono text-xs text-zinc-400">
                  {moduleInfo.total_tasks} практических заданий
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono">
                {moduleInfo.title}
              </h1>
            </div>

            <div className="border border-zinc-800 bg-zinc-900 px-4 py-2 text-right font-mono text-xs shrink-0">
              <span className="text-zinc-500 text-[10px] uppercase block">Прогресс модуля</span>
              <span className="text-sm font-bold text-white">
                {passedCount} из {moduleInfo.total_tasks} проверено
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-zinc-400 font-mono leading-relaxed max-w-3xl">
            {moduleInfo.description}
          </p>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
              Список заданий модуля ({tasks.length})
            </h2>
            <span className="text-[11px] font-mono text-zinc-500">
              Выберите задание для изучения теории и сдачи отчёта
            </span>
          </div>

          <div className="divide-y divide-zinc-800 border border-zinc-800 bg-zinc-900/40">
            {tasks.map((task) => {
              const sub = subMap.get(task.id);
              let statusBadge = <Badge variant="neutral">НЕ СДАВАЛ</Badge>;

              if (sub?.status === 'pending') {
                statusBadge = (
                  <Badge variant="pending" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>НА ПРОВЕРКЕ</span>
                  </Badge>
                );
              } else if (sub?.status === 'reviewed') {
                statusBadge = (
                  <Badge variant="reviewed" className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>
                      ПРОВЕРЕНО {sub.score !== null ? `(${sub.score}/${task.max_score} б.)` : ''}
                    </span>
                  </Badge>
                );
              } else if (sub?.status === 'rejected') {
                statusBadge = (
                  <Badge variant="rejected" className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>НА ДОРАБОТКУ</span>
                  </Badge>
                );
              }

              return (
                <div
                  key={task.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-900/80 transition-colors"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-zinc-200 border border-zinc-700 bg-zinc-800 px-2 py-0.5">
                        Задание №{task.task_number}
                      </span>
                      {statusBadge}
                      {sub?.allow_retake && (
                        <span className="font-mono text-xs font-bold text-cyan-300 border border-cyan-500/50 bg-cyan-950/80 px-2 py-0.5">
                          ПЕРЕСДАЧА РАЗРЕШЕНА
                        </span>
                      )}
                      {task.nodes && task.nodes.length > 0 && (
                        <div className="flex items-center gap-1 font-mono text-[11px] text-zinc-400">
                          <Server className="w-3 h-3 text-zinc-500" />
                          <span>Узлы: {task.nodes.join(', ')}</span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white font-mono">
                      {task.title}
                    </h3>

                    <p className="text-xs text-zinc-400 font-mono line-clamp-2 max-w-3xl leading-relaxed">
                      {task.description}
                    </p>

                    {sub?.feedback && (() => {
                      const isApproved = sub.status === 'reviewed' || sub.is_passed === true;
                      const isRejected = sub.status === 'rejected' || sub.is_passed === false;

                      return (
                        <div
                          className={`mt-2.5 p-2.5 text-xs font-mono border transition-all ${
                            isApproved
                              ? 'border-emerald-500 bg-emerald-950/40 text-emerald-100 shadow-[0_0_12px_rgba(16,185,129,0.3)] ring-1 ring-emerald-500/50'
                              : isRejected
                              ? 'border-amber-500 bg-amber-950/40 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.3)] ring-1 ring-amber-500/50'
                              : 'border-zinc-700 bg-zinc-900 text-zinc-300'
                          }`}
                        >
                          <div className="font-bold flex items-center gap-1.5 uppercase text-[10px] tracking-wider mb-1">
                            {isApproved ? (
                              <span className="text-emerald-400">✓ Рецензия преподавателя (Принято):</span>
                            ) : isRejected ? (
                              <span className="text-amber-400">⚠ Замечания преподавателя (На доработку):</span>
                            ) : (
                              <span className="text-white">Преподаватель:</span>
                            )}
                          </div>
                          <div className="leading-relaxed">{sub.feedback}</div>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="shrink-0 flex items-center">
                    <Link href={`/tasks/${task.slug}`}>
                      <Button
                        variant={sub ? 'outline' : 'primary'}
                        size="sm"
                        className="w-full sm:w-auto flex items-center gap-1.5"
                      >
                        <FileCode2 className="w-3.5 h-3.5" />
                        <span>{sub ? 'Посмотреть / Обновить' : 'Выполнить задание'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
