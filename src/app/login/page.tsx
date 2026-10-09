'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/Logo';
import {
  AlertCircle,
  Terminal,
  ShieldCheck,
  QrCode,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  Smartphone,
} from 'lucide-react';

interface SetupData {
  setupToken: string;
  qrCode: string;
  secret: string;
  username: string;
}

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');

  // 2FA state detection
  const [has2FA, setHas2FA] = useState<boolean | null>(null);
  const [isChecking2FA, setIsChecking2FA] = useState(false);

  // Setup state (first login)
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [copiedSecret, setCopiedSecret] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const totpInputRef = useRef<HTMLInputElement>(null);
  const verifyInputRef = useRef<HTMLInputElement>(null);

  // Debounced check if user has 2FA enabled
  useEffect(() => {
    const trimmed = username.trim();
    if (trimmed.length < 2) {
      setHas2FA(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsChecking2FA(true);
      try {
        const res = await fetch('/api/auth/check-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: trimmed }),
        });
        const data = await res.json();
        setHas2FA(Boolean(data.has2FA));
      } catch {
        setHas2FA(null);
      } finally {
        setIsChecking2FA(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [username]);

  // Focus totp input when 2FA is detected
  useEffect(() => {
    if (has2FA && totpInputRef.current) {
      totpInputRef.current.focus();
    }
  }, [has2FA]);

  // Handle standard login (either 2FA code without password, or password for first setup)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const payload: { username: string; password?: string; totpCode?: string } = {
        username: username.trim(),
      };

      if (has2FA) {
        if (!totpCode.trim()) {
          throw new Error('Введите 6-значный код из Google Authenticator');
        }
        payload.totpCode = totpCode.trim().replace(/\s+/g, '');
      } else {
        if (!password) {
          throw new Error('Укажите пароль');
        }
        payload.password = password;
      }

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Ошибка входа');
      }

      // If user requires 2FA setup (first login with password)
      if (data.requires2FASetup) {
        setSetupData({
          setupToken: data.setupToken,
          qrCode: data.qrCode,
          secret: data.secret,
          username: data.username,
        });
        return;
      }

      // If user had 2FA enabled but tried to submit password
      if (data.requires2FACode) {
        setHas2FA(true);
        return;
      }

      // Login success
      if (data.user?.role === 'admin') {
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

  // Handle completing 2FA setup by verifying initial code
  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupData) return;

    setError(null);
    setIsLoading(true);

    try {
      const clean = verifyCode.trim().replace(/\s+/g, '');
      if (clean.length !== 6) {
        throw new Error('Код подтверждения должен состоять из 6 цифр');
      }

      const res = await fetch('/api/auth/setup-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          setupToken: setupData.setupToken,
          code: clean,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Ошибка подтверждения кода');
      }

      // Successfully linked and authenticated
      if (data.user?.role === 'admin') {
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

  const handleCopySecret = async () => {
    if (!setupData?.secret) return;
    try {
      await navigator.clipboard.writeText(setupData.secret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header Logo */}
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

        {/* MAIN CARD */}
        <div className="border border-zinc-800 bg-zinc-900/60 p-6 shadow-none">
          {/* VIEW 1: REGULAR LOGIN (Either 2FA code without password OR Password for first-timers) */}
          {!setupData ? (
            <div>
              <div className="border-b border-zinc-800 pb-3 mb-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-zinc-200 uppercase font-mono tracking-wider flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-zinc-400" />
                    <span>Авторизация в системе</span>
                  </h2>
                  {has2FA && (
                    <span className="text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 px-2 py-0.5 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>2FA АКТИВНА</span>
                    </span>
                  )}
                </div>
                <p className="text-xs font-mono text-zinc-500 mt-1">
                  {has2FA
                    ? 'Вход по коду приложения Google Authenticator (без пароля)'
                    : 'Введите логин и пароль для входа в систему'}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-zinc-900 border border-red-700/60 text-xs font-mono text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Username Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                      Логин учётной записи
                    </label>
                    {isChecking2FA && (
                      <span className="text-[10px] font-mono text-zinc-500 animate-pulse">
                        Проверка...
                      </span>
                    )}
                  </div>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ivanov"
                    required
                    isMono
                    autoFocus
                  />
                </div>

                {/* SCENARIO A: User has 2FA enabled -> Ask ONLY for 6-digit TOTP code (NO password) */}
                {has2FA ? (
                  <div className="space-y-3 pt-1">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-mono text-emerald-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                          <span>6-значный код Google Authenticator</span>
                        </label>
                        <span className="text-[10px] font-mono text-zinc-500">Без пароля</span>
                      </div>
                      <Input
                        ref={totpInputRef}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9\s]*"
                        maxLength={7}
                        value={totpCode}
                        onChange={(e) => setTotpCode(e.target.value.replace(/[^\d\s]/g, ''))}
                        placeholder="123 456"
                        required
                        isMono
                        className="text-center text-lg font-bold tracking-[0.25em] text-emerald-300 bg-zinc-950 border-emerald-500/40 focus:border-emerald-400"
                      />
                    </div>

                    <p className="text-[11px] font-mono text-zinc-400 leading-relaxed">
                      Откройте <strong>Google Authenticator</strong> на телефоне и введите актуальный код подтверждения.
                    </p>

                    <Button type="submit" isLoading={isLoading} className="w-full mt-2">
                      <span>Войти по коду</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </div>
                ) : (
                  /* SCENARIO B: User does NOT have 2FA yet -> Ask for password to bind 2FA */
                  <div className="space-y-3 pt-1">
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

                    <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">
                      При первом входе система потребует обязательную привязку приложения Google Authenticator.
                    </p>

                    <Button type="submit" isLoading={isLoading} className="w-full mt-2">
                      <span>Войти в систему</span>
                    </Button>
                  </div>
                )}
              </form>
            </div>
          ) : (
            /* VIEW 2: MANDATORY 2FA SETUP (First login) */
            <div className="space-y-5">
              <div className="border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2 text-cyan-300 font-mono font-bold text-xs uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Обязательная привязка 2FA</span>
                </div>
                <h2 className="text-sm font-bold text-white font-mono">
                  Настройка Google Authenticator
                </h2>
                <p className="text-[11px] font-mono text-zinc-400 mt-1 leading-relaxed">
                  Аккаунт <strong className="text-white">{setupData.username}</strong>: привяжите двухэтапную аутентификацию. В дальнейшем вход будет осуществляться только по логину и коду из приложения.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-zinc-900 border border-red-700/60 text-xs font-mono text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Step 1 & QR Code */}
              <div className="space-y-3">
                <div className="text-xs font-mono text-zinc-300 font-bold flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 text-white flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <span>Отсканируйте QR-код в приложении:</span>
                </div>

                <div className="flex flex-col items-center justify-center p-3 bg-white border border-zinc-700 w-fit mx-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={setupData.qrCode}
                    alt="QR Code Google Authenticator"
                    className="w-48 h-48 block"
                  />
                </div>

                {/* Secret Key Text for Manual Entry */}
                <div className="bg-zinc-950 p-2.5 border border-zinc-800 text-[11px] font-mono text-zinc-400 space-y-1">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Или введите ключ вручную:</span>
                    <button
                      type="button"
                      onClick={handleCopySecret}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedSecret ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Скопировано</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Скопировать</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="text-white font-bold select-all tracking-wider break-all bg-zinc-900 p-1.5 border border-zinc-800 text-center">
                    {setupData.secret}
                  </div>
                </div>
              </div>

              {/* Step 2: Verification Code Form */}
              <form onSubmit={handleSetupSubmit} className="space-y-3 pt-2 border-t border-zinc-800">
                <div className="text-xs font-mono text-zinc-300 font-bold flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 text-white flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span>Введите 6-значный код из приложения:</span>
                </div>

                <Input
                  ref={verifyInputRef}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9\s]*"
                  maxLength={7}
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/[^\d\s]/g, ''))}
                  placeholder="000 000"
                  required
                  isMono
                  autoFocus
                  className="text-center text-xl font-bold tracking-[0.3em] text-cyan-300 bg-zinc-950 border-cyan-500/50 focus:border-cyan-400"
                />

                <Button type="submit" isLoading={isLoading} className="w-full">
                  <span>Подтвердить и завершить привязку</span>
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setSetupData(null);
                    setVerifyCode('');
                    setError(null);
                  }}
                  className="w-full text-center text-xs font-mono text-zinc-500 hover:text-zinc-300 pt-1 cursor-pointer flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Вернуться к форме входа</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="text-center">
          <p className="text-[11px] font-mono text-zinc-600">
            Для привязки используйте Google Authenticator, Яндекс Ключ или 2FAS.
          </p>
        </div>
      </div>
    </div>
  );
}
