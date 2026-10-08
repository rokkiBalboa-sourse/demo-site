'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SubmissionWithDetails } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { CheckCircle2, AlertCircle, Save, Check, X } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
              <span className="font-mono text-xs font-bold uppercase tracking-wider">Проверено</span>
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
              <span className="font-mono text-xs font-bold uppercase tracking-wider">На доработку</span>
            </div>
            <span className="text-[11px] font-mono opacity-80">Требуются исправления</span>
          </button>
        </div>
      </div>

      {/* Score */}
      <div>
        <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
          Оценка / Балл (от 0 до 5)
        </label>
        <div className="flex items-center gap-3">
          <Input
            type="number"
            min={0}
            max={5}
            value={score}
            onChange={(e) => setScore(e.target.value)}
            placeholder="5"
            isMono
            className="w-36 text-sm font-bold bg-zinc-950 border-zinc-800 text-white"
          />
          <span className="text-xs font-mono text-zinc-500">баллов за задание (макс. 5)</span>
        </div>
      </div>

      {/* Feedback Textarea */}
      <div>
        <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
          Замечания и рецензия преподавателя
        </label>
        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={4}
          placeholder="Укажите, что настроено правильно, и опишите найденные недочёты или ошибки в конфигурации..."
          className="text-xs bg-zinc-950 border-zinc-800 text-zinc-100 resize-y"
        />
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
