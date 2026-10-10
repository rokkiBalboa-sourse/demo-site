import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { Header } from '@/components/Header';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TaskSubmitForm } from './TaskSubmitForm';
import {
  ChevronLeft,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Server,
  BookOpen,
  Lock,
  ArrowRight,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function TaskDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const task = await db.getTaskBySlug(slug);
  if (!task) {
    notFound();
  }

  const moduleInfo = db.getModuleById(task.module_id);

  const initialSubmission = await db.getSubmissionByUserAndTask(session.id, task.id);

  let statusBadge = <Badge variant="neutral">НЕ СДАВАЛ</Badge>;
  if (initialSubmission?.status === 'pending') {
    statusBadge = (
      <Badge variant="pending" className="flex items-center gap-1">
        <Clock className="w-3 h-3" />
        <span>НА ПРОВЕРКЕ</span>
      </Badge>
    );
  } else if (initialSubmission?.status === 'reviewed') {
    statusBadge = (
      <Badge variant="reviewed" className="flex items-center gap-1.5">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>
          ПРОВЕРЕНО{' '}
          {initialSubmission.score !== null
            ? `(${initialSubmission.score}/${task.max_score} б.)`
            : ''}
        </span>
      </Badge>
    );
  } else if (initialSubmission?.status === 'rejected') {
    statusBadge = (
      <Badge variant="rejected" className="flex items-center gap-1.5">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>НА ДОРАБОТКУ</span>
      </Badge>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Header user={session} />

      <main className="max-w-5xl mx-auto px-4 py-6 flex-1 w-full space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
            <Link href="/" className="hover:text-white">
              Главная
            </Link>
            <span className="text-zinc-600">/</span>
            <Link href={`/modules/${task.module_id}`} className="hover:text-white">
              {moduleInfo?.code || task.module_code}
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-white font-bold">Задание №{task.task_number}</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://demo.sudostudy.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-mono text-zinc-400 hover:text-white border border-zinc-800 px-2 py-0.5 bg-zinc-900"
            >
              <span>demo.sudostudy.dev</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Task Title & Meta Card */}
        <div className="border border-zinc-800 bg-zinc-900/60 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-zinc-800">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold bg-white text-zinc-950 px-2 py-0.5">
                {task.module_code} • Задание №{task.task_number}
              </span>
              {statusBadge}
              {initialSubmission?.allow_retake && (
                <span className="font-mono text-xs font-bold text-cyan-300 border border-cyan-500/50 bg-cyan-950/80 px-2 py-0.5">
                  ПЕРЕСДАЧА РАЗРЕШЕНА
                </span>
              )}
              <span className="text-xs font-mono text-zinc-400">
                Макс. балл: {task.max_score} б.
              </span>
            </div>

            {task.nodes && task.nodes.length > 0 && (
              <div className="flex items-center gap-1 font-mono text-xs bg-zinc-800 border border-zinc-700 px-2 py-0.5 text-zinc-300">
                <Server className="w-3.5 h-3.5 text-zinc-400" />
                <span>Целевые узлы: {task.nodes.join(', ')}</span>
              </div>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono">
            {task.title}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-2 leading-relaxed">
            {task.description}
          </p>

          {task.video_url && (
            <div className="mt-4 border border-emerald-500/30 bg-emerald-950/20 p-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">📺</span>
                <div>
                  <div className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider">
                    Видео-разбор выполнения задания
                  </div>
                  <div className="text-[11px] font-mono text-zinc-300">
                    Доступен подробный видеоматериал с пошаговым разбором настройки
                  </div>
                </div>
              </div>
              <a
                href={task.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold font-mono text-xs transition-colors shrink-0"
              >
                <span>Смотреть видео-разбор</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Teacher Feedback Banner */}
          {initialSubmission?.feedback &&
            (() => {
              const isApproved =
                initialSubmission.status === 'reviewed' || initialSubmission.is_passed === true;
              const isRejected =
                initialSubmission.status === 'rejected' || initialSubmission.is_passed === false;

              return (
                <div
                  className={`mt-4 p-4 text-xs font-mono border transition-all ${
                    isApproved
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-100 shadow-[0_0_16px_rgba(16,185,129,0.35)] ring-1 ring-emerald-500/50'
                      : isRejected
                        ? 'border-amber-500 bg-amber-950/40 text-amber-100 shadow-[0_0_16px_rgba(245,158,11,0.35)] ring-1 ring-amber-500/50'
                        : 'border-zinc-700 bg-zinc-900 text-zinc-300'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-current/20">
                    <div className="font-bold flex items-center gap-2">
                      {isApproved ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : isRejected ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : null}
                      <span className="uppercase tracking-wider">
                        {isApproved
                          ? 'Рецензия преподавателя (Работа принята)'
                          : isRejected
                            ? 'Замечания преподавателя (На доработку)'
                            : 'Рецензия преподавателя'}
                      </span>
                    </div>

                    {initialSubmission.score !== null && (
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          isApproved
                            ? 'bg-emerald-400 text-zinc-950 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                            : isRejected
                              ? 'bg-amber-400 text-zinc-950 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                              : 'bg-white text-zinc-950'
                        }`}
                      >
                        Оценка: {initialSubmission.score} / {task.max_score} б.
                      </span>
                    )}
                  </div>

                  <div className="whitespace-pre-wrap leading-relaxed text-xs">
                    {initialSubmission.feedback}
                  </div>
                </div>
              );
            })()}
        </div>

        {/* Interactive Task Form */}
        <TaskSubmitForm task={task} initialSubmission={initialSubmission} />
      </main>
    </div>
  );
}
