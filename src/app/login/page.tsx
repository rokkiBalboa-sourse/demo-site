'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/Logo';
import { AlertCircle, Terminal } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Ошибка входа');
      }

      if (data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4">
      {/* Container */}
      <div className="w-full max-w-md space-y-6">
        {/* Header with Visible High-Contrast Logo */}
        <div className="flex flex-col items-center text-center space-y-3">
          <Logo size="lg" showSubtitle={false} />
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white font-mono">
              Интерактивная отчётность
            </h1>
            <p className="text-xs font-mono text-zinc-500 mt-1">
              Демонстрационный экзамен 09.02.06 • Сетевое и системное администрирование
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="border border-zinc-800 bg-zinc-900/60 p-6 shadow-none">
          <div className="border-b border-zinc-800 pb-3 mb-5">
            <h2 className="text-xs font-bold text-zinc-200 uppercase font-mono tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-zinc-400" />
              <span>Авторизация в системе</span>
            </h2>
            <p className="text-xs font-mono text-zinc-500 mt-0.5">
              Введите логин и пароль, выданные преподавателем
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-zinc-900 border border-red-700/60 text-xs font-mono text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                Логин учётной записи
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ivanov"
                required
                isMono
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                Пароль
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                isMono
              />
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full mt-2">
              Войти в систему
            </Button>
          </form>
        </div>

        {/* Footer Note */}
        <div className="text-center">
          <p className="text-[11px] font-mono text-zinc-600">
            Регистрация закрыта. 1 студент = 1 учётная запись.
          </p>
        </div>
      </div>
    </div>
  );
}
