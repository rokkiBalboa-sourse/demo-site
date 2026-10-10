'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SubmissionWithDetails } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { CheckCircle2, AlertCircle, Save, Check, X, Lock, Unlock } from 'lucide-react';

interface ReviewFormProps {
  submission: SubmissionWithDetails;
}

export function ReviewForm({ submission }: ReviewFormProps) {
  const router = useRouter();
  const [score, setScore] = useState<string>(
    submission.score !== null ? String(submission.score) : ''
  );
  const [isPassed, setIsPassed] = useState<boolean>(
    submission.is_passed !== null ? submission.is_passed : true
  );
  const [feedback, setFeedback] = useState<string>(submission.feedback || '');
  const [allowRetake, setAllowRetake] = useState<boolean>(Boolean(submission.allow_retake));
  const [isLoading, setIsLoading] = useState(false);
  const [isTogglingRetake, setIsTogglingRetake] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleToggleRetake = async (targetValue: boolean) => {
    setIsTogglingRetake(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await fetch('/api/admin/submissions/allow-retake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: submission.id,
          allowRetake: targetValue,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка изменения разрешения');
      setAllowRetake(targetValue);
      setSuccessMessage(
        targetValue
          ? 'Повторная сдача успешно разрешена! Студент теперь может пройти задание повторно.'
          : 'Повторная сдача заблокирована для студента.'
      );
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка при смене статуса пересдачи');
    } finally {
      setIsTogglingRetake(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: submission.id,
          score: score === '' ? null : Number(score),
          isPassed,
          feedback,
          allowRetake,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Ошибка при сохранении вердикта');
      }

      setSuccessMessage('Оценка и комментарий успешно сохранены!');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Произошла непредвиденная ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Verdict Radios */}
      <div>
        <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
          Решение по работе
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setIsPassed(true)}
            className={`p-3 border text-left flex items-center justify-between transition-all cursor-pointer select-none ${
              isPassed
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.35)] ring-1 ring-emerald-500/50 font-bold'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Check className={`w-4 h-4 ${isPassed ? 'text-emerald-400' : 'text-zinc-500'}`} />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                Проверено
              </span>
            </div>
            <span className="text-[11px] font-mono opacity-80">Работа принята</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPassed(false)}
            className={`p-3 border text-left flex items-center justify-between transition-all cursor-pointer select-none ${
              !isPassed
                ? 'bg-amber-950/80 text-amber-300 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.35)] ring-1 ring-amber-500/50 font-bold'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <X className={`w-4 h-4 ${!isPassed ? 'text-amber-400' : 'text-zinc-500'}`} />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                На доработку
              </span>
            </div>
            <span className="text-[11px] font-mono opacity-80">Требуются исправления</span>
          </button>
        </div>
      </div>

      {/* Score Buttons (5, 4, 3, 2) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-mono uppercase text-zinc-400">
            Оценка за задание
          </label>
          {score && (
            <button
              type="button"
              onClick={() => setScore('')}
              className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 underline cursor-pointer"
            >
              Снять оценку
            </button>
          )}
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[
            {
              value: '5',
              title: '5',
              desc: 'Отлично',
              activeClass:
                'bg-emerald-950/80 text-emerald-300 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.35)] ring-1 ring-emerald-500/50 font-bold',
            },
            {
              value: '4',
              title: '4',
              desc: 'Хорошо',
              activeClass:
                'bg-cyan-950/80 text-cyan-300 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.35)] ring-1 ring-cyan-500/50 font-bold',
            },
            {
              value: '3',
              title: '3',
              desc: 'Удовлетворительно',
              activeClass:
                'bg-amber-950/80 text-amber-300 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.35)] ring-1 ring-amber-500/50 font-bold',
            },
            {
              value: '2',
              title: '2',
              desc: 'Неудовлетворительно',
              activeClass:
                'bg-rose-950/80 text-rose-300 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.35)] ring-1 ring-rose-500/50 font-bold',
            },
          ].map(grade => {
            const isSelected = score === grade.value;
            return (
              <button
                key={grade.value}
                type="button"
                onClick={() => setScore(isSelected ? '' : grade.value)}
                className={`py-3 px-2 border text-center flex flex-col items-center justify-center transition-all cursor-pointer select-none font-mono ${
                  isSelected
                    ? grade.activeClass
                    : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/60'
                }`}
              >
                <span className="text-xl font-bold leading-none">{grade.title}</span>
                <span className="text-[10px] sm:text-[11px] opacity-80 mt-1 truncate max-w-full">
                  {grade.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback Textarea */}
      <div>
        <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
          Замечания и рецензия преподавателя
        </label>
        <Textarea
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          rows={4}
          placeholder="Укажите, что настроено правильно, и опишите найденные недочёты или ошибки в конфигурации..."
          className="text-xs bg-zinc-950 border-zinc-800 text-zinc-100 resize-y"
        />
      </div>

      {/* Retake Control Section */}
      <div className="border border-zinc-800 bg-zinc-950 p-4 space-y-3 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {allowRetake ? (
              <Unlock className="w-4 h-4 text-cyan-400 shrink-0" />
            ) : (
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span className="font-bold uppercase tracking-wider text-zinc-200">
              Повторное прохождение (Пересдача)
            </span>
          </div>

          <span
            className={`px-2 py-0.5 text-[11px] font-bold border self-start sm:self-auto ${
              allowRetake
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800'
            }`}
          >
            {allowRetake ? 'ПЕРЕСДАЧА РАЗРЕШЕНА' : 'ПЕРЕСДАЧА ЗАБЛОКИРОВАНА'}
          </span>
        </div>

        <p className="text-[11px] text-zinc-400 leading-relaxed">
          {Number(score) >= 3
            ? 'Студент с оценкой 3–5 не может пересдать задание самостоятельно. Включите разрешение, если студент запросил пересдачу для исправления работы.'
            : Number(score) === 2 || !isPassed
              ? 'При оценке 2 (или «На доработку») студент может отправить исправления повторно.'
              : 'По умолчанию положительная оценка (3, 4, 5) блокирует повторное прохождение задания студентом.'}
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-zinc-800/80">
          <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-300 hover:text-white">
            <input
              type="checkbox"
              checked={allowRetake}
              onChange={e => setAllowRetake(e.target.checked)}
              className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-emerald-500 focus:ring-0 cursor-pointer"
            />
            <span className="text-[11px]">Разрешить пересдачу при сохранении</span>
          </label>

          <button
            type="button"
            disabled={isTogglingRetake}
            onClick={() => handleToggleRetake(!allowRetake)}
            className={`px-3 py-1.5 border text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
              allowRetake
                ? 'bg-zinc-900 hover:bg-zinc-800 text-amber-300 border-zinc-700'
                : 'bg-cyan-950/80 hover:bg-cyan-900 text-cyan-200 border-cyan-600/60'
            }`}
          >
            {allowRetake ? (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Отозвать разрешение прямо сейчас</span>
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5" />
                <span>Разрешить пересдачу прямо сейчас</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-zinc-900 border border-red-700/60 text-xs font-mono text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-white text-zinc-950 text-xs font-mono font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-zinc-950" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-2">
        <Button type="submit" isLoading={isLoading} size="md" className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          <span>Сохранить результат проверки</span>
        </Button>
      </div>
    </form>
  );
}
