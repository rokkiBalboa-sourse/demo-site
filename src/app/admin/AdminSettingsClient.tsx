'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  ShieldCheck,
  KeyRound,
  Download,
  Upload,
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  Server,
  FileJson,
} from 'lucide-react';

export function AdminSettingsClient() {
  // Admin credentials state
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [adminId, setAdminId] = useState('');
  const [admin2FAEnabled, setAdmin2FAEnabled] = useState(false);
  const [isResetting2FA, setIsResetting2FA] = useState(false);
  const [reset2FASuccess, setReset2FASuccess] = useState<string | null>(null);

  // Backup & restore state
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState<string | null>(null);
  const [backupError, setBackupError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data.user) {
            setAdminId(data.user.id);
            setUsername(data.user.username);
            setFullName(data.user.full_name);
            setAdmin2FAEnabled(Boolean(data.user.two_factor_enabled));
          }
        }
      } catch {
        // ignore
      }
    };
    void loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleResetAdmin2FA = async () => {
    if (!adminId) return;
    setIsResetting2FA(true);
    setReset2FASuccess(null);
    try {
      const res = await fetch('/api/admin/students/reset-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: adminId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка сброса 2FA');
      setAdmin2FAEnabled(false);
      setReset2FASuccess(
        '2FA администратора успешно сброшена! При следующем входе по паролю система предложит настроить её заново.'
      );
      setTimeout(() => setReset2FASuccess(null), 6000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Ошибка сброса 2FA');
    } finally {
      setIsResetting2FA(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(null);
    setProfileError(null);
    setIsLoadingProfile(true);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          fullName,
          password: newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Ошибка при сохранении данных');
      }

      setProfileSuccess('Учётные данные администратора успешно обновлены!');
      setNewPassword('');
    } catch (err: unknown) {
      setProfileError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleExportBackup = async () => {
    setBackupSuccess(null);
    setBackupError(null);
    setIsExporting(true);

    try {
      const res = await fetch('/api/admin/backup');
      if (!res.ok) {
        throw new Error('Не удалось выгрузить базу данных');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-sudostudy-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setBackupSuccess('Резервная копия базы данных успешно скачана!');
    } catch (err: unknown) {
      setBackupError(err instanceof Error ? err.message : 'Ошибка при экспорте');
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImportBackup = async () => {
    if (!selectedFile) {
      setBackupError('Пожалуйста, выберите файл резервной копии .json');
      return;
    }

    if (
      !confirm(
        'Вы уверены, что хотите восстановить базу данных? Текущие данные будут заменены содержимым из файла.'
      )
    ) {
      return;
    }

    setBackupSuccess(null);
    setBackupError(null);
    setIsImporting(true);

    try {
      const text = await selectedFile.text();
      const json = JSON.parse(text);

      const res = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Ошибка при восстановлении базы данных');
      }

      setBackupSuccess(data.message || 'База данных успешно восстановлена!');
      setSelectedFile(null);
    } catch (err: unknown) {
      setBackupError(err instanceof Error ? err.message : 'Ошибка при импорте файла');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-8 font-mono">
      {/* SECTION 1: ADMIN ACCOUNT CREDENTIALS */}
      <div className="border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <div className="w-9 h-9 rounded bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Учётная запись администратора
            </h2>
            <p className="text-xs text-zinc-400">
              Смена логина, отображаемого имени и пароля преподавателя
            </p>
          </div>
        </div>

        {profileSuccess && (
          <div className="border border-emerald-500/50 bg-emerald-950/40 p-3.5 flex items-center gap-2.5 text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{profileSuccess}</span>
          </div>
        )}

        {profileError && (
          <div className="border border-rose-500/50 bg-rose-950/40 p-3.5 flex items-center gap-2.5 text-rose-300 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{profileError}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-300">Логин администратора:</label>
            <Input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="admin"
              required
              className="bg-zinc-950 text-white border-zinc-700"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-zinc-300">ФИО / Отображаемое имя:</label>
            <Input
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Кузнецов Валерий Сергеевич"
              required
              className="bg-zinc-950 text-white border-zinc-700"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-zinc-300">
              Новый пароль (оставьте пустым, если не хотите менять):
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Введите новый пароль"
                className="bg-zinc-950 text-white border-zinc-700 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-4">
            <Button
              type="submit"
              isLoading={isLoadingProfile}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              Сохранить изменения
            </Button>
          </div>
        </form>

        {reset2FASuccess && (
          <div className="border border-emerald-500/50 bg-emerald-950/40 p-3.5 flex items-center gap-2.5 text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{reset2FASuccess}</span>
          </div>
        )}

        {/* 2FA Status & Reset for Admin */}
        <div className="p-3.5 bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-200">
                Двухэтапная аутентификация (Google Authenticator):
              </span>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold border ${
                  admin2FAEnabled
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                }`}
              >
                {admin2FAEnabled ? 'АКТИВНА' : 'НЕ ПРИВЯЗАНА'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              {admin2FAEnabled
                ? 'Вход в панель администратора защищён кодом Google Authenticator без пароля.'
                : 'При входе с паролем система потребует настроить Google Authenticator.'}
            </p>
          </div>

          {admin2FAEnabled && (
            <button
              type="button"
              disabled={isResetting2FA}
              onClick={handleResetAdmin2FA}
              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-bold transition-colors cursor-pointer shrink-0"
            >
              Сбросить 2FA
            </button>
          )}
        </div>

        <div className="mt-4 p-3.5 bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 space-y-1.5">
          <div className="flex items-center gap-2 text-zinc-200 font-semibold">
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            <span>Альтернативный способ через файл .env:</span>
          </div>
          <p className="leading-relaxed">
            Вы также можете задать учётные данные на сервере в файле{' '}
            <code className="text-cyan-300 bg-zinc-900 px-1 py-0.5">/opt/demo-practics/.env</code>:
          </p>
          <pre className="p-2 bg-zinc-900 border border-zinc-800 text-cyan-300 text-[11px] overflow-x-auto">
            {`ADMIN_USERNAME=admin
ADMIN_PASSWORD=ваш_надежный_пароль
ADMIN_NAME="Кузнецов Валерий Сергеевич"`}
          </pre>
          <p className="text-[11px] text-zinc-500">
            При запуске контейнера система автоматически синхронизирует учётную запись с этими
            переменными.
          </p>
        </div>
      </div>

      {/* SECTION 2: DATABASE BACKUP & RESTORE */}
      <div className="border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <div className="w-9 h-9 rounded bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Сохранность данных и Резервное копирование (JSON)
            </h2>
            <p className="text-xs text-zinc-400">
              Экспорт и импорт базы данных студентов и сданных отчётов
            </p>
          </div>
        </div>

        {backupSuccess && (
          <div className="border border-emerald-500/50 bg-emerald-950/40 p-3.5 flex items-center gap-2.5 text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{backupSuccess}</span>
          </div>
        )}

        {backupError && (
          <div className="border border-rose-500/50 bg-rose-950/40 p-3.5 flex items-center gap-2.5 text-rose-300 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{backupError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export card */}
          <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-xs uppercase">
              <Download className="w-4 h-4 text-emerald-400" />
              <span>1. Скачать резервную копию</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Выгружает актуальный снимок всей базы (учётные записи студентов, их группы, пароли,
              отправленные отчёты и рецензии) в JSON-файл на ваш компьютер.
            </p>
            <Button
              type="button"
              onClick={handleExportBackup}
              isLoading={isExporting}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs border border-zinc-700 flex items-center justify-center gap-2"
            >
              <FileJson className="w-4 h-4 text-emerald-400" />
              <span>Скачать резервную копию (JSON)</span>
            </Button>
          </div>

          {/* Import card */}
          <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-xs uppercase">
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>2. Восстановить базу из файла</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Восстанавливает базу данных из ранее сохранённого JSON-файла. Перед перезаписью на
              сервере автоматически создаётся страховочный файл бэкапа.
            </p>
            <div className="space-y-2">
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="block w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:text-xs file:font-mono file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer"
              />
              <Button
                type="button"
                onClick={handleImportBackup}
                isLoading={isImporting}
                disabled={!selectedFile}
                className="w-full bg-cyan-700 hover:bg-cyan-600 disabled:opacity-50 text-white text-xs flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Восстановить БД из выбранного файла</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Protection Explanation */}
        <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 text-xs text-zinc-300 space-y-2">
          <div className="flex items-center gap-2 font-bold text-emerald-300 uppercase tracking-wide">
            <ShieldCheck className="w-4 h-4" />
            <span>Защита данных от стирания при пересборке</span>
          </div>
          <p className="leading-relaxed text-zinc-300">
            Теперь файл базы данных{' '}
            <code className="text-emerald-300 bg-black/50 px-1 py-0.5">.data/store.json</code>{' '}
            полностью <strong>исключён из Git-репозитория</strong> (добавлен в .gitignore).
          </p>
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li>
              Команды <code className="text-zinc-200">git pull</code> и{' '}
              <code className="text-zinc-200">git reset --hard</code> на сервере больше{' '}
              <strong>никогда не перезапишут</strong> вашу базу данных.
            </li>
            <li>
              Каталог <code className="text-zinc-200">/opt/demo-practics/.data</code> примонтирован
              в Docker volume <code className="text-zinc-200">./.data:/app/.data</code>, поэтому
              пересборка контейнеров сохраняет 100% данных на диске сервера.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
