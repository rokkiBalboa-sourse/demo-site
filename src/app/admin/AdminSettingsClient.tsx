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
  Terminal,
  Copy,
  Check,
} from 'lucide-react';

interface DatabaseInfo {
  isMySql: boolean;
  type: string;
  host: string;
  port: string;
  database: string;
  user: string;
  stats?: {
    usersCount: number;
    tasksCount: number;
    submissionsCount: number;
  };
}

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

  // Database info state
  const [dbInfo, setDbInfo] = useState<DatabaseInfo | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

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
          if (data.database) {
            setDbInfo(data.database);
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

  const handleCopy = (text: string, label: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedCmd(label);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

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
          password: newPassword ? newPassword : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Не удалось сохранить настройки');
      }

      setProfileSuccess('Данные учётной записи администратора успешно обновлены!');
      setNewPassword('');
      setTimeout(() => setProfileSuccess(null), 4000);
    } catch (err: unknown) {
      setProfileError(err instanceof Error ? err.message : 'Ошибка сохранения');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleExportBackup = async () => {
    setIsExporting(true);
    setBackupSuccess(null);
    setBackupError(null);
    try {
      const res = await fetch('/api/admin/backup');
      if (!res.ok) {
        throw new Error('Не удалось выгрузить базу данных');
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const dateStr = new Date().toISOString().split('T')[0];
      a.download = `sudostudy-db-backup-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setBackupSuccess('Резервная копия базы данных успешно скачана!');
      setTimeout(() => setBackupSuccess(null), 4000);
    } catch (err: unknown) {
      setBackupError(err instanceof Error ? err.message : 'Ошибка при экспорте бэкапа');
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
    if (!selectedFile) return;

    const confirmed = window.confirm(
      'Вы уверены, что хотите восстановить базу данных? Текущие данные будут заменены содержимым из файла.'
    );
    if (!confirmed) return;

    setIsImporting(true);
    setBackupSuccess(null);
    setBackupError(null);

    try {
      const text = await selectedFile.text();
      const parsed = JSON.parse(text);

      const res = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Ошибка при восстановлении базы данных');
      }

      setBackupSuccess(data.message || 'База данных успешно восстановлена!');
      setSelectedFile(null);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: unknown) {
      setBackupError(err instanceof Error ? err.message : 'Ошибка восстановления бэкапа');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-8 font-mono">
      {/* SECTION 1: DATABASE STATUS & MANAGEMENT */}
      <div className="border border-zinc-800 bg-zinc-900/60 p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <span>База данных системы</span>
                {dbInfo?.isMySql ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    MySQL 8.0 (Активна)
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950/90 text-amber-300 border border-amber-500/50 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Локальный JSON (store.json)
                  </span>
                )}
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Хранение пользователей, 32 заданий экзамена, сданных отчётов и оценок
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          {dbInfo?.stats && (
            <div className="flex items-center gap-4 bg-zinc-950 p-2.5 border border-zinc-800 text-xs">
              <div className="text-center px-2">
                <div className="text-zinc-500 text-[10px] uppercase">Студентов</div>
                <div className="font-bold text-white text-sm">{dbInfo.stats.usersCount}</div>
              </div>
              <div className="h-6 w-px bg-zinc-800" />
              <div className="text-center px-2">
                <div className="text-zinc-500 text-[10px] uppercase">Заданий</div>
                <div className="font-bold text-cyan-400 text-sm">{dbInfo.stats.tasksCount}</div>
              </div>
              <div className="h-6 w-px bg-zinc-800" />
              <div className="text-center px-2">
                <div className="text-zinc-500 text-[10px] uppercase">Сдач в базе</div>
                <div className="font-bold text-emerald-400 text-sm">
                  {dbInfo.stats.submissionsCount}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Database Connection Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-zinc-950 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase block">Движок хранилища</span>
            <span className="font-bold text-zinc-200">
              {dbInfo?.isMySql ? 'MySQL 8.0 (InnoDB, utf8mb4)' : 'JSON файл (.data/store.json)'}
            </span>
          </div>
          <div className="p-3 bg-zinc-950 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase block">Хост и порт</span>
            <span className="font-bold text-cyan-400">
              {dbInfo?.host || '127.0.0.1'}:{dbInfo?.port || '3306'}
            </span>
          </div>
          <div className="p-3 bg-zinc-950 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase block">Имя базы данных</span>
            <span className="font-bold text-emerald-400">
              {dbInfo?.database || 'demo_practics'}
            </span>
          </div>
          <div className="p-3 bg-zinc-950 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase block">Пользователь БД</span>
            <span className="font-bold text-zinc-300">{dbInfo?.user || 'sudostudy'}</span>
          </div>
        </div>

        {/* Database Command Cheat-Sheet */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Шпаргалка команд управления базой данных (Docker / CLI)</span>
            </h3>
            <span className="text-[10px] text-zinc-500">Кликните для копирования команды</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Command 1: Start container */}
            <div className="p-3 bg-zinc-950 border border-zinc-800 flex flex-col justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase block">
                  1. Запуск MySQL в Docker
                </span>
                <code className="text-[11px] text-cyan-300 block mt-1 break-all select-all">
                  docker compose up -d mysql
                </code>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleCopy('docker compose up -d mysql', 'start')}
                className="w-full text-[10px] py-1 h-7 border-zinc-700 bg-zinc-900 hover:bg-zinc-800"
              >
                {copiedCmd === 'start' ? (
                  <Check className="w-3 h-3 text-emerald-400 mr-1" />
                ) : (
                  <Copy className="w-3 h-3 text-zinc-400 mr-1" />
                )}
                {copiedCmd === 'start' ? 'Скопировано!' : 'Скопировать'}
              </Button>
            </div>

            {/* Command 2: Run migration */}
            <div className="p-3 bg-zinc-950 border border-zinc-800 flex flex-col justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase block">
                  2. Импорт из JSON в MySQL
                </span>
                <code className="text-[11px] text-emerald-300 block mt-1 break-all select-all">
                  npm run db:migrate:mysql
                </code>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleCopy('npm run db:migrate:mysql', 'migrate')}
                className="w-full text-[10px] py-1 h-7 border-zinc-700 bg-zinc-900 hover:bg-zinc-800"
              >
                {copiedCmd === 'migrate' ? (
                  <Check className="w-3 h-3 text-emerald-400 mr-1" />
                ) : (
                  <Copy className="w-3 h-3 text-zinc-400 mr-1" />
                )}
                {copiedCmd === 'migrate' ? 'Скопировано!' : 'Скопировать'}
              </Button>
            </div>

            {/* Command 3: Dump MySQL */}
            <div className="p-3 bg-zinc-950 border border-zinc-800 flex flex-col justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase block">
                  3. Создание SQL дампа базы
                </span>
                <code className="text-[11px] text-amber-300 block mt-1 break-all select-all">
                  mysqldump -u sudostudy -p demo_practics &gt; backup.sql
                </code>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  handleCopy(
                    'docker exec -t sudostudy_mysql mysqldump -u sudostudy -psecure_password demo_practics > backup.sql',
                    'dump'
                  )
                }
                className="w-full text-[10px] py-1 h-7 border-zinc-700 bg-zinc-900 hover:bg-zinc-800"
              >
                {copiedCmd === 'dump' ? (
                  <Check className="w-3 h-3 text-emerald-400 mr-1" />
                ) : (
                  <Copy className="w-3 h-3 text-zinc-400 mr-1" />
                )}
                {copiedCmd === 'dump' ? 'Скопировано!' : 'Скопировать для Docker'}
              </Button>
            </div>
          </div>
        </div>

        {/* BACKUP & RESTORE CARDS (JSON Snapshot) */}
        <div className="border-t border-zinc-800 pt-5 space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Резервное копирование и перенос базы данных (JSON-снимок)
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Позволяет быстро выгрузить полную копию текущих данных или развернуть её на другом
              сервере
            </p>
          </div>

          {backupSuccess && (
            <div className="border border-emerald-500/50 bg-emerald-950/40 p-3 flex items-center gap-2.5 text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{backupSuccess}</span>
            </div>
          )}

          {backupError && (
            <div className="border border-rose-500/50 bg-rose-950/40 p-3 flex items-center gap-2.5 text-rose-300 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{backupError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Export card */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase">
                <Download className="w-4 h-4 text-emerald-400" />
                <span>1. Скачать резервную копию</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Выгружает снимок актуальной базы (учётные записи студентов, пароли, отчёты и
                рецензии) в JSON-файл на ваш компьютер.
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
                Восстанавливает базу данных из ранее сохранённого JSON-файла. Автоматически
                синхронизирует пользователей и сдачи в активный движок (MySQL или JSON).
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
        </div>
      </div>

      {/* SECTION 2: ADMIN PROFILE & SECURITY */}
      <div className="border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Профиль Администратора и Безопасность
              </h2>
              <p className="text-xs text-zinc-400">
                Учётные данные суперпользователя и управление двухэтапной аутентификацией (2FA)
              </p>
            </div>
          </div>

          {/* 2FA Status Badge */}
          {admin2FAEnabled ? (
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              2FA АКТИВНА
            </span>
          ) : (
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-amber-950/90 text-amber-300 border border-amber-500/50 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              2FA НЕ ПРИВЯЗАНА
            </span>
          )}
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

        {reset2FASuccess && (
          <div className="border border-amber-500/50 bg-amber-950/40 p-3.5 flex items-center gap-2.5 text-amber-300 text-xs">
            <RefreshCw className="w-4 h-4 shrink-0 animate-spin" />
            <span>{reset2FASuccess}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              Логин учётной записи (администратора)
            </label>
            <Input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="adm1"
              required
              className="font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              ФИО преподавателя / администратора
            </label>
            <Input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Кузнецов Валерий Сергеевич"
              required
              className="font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Новый пароль</span>
              <span className="text-[10px] text-zinc-500 normal-case">
                Оставьте пустым, если не хотите менять
              </span>
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="adm123"
                className="font-mono text-xs pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">
              Пароль автоматически хешируется по алгоритму scrypt с уникальной солью.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              type="submit"
              isLoading={isLoadingProfile}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-6 py-2"
            >
              Сохранить изменения
            </Button>

            {admin2FAEnabled && (
              <Button
                type="button"
                variant="outline"
                onClick={handleResetAdmin2FA}
                isLoading={isResetting2FA}
                className="border-amber-700/60 text-amber-300 hover:bg-amber-950/40 text-xs flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Сбросить 2FA администратора</span>
              </Button>
            )}
          </div>
        </form>

        {/* .env instructions */}
        <div className="mt-4 p-3.5 bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 space-y-1.5">
          <div className="flex items-center gap-2 text-zinc-200 font-semibold">
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            <span>Настройка учётных данных через .env:</span>
          </div>
          <p className="leading-relaxed">
            Учётные данные администратора также можно переопределить через файл{' '}
            <code className="text-cyan-300 bg-zinc-900 px-1 py-0.5">.env</code>:
          </p>
          <pre className="p-2 bg-zinc-900 border border-zinc-800 text-cyan-300 text-[11px] overflow-x-auto">
            {`ADMIN_USERNAME=adm1
ADMIN_PASSWORD=adm123
ADMIN_NAME="Кузнецов Валерий Сергеевич"`}
          </pre>
          <p className="text-[11px] text-zinc-500">
            При первом старте система автоматически инициализирует учётную запись с этими
            параметрами.
          </p>
        </div>
      </div>
    </div>
  );
}
