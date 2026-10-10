import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { Header } from '@/components/Header';
import { Badge } from '@/components/ui/Badge';
import { TerminalLog } from '@/components/ui/TerminalLog';
import { ReviewForm } from './ReviewForm';
import {
  ChevronLeft,
  User,
  Calendar,
  BookOpen,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Server,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SubmissionReviewPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  if (session.role !== 'admin') {
    redirect('/');
  }

  const submission = await db.getSubmissionById(id);
  if (!submission) {
    notFound();
  }

  const task = await db.getTaskById(submission.task_id);

  let statusBadge = <Badge variant="neutral">НЕ СДАВАЛ</Badge>;
  if (submission.status === 'pending') {
    statusBadge = (
      <Badge variant="pending" className="flex items-center gap-1">
        <Clock className="w-3 h-3" />
        <span>НА ПРОВЕРКЕ</span>
      </Badge>
    );
  } else if (submission.status === 'reviewed') {
    statusBadge = (
      <Badge variant="reviewed" className="flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
        <span>ПРОВЕРЕНО</span>
      </Badge>
    );
  } else if (submission.status === 'rejected') {
    statusBadge = (
      <Badge variant="rejected" className="flex items-center gap-1">
        <AlertTriangle className="w-3 h-3 text-amber-400" />
        <span>НА ДОРАБОТКУ</span>
      </Badge>
    );
  }

  const formattedDate = new Date(submission.submitted_at).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Header user={session} />

      <main className="max-w-5xl mx-auto px-4 py-6 flex-1 w-full space-y-6">
        {/* Navigation */}
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Назад в журнал отчётов</span>
          </Link>
        </div>

        {/* Student & Task Meta Card */}
        <div className="border border-zinc-800 bg-zinc-900/60 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 text-white">
                  {submission.student_group}
                </span>
                {statusBadge}
                {submission.allow_retake && (
                  <span className="font-mono text-xs font-bold bg-cyan-950/90 text-cyan-300 border border-cyan-500/60 px-2 py-0.5">
                    ПЕРЕСДАЧА РАЗРЕШЕНА
                  </span>
                )}
                {submission.score !== null && (
                  <span className="font-mono text-xs font-bold bg-white text-zinc-950 px-2 py-0.5">
                    {submission.score} / {task?.max_score || 5} б.
                  </span>
                )}
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
                <User className="w-5 h-5 text-zinc-400" />
                <span>{submission.student_name}</span>
              </h1>
            </div>

            <div className="text-xs font-mono text-zinc-400 space-y-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                <span>Сдан: {formattedDate}</span>
              </div>
              {submission.reviewed_at && (
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <span>Проверен: {new Date(submission.reviewed_at).toLocaleString('ru-RU')}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-start gap-2">
              <BookOpen className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-mono font-bold text-white mr-2">
                  {submission.task_module} • Задание №{submission.task_number}:
                </span>
                <span className="text-zinc-300 font-mono">{submission.task_title}</span>
              </div>
            </div>

            {task?.nodes && task.nodes.length > 0 && (
              <div className="flex items-center gap-1 font-mono text-[11px] text-zinc-400 shrink-0">
                <Server className="w-3.5 h-3.5 text-zinc-500" />
                <span>Узлы: {task.nodes.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Section 1: Terminal Output (Proxmox RAW LOG) */}
        <div className="border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              1. Сырой вывод скрипта Proxmox (Raw Log)
            </h2>
            <span className="text-[11px] font-mono text-zinc-500">
              Невалидированный вывод из консоли виртуального стенда
            </span>
          </div>

          <TerminalLog
            content={submission.log_output}
            maxHeight="max-h-96"
            title={`${submission.task_slug}-output.log`}
          />
        </div>

        {/* Section 2: Questions and Answers */}
        <div className="border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              2. Ответы студента на контрольные вопросы
            </h2>
            <span className="text-[11px] font-mono text-zinc-500">
              Теоретическая и практическая часть
            </span>
          </div>

          {task?.questions && task.questions.length > 0 ? (
            <div className="space-y-3">
              {task.questions.map((q, idx) => {
                const answer = submission.answers?.[q.id];
                return (
                  <div key={q.id} className="border border-zinc-800 p-3 bg-zinc-900">
                    <div className="text-xs font-mono font-semibold text-zinc-300 mb-1.5">
                      {idx + 1}. {q.text}
                    </div>
                    {q.options ? (
                      <div className="text-xs font-mono p-2 bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          {answer ? (
                            <span className="text-zinc-200">
                              Ответ студента:{' '}
                              <strong className="text-white bg-zinc-800 px-1.5 py-0.5 border border-zinc-700 mr-1.5">
                                {answer}
                              </strong>
                              {q.options.find(o => o.id === answer) && (
                                <span className="text-zinc-300">
                                  {q.options.find(o => o.id === answer)?.text}
                                </span>
                              )}
                            </span>
                          ) : (
                            <span className="text-zinc-500 italic">Студент не выбрал ответ</span>
                          )}
                        </div>
                        {q.correct_answer && (
                          <div className="shrink-0 text-[11px] font-bold">
                            {answer === q.correct_answer ? (
                              <span className="text-emerald-400 bg-emerald-950/80 px-2 py-0.5 border border-emerald-500/50">
                                ✓ Верно ({q.correct_answer})
                              </span>
                            ) : (
                              <span className="text-rose-400 bg-rose-950/80 px-2 py-0.5 border border-rose-500/50">
                                ✗ Неверно (Правильно: {q.correct_answer})
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs font-mono p-2 bg-zinc-950 border border-zinc-800 text-zinc-100">
                        {answer ? (
                          <span>{answer}</span>
                        ) : (
                          <span className="text-zinc-500 italic">Студент не указал ответ</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs font-mono text-zinc-500">
              К данному заданию нет контрольных вопросов.
            </p>
          )}
        </div>

        {/* Section 3: Review & Grading Form */}
        <div className="border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              3. Вердикт и рецензия преподавателя
            </h2>
            <span className="text-[11px] font-mono text-zinc-500">
              Оценка и комментарий сразу станут видны студенту
            </span>
          </div>

          <ReviewForm submission={submission} />
        </div>
      </main>
    </div>
  );
}
