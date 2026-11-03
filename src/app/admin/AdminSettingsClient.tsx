'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  ShieldCheck,
  Download,
  Upload,
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Check,
  ChevronDown,
  Layers,
  Calendar,
  Save,
} from 'lucide-react';
import { ExamYearSettings, GroupExamAssignment } from '@/lib/types';

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

interface AdminSettingsClientProps {
  availableGroups?: string[];
}

export function AdminSettingsClient({ availableGroups = [] }: AdminSettingsClientProps) {
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

  const [dbInfo, setDbInfo] = useState<DatabaseInfo | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState<string | null>(null);
  const [backupError, setBackupError] = useState<string | null>(null);

  // Exam Years & Modules Settings
  const [examMode, setExamMode] = useState<'tabs' | 'restricted'>('tabs');
  const [defaultYear, setDefaultYear] = useState<number>(2026);
  const [groupAssignments, setGroupAssignments] = useState<Record<string, GroupExamAssignment>>({});
  const [isLoadingExamSettings, setIsLoadingExamSettings] = useState(false);
  const [isSavingExamSettings, setIsSavingExamSettings] = useState(false);
  const [examSettingsSuccess, setExamSettingsSuccess] = useState<string | null>(null);
  const [examSettingsError, setExamSettingsError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSaveExamSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingExamSettings(true);
    setExamSettingsSuccess(null);
    setExamSettingsError(null);

    try {
      const res = await fetch('/api/admin/settings/exam-years', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: {
            mode: examMode,
            defaultYear,
            groupAssignments,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Ошибка при сохранении настроек годов');
      }

      setExamSettingsSuccess('Настройки экзаменационных годов успешно сохранены!');
      setTimeout(() => setExamSettingsSuccess(null), 3500);
    } catch (err: unknown) {
      setExamSettingsError(err instanceof Error ? err.message : 'Ошибка при сохранении');
    } finally {
      setIsSavingExamSettings(false);
    }
  };

  const handleGroupAssignmentChange = (group: string, yearValue: string) => {
    setGroupAssignments(prev => {
      const copy = { ...prev };
      if (yearValue === 'all') {
        copy[group] = { year: 'all' };
      } else {
        copy[group] = { year: Number(yearValue) };
      }
      return copy;
    });
  };

  const effectiveGroups = availableGroups.length > 0 ? availableGroups : ['9СА-421', '9СА-422', '9СА-423'];

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

    const loadExamSettings = async () => {
      try {
        setIsLoadingExamSettings(true);
        const res = await fetch('/api/admin/settings/exam-years');
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data.settings) {
            setExamMode(data.settings.mode || 'tabs');
            setDefaultYear(data.settings.defaultYear || 2026);
            setGroupAssignments(data.settings.groupAssignments || {});
          }
        }
      } catch {
        // ignore
      } finally {
        if (isMounted) setIsLoadingExamSettings(false);
      }
    };

    void loadProfile();
    void loadExamSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopy = (text: string, label: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedCmd(label);
    setTimeout(() => setCopiedCmd(null), 2000);
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
      setReset2FASuccess('2FA сброшена. При следующем входе настройте её заново.');
      setTimeout(() => setReset2FASuccess(null), 5000);
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

      setProfileSuccess('Данные успешно сохранены!');
      setNewPassword('');
      setTimeout(() => setProfileSuccess(null), 3000);
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
      if (!res.ok) throw new Error('Не удалось выгрузить данные');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const dateStr = new Date().toISOString().split('T')[0];
      a.download = `backup-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setBackupSuccess('Бэкап JSON скачан');
      setTimeout(() => setBackupSuccess(null), 3000);
    } catch (err: unknown) {
      setBackupError(err instanceof Error ? err.message : 'Ошибка экспорта');
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const confirmed = window.confirm(
      'Восстановить базу из выбранного файла? Текущие записи будут синхронизированы.'
    );
    if (!confirmed) {
      e.target.value = '';
      return;
    }

    setIsImporting(true);
    setBackupSuccess(null);
    setBackupError(null);

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      const res = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Ошибка восстановления');
      }

      setBackupSuccess('База успешно восстановлена!');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: unknown) {
      setBackupError(err instanceof Error ? err.message : 'Ошибка восстановления');
    } finally {
      setIsImporting(false);
      e.target.value = '';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 font-mono py-6">
      {/* 0. РАСПРЕДЕЛЕНИЕ ГОДОВ И МОДУЛЕЙ (2026 / 2027) */}
      <div className="border border-zinc-800 bg-zinc-900/50 p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Экзаменационные годы и группы (2026 / 2027)
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
            2 года • 6 модулей
          </span>
        </div>

        {examSettingsSuccess && (
          <div className="text-[11px] text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 px-3 py-1.5 flex items-center gap-2 rounded">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{examSettingsSuccess}</span>
          </div>
        )}

        {examSettingsError && (
          <div className="text-[11px] text-rose-400 bg-rose-950/30 border border-rose-500/30 px-3 py-1.5 flex items-center gap-2 rounded">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{examSettingsError}</span>
          </div>
        )}

        <form onSubmit={handleSaveExamSettings} className="space-y-4">
          {/* Mode Selector */}
          <div>
            <label className="block text-[10px] font-semibold text-zinc-400 uppercase mb-1.5">
              Режим доступа студентов к экзаменационным модулям:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label
                className={`p-2.5 border rounded cursor-pointer transition flex items-start gap-2.5 ${
                  examMode === 'tabs'
                    ? 'border-emerald-500/60 bg-emerald-950/20 text-white'
                    : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <input
                  type="radio"
                  name="examMode"
                  value="tabs"
                  checked={examMode === 'tabs'}
                  onChange={() => setExamMode('tabs')}
                  className="mt-0.5 accent-emerald-500"
                />
                <div>
                  <div className="font-bold text-zinc-200">Общий доступ со вкладками</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">
                    Студенты видят вкладки выбора года (2026 и 2027) и могут переключаться между ними
                  </div>
                </div>
              </label>

              <label
                className={`p-2.5 border rounded cursor-pointer transition flex items-start gap-2.5 ${
                  examMode === 'restricted'
                    ? 'border-cyan-500/60 bg-cyan-950/20 text-white'
                    : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <input
                  type="radio"
                  name="examMode"
                  value="restricted"
                  checked={examMode === 'restricted'}
                  onChange={() => setExamMode('restricted')}
                  className="mt-0.5 accent-cyan-500"
                />
                <div>
                  <div className="font-bold text-zinc-200">Разграничение по учебным группам</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">
                    Каждой учебной группе строго назначается конкретный экзаменационный год или модули
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Default Year Selector */}
          <div className="flex items-center gap-3">
            <label className="text-[10px] font-semibold text-zinc-400 uppercase">
              Год по умолчанию:
            </label>
            <select
              value={defaultYear}
              onChange={e => setDefaultYear(Number(e.target.value))}
              className="h-8 bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs px-2.5 rounded focus:outline-none focus:border-zinc-600 font-mono cursor-pointer"
            >
              <option value={2026}>2026 год (3 модуля • 32 задания)</option>
              <option value={2027}>2027 год (3 модуля • 32 задания)</option>
            </select>
          </div>

          {/* Group Assignments Table */}
          <div className="space-y-2 pt-2 border-t border-zinc-800/80">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase">
                Назначение годов для групп:
              </span>
              <span className="text-[10px] text-zinc-500">
                {examMode === 'restricted' ? 'Активно строгое назначение' : 'Применяется при ограничении'}
              </span>
            </div>

            <div className="border border-zinc-800 rounded overflow-hidden divide-y divide-zinc-800/60">
              {effectiveGroups.map(group => {
                const currentAssigned = groupAssignments[group]?.year ?? 'all';
                return (
                  <div
                    key={group}
                    className="p-2.5 bg-zinc-950/60 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-200 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                        {group}
                      </span>
                    </div>

                    <select
                      value={String(currentAssigned)}
                      onChange={e => handleGroupAssignmentChange(group, e.target.value)}
                      className="h-7.5 bg-zinc-900 border border-zinc-700/80 text-zinc-200 text-xs px-2 rounded focus:outline-none focus:border-zinc-500 font-mono cursor-pointer"
                    >
                      <option value="all">Все года (с переключением вкладок)</option>
                      <option value="2026">Только 2026 год (3 модуля)</option>
                      <option value="2027">Только 2027 год (3 модуля)</option>
                    </select>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end">
            <Button
              type="submit"
              size="sm"
              isLoading={isSavingExamSettings}
              className="h-8 text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-4 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Сохранить настройки годов</span>
            </Button>
          </div>
        </form>
      </div>

      {/* 1. БАЗА ДАННЫХ */}
      <div className="border border-zinc-800 bg-zinc-900/50 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                База данных
              </span>
              {dbInfo?.isMySql ? (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  MySQL
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] rounded bg-amber-950/80 text-amber-400 border border-amber-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  JSON
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400">
              {dbInfo?.host || '127.0.0.1'}:{dbInfo?.port || '3306'} /{' '}
              {dbInfo?.database || 'demo_practics'}
              {dbInfo?.stats && (
                <span className="text-zinc-500 ml-2">
                  ({dbInfo.stats.usersCount} студ., {dbInfo.stats.tasksCount} зад.,{' '}
                  {dbInfo.stats.submissionsCount} сдач)
                </span>
              )}
            </p>
          </div>

          {/* Быстрые кнопки бэкапа */}
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportBackup}
              isLoading={isExporting}
              className="h-8 text-xs px-3 border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Экспорт JSON</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              isLoading={isImporting}
              className="h-8 text-xs px-3 border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Импорт JSON</span>
            </Button>
          </div>
        </div>

        {backupSuccess && (
          <div className="text-[11px] text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 px-3 py-1.5 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{backupSuccess}</span>
          </div>
        )}
        {backupError && (
          <div className="text-[11px] text-rose-400 bg-rose-950/30 border border-rose-500/30 px-3 py-1.5 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{backupError}</span>
          </div>
        )}

        {/* Компактный спойлер с командами CLI */}
        <details className="group pt-1 border-t border-zinc-800/60">
          <summary className="text-[11px] text-zinc-500 hover:text-zinc-300 cursor-pointer list-none flex items-center gap-1 select-none py-1">
            <ChevronDown className="w-3 h-3 transition-transform group-open:rotate-180" />
            <span>Команды терминала (Docker / Дамп)</span>
          </summary>
          <div className="mt-2 space-y-1.5 bg-zinc-950/60 p-2.5 border border-zinc-800/80 text-[11px]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-zinc-500">Запуск MySQL:</span>
              <div className="flex items-center gap-1.5">
                <code className="text-zinc-300 bg-zinc-900 px-1.5 py-0.5">
                  docker compose up -d mysql
                </code>
                <button
                  type="button"
                  onClick={() => handleCopy('docker compose up -d mysql', 'start')}
                  className="text-zinc-500 hover:text-zinc-200 p-0.5"
                  title="Копировать"
                >
                  {copiedCmd === 'start' ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-zinc-500">Миграция JSON → MySQL:</span>
              <div className="flex items-center gap-1.5">
                <code className="text-zinc-300 bg-zinc-900 px-1.5 py-0.5">
                  npm run db:migrate:mysql
                </code>
                <button
                  type="button"
                  onClick={() => handleCopy('npm run db:migrate:mysql', 'mig')}
                  className="text-zinc-500 hover:text-zinc-200 p-0.5"
                  title="Копировать"
                >
                  {copiedCmd === 'mig' ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-zinc-500">Создать SQL дамп:</span>
              <div className="flex items-center gap-1.5">
                <code className="text-zinc-300 bg-zinc-900 px-1.5 py-0.5">
                  mysqldump -u sudostudy -p demo_practics &gt; backup.sql
                </code>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      'docker exec -t sudostudy_mysql mysqldump -u sudostudy -psecure_password demo_practics > backup.sql',
                      'dump'
                    )
                  }
                  className="text-zinc-500 hover:text-zinc-200 p-0.5"
                  title="Копировать"
                >
                  {copiedCmd === 'dump' ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </details>
      </div>

      {/* 2. УЧЁТНАЯ ЗАПИСЬ АДМИНИСТРАТОРА */}
      <div className="border border-zinc-800 bg-zinc-900/50 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            Учётная запись
          </span>
          {admin2FAEnabled ? (
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              2FA активна
            </span>
          ) : (
            <span className="text-[10px] text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded">
              2FA выключена
            </span>
          )}
        </div>

        {profileSuccess && (
          <div className="text-[11px] text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 px-3 py-1.5 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{profileSuccess}</span>
          </div>
        )}
        {profileError && (
          <div className="text-[11px] text-rose-400 bg-rose-950/30 border border-rose-500/30 px-3 py-1.5 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{profileError}</span>
          </div>
        )}
        {reset2FASuccess && (
          <div className="text-[11px] text-amber-400 bg-amber-950/30 border border-amber-500/30 px-3 py-1.5 flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 shrink-0" />
            <span>{reset2FASuccess}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-zinc-400 uppercase mb-1">
                Логин
              </label>
              <Input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="h-8 font-mono text-xs bg-zinc-950 border-zinc-800"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-zinc-400 uppercase mb-1">
                ФИО
              </label>
              <Input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                className="h-8 font-mono text-xs bg-zinc-950 border-zinc-800"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-zinc-400 uppercase mb-1">
                Новый пароль
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Без изменений"
                  className="h-8 font-mono text-xs bg-zinc-950 border-zinc-800 pr-8"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Button
              type="submit"
              size="sm"
              isLoading={isLoadingProfile}
              className="h-8 text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-4"
            >
              Сохранить
            </Button>
            {admin2FAEnabled && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResetAdmin2FA}
                isLoading={isResetting2FA}
                className="h-8 text-xs border-amber-800/60 text-amber-400 hover:bg-amber-950/40 px-3 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Сбросить 2FA</span>
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
