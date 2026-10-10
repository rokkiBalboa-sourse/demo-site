'use client';

import React, { useState, useMemo } from 'react';
import { StudentWithStats } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import {
  UserPlus,
  FileSpreadsheet,
  Download,
  Search,
  Eye,
  EyeOff,
  Copy,
  Check,
  Edit2,
  Trash2,
  KeyRound,
  Users,
  Award,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  X,
  Sparkles,
  ShieldOff,
} from 'lucide-react';

interface StudentsManagementClientProps {
  initialStudents: StudentWithStats[];
  availableGroups: string[];
}

export function StudentsManagementClient({
  initialStudents,
  availableGroups,
}: StudentsManagementClientProps) {
  const [students, setStudents] = useState<StudentWithStats[]>(initialStudents);
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Password visibility set (student.id -> boolean)
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<StudentWithStats | null>(null);
  const [passwordStudent, setPasswordStudent] = useState<StudentWithStats | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<StudentWithStats | null>(null);
  const [studentToReset2FA, setStudentToReset2FA] = useState<StudentWithStats | null>(null);
  const [reset2FAMessage, setReset2FAMessage] = useState<string | null>(null);

  // Form states
  const [newFullName, setNewFullName] = useState('');
  const [newGroup, setNewGroup] = useState(availableGroups[0] || '9СА-421');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bulk import form
  const [bulkText, setBulkText] = useState('');
  const [bulkDefaultGroup, setBulkDefaultGroup] = useState(availableGroups[0] || '9СА-421');
  const [bulkResult, setBulkResult] = useState<{ created: number; skipped: string[] } | null>(null);

  // Password reset modal form
  const [changePasswordVal, setChangePasswordVal] = useState('');

  // Helper transliterate for live login suggestion
  const transliterate = (str: string) => {
    const map: Record<string, string> = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
      'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
      'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
      'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
    };
    return str.toLowerCase().split('').map(ch => map[ch] ?? ch).join('').replace(/[^a-z0-9]/g, '');
  };

  const handleFullNameChange = (val: string) => {
    setNewFullName(val);
    const parts = val.trim().split(/\s+/);
    if (parts.length > 0 && parts[0]) {
      const base = transliterate(parts[0]);
      if (parts.length > 1 && parts[1][0]) {
        const initial = transliterate(parts[1][0]);
        setNewUsername(`${base}.${initial}`);
      } else {
        setNewUsername(base);
      }
    }
  };

  const handleGeneratePassword = () => {
    const prefix = Math.random() > 0.5 ? 'stud' : 'exam';
    const num = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${num}`;
  };

  const openAddModal = () => {
    setNewFullName('');
    setNewGroup(availableGroups[0] || '9СА-421');
    setNewUsername('');
    setNewPassword(handleGeneratePassword());
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Submit single student
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: newFullName,
          group_name: newGroup,
          username: newUsername,
          password: newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка при сохранении');

      // Refresh list
      const updatedList: StudentWithStats = {
        ...data.student,
        submissions_count: 0,
        passed_count: 0,
        total_score: 0,
      };
      setStudents(prev => [...prev, updatedList].sort((a, b) => a.full_name.localeCompare(b.full_name)));
      setIsAddModalOpen(false);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Parse bulk text
  const parsedBulkRows = useMemo(() => {
    if (!bulkText.trim()) return [];
    return bulkText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        const parts = line.split(/[,;\t]+/).map(p => p.trim());
        const fullName = parts[0] || '';
        const group = parts[1] || bulkDefaultGroup;
        const username = parts[2] || '';
        const password = parts[3] || '';
        return { full_name: fullName, group_name: group, username, password };
      })
      .filter(item => item.full_name.length > 0);
  }, [bulkText, bulkDefaultGroup]);

  // Submit bulk import
  const handleBulkImport = async () => {
    if (parsedBulkRows.length === 0) return;
    setFormError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'batch',
          students: parsedBulkRows,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка импорта');

      // Refresh local list
      const refRes = await fetch('/api/admin/students');
      if (refRes.ok) {
        const refData = await refRes.json();
        setStudents(refData.students || []);
      }

      setBulkResult({
        created: data.createdCount || 0,
        skipped: data.skipped || [],
      });
      setBulkText('');
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit student submit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStudent) return;
    setIsSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch(`/api/admin/students/${editStudent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: editStudent.full_name,
          group_name: editStudent.group_name,
          username: editStudent.username,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка при сохранении');

      setStudents(prev =>
        prev.map(s => (s.id === editStudent.id ? { ...s, ...data.student } : s))
      );
      setEditStudent(null);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Ошибка при сохранении');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Change password submit
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordStudent || !changePasswordVal.trim()) return;
    setIsSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch(`/api/admin/students/${passwordStudent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password_hash: changePasswordVal.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка обновления пароля');

      setStudents(prev =>
        prev.map(s => (s.id === passwordStudent.id ? { ...s, password_hash: changePasswordVal.trim() } : s))
      );
      setPasswordStudent(null);
      setChangePasswordVal('');
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Ошибка обновления пароля');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete student
  const handleDeleteStudent = async (id: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/students/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Ошибка удаления');
      }

      setStudents(prev => prev.filter(s => s.id !== id));
      setStudentToDelete(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Ошибка удаления');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset 2FA for student
  const handleReset2FA = async (id: string, name: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/students/reset-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: id }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Ошибка сброса 2FA');
      }

      setStudents(prev =>
        prev.map(s => (s.id === id ? { ...s, two_factor_enabled: false, two_factor_secret: null } : s))
      );
      setStudentToReset2FA(null);
      setReset2FAMessage(`2FA для студента ${name} успешно сброшена! При следующем входе потребуется пароль и новая привязка.`);
      setTimeout(() => setReset2FAMessage(null), 6000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Ошибка сброса 2FA');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      if (selectedGroup !== 'ALL' && s.group_name !== selectedGroup) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = s.full_name.toLowerCase().includes(q);
        const matchUser = s.username.toLowerCase().includes(q);
        const matchGroup = s.group_name.toLowerCase().includes(q);
        if (!matchName && !matchUser && !matchGroup) {
          return false;
        }
      }
      return true;
    });
  }, [students, selectedGroup, searchQuery]);

  // Unique groups from current list
  const currentGroups = useMemo(() => {
    const set = new Set<string>();
    for (const s of students) {
      if (s.group_name) set.add(s.group_name);
    }
    return Array.from(set).sort();
  }, [students]);

  // Metrics
  const totalStudentsCount = students.length;
  const activeStudentsCount = students.filter(s => s.submissions_count > 0).length;
  const totalPassedSubmissions = students.reduce((acc, s) => acc + s.passed_count, 0);

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-zinc-900/60 border border-zinc-800 p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="primary"
            onClick={openAddModal}
            className="flex items-center gap-1.5 text-xs font-mono"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Добавить студента</span>
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              setBulkText('');
              setBulkResult(null);
              setFormError(null);
              setIsBulkModalOpen(true);
            }}
            className="flex items-center gap-1.5 text-xs font-mono border-zinc-700 hover:border-zinc-500"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Массовый импорт</span>
          </Button>

          <a
            href={`/api/admin/students/export-csv?group=${selectedGroup}`}
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-mono font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Скачать логины и пароли (CSV)</span>
          </a>
        </div>

        {/* Search and Group Filter */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Group Dropdown */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-zinc-500 text-[11px] uppercase">Группа:</span>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 text-zinc-200 px-2.5 py-1 text-xs focus:outline-none focus:border-zinc-500 font-mono"
            >
              <option value="ALL">Все группы ({students.length})</option>
              {currentGroups.map((g) => (
                <option key={g} value={g}>
                  {g} ({students.filter((s) => s.group_name === g).length})
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Поиск по ФИО или логину..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 pl-8 pr-3 py-1 text-xs focus:outline-none focus:border-zinc-500 font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="border border-zinc-800 bg-zinc-900/60 p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase text-zinc-500 font-semibold">Всего в базе</div>
            <div className="text-xl font-bold text-white mt-0.5">{totalStudentsCount}</div>
          </div>
          <Users className="w-5 h-5 text-zinc-500" />
        </div>

        <div className="border border-zinc-800 bg-zinc-900/60 p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase text-zinc-500 font-semibold">Учебных групп</div>
            <div className="text-xl font-bold text-zinc-200 mt-0.5">{currentGroups.length}</div>
          </div>
          <BookOpen className="w-5 h-5 text-zinc-500" />
        </div>

        <div className="border border-zinc-800 bg-zinc-900/60 p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase text-zinc-500 font-semibold">Активных на стенде</div>
            <div className="text-xl font-bold text-amber-300 mt-0.5">{activeStudentsCount}</div>
          </div>
          <RefreshCw className="w-5 h-5 text-amber-400" />
        </div>

        <div className="border border-zinc-800 bg-zinc-900/60 p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase text-zinc-500 font-semibold">Всего зачтено работ</div>
            <div className="text-xl font-bold text-emerald-300 mt-0.5">{totalPassedSubmissions}</div>
          </div>
          <Award className="w-5 h-5 text-emerald-400" />
        </div>
      </div>

      {/* Notification banner */}
      {reset2FAMessage && (
        <div className="p-3 bg-cyan-950/80 border border-cyan-500/50 text-cyan-200 text-xs font-mono flex items-center justify-between gap-2 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{reset2FAMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setReset2FAMessage(null)}
            className="text-cyan-400 hover:text-white p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Students Table */}
      <div className="border border-zinc-800 bg-zinc-900/60 overflow-hidden">
        <div className="p-3 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              Список студентов
            </span>
            <span className="text-zinc-500">
              (Показано: {filteredStudents.length} из {students.length})
            </span>
          </div>
          <span className="text-zinc-400 text-[11px]">
            Пароли студентов видны преподавателю для выдачи перед экзаменом
          </span>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 font-mono text-xs space-y-2">
            <Users className="w-8 h-8 mx-auto text-zinc-600 mb-1" />
            <div>Студентов по заданным критериям не найдено</div>
            {searchQuery && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="mt-2 text-xs"
              >
                Сбросить поиск
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs divide-y divide-zinc-800">
              <thead>
                <tr className="bg-zinc-950/80 text-zinc-400 text-[11px] uppercase tracking-wider">
                  <th className="p-3 font-semibold">ФИО студента</th>
                  <th className="p-3 font-semibold">Группа</th>
                  <th className="p-3 font-semibold">Логин</th>
                  <th className="p-3 font-semibold">Пароль</th>
                  <th className="p-3 font-semibold">Сдано заданий</th>
                  <th className="p-3 font-semibold">Суммарный балл</th>
                  <th className="p-3 font-semibold text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                {filteredStudents.map((std) => {
                  const isPassVisible = !!visiblePasswords[std.id];
                  const isCopied = copiedId === std.id;

                  return (
                    <tr key={std.id} className="hover:bg-zinc-900/50 transition-colors">
                      {/* Name */}
                      <td className="p-3 font-medium text-white">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>{std.full_name}</span>
                        </div>
                      </td>

                      {/* Group */}
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 font-bold text-amber-300 text-[11px]">
                          {std.group_name}
                        </span>
                      </td>

                      {/* Username */}
                      <td className="p-3 font-bold text-sky-300">
                        <div className="flex items-center gap-1.5">
                          <code>{std.username}</code>
                          <button
                            title="Копировать логин"
                            onClick={() => copyToClipboard(std.username, `user-${std.id}`)}
                            className="p-1 hover:text-white text-zinc-500 transition-colors"
                          >
                            {copiedId === `user-${std.id}` ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Password */}
                      <td className="p-3 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-zinc-950 border border-zinc-800 px-2 py-0.5 text-zinc-100 min-w-[90px] text-center">
                            {isPassVisible ? std.password_hash : '••••••••'}
                          </span>
                          <button
                            title={isPassVisible ? 'Скрыть пароль' : 'Показать пароль'}
                            onClick={() => togglePasswordVisibility(std.id)}
                            className="p-1 hover:text-white text-zinc-500 transition-colors"
                          >
                            {isPassVisible ? (
                              <EyeOff className="w-3.5 h-3.5 text-zinc-300" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            title="Копировать пароль"
                            onClick={() => copyToClipboard(std.password_hash, `pass-${std.id}`)}
                            className="p-1 hover:text-white text-zinc-500 transition-colors"
                          >
                            {copiedId === `pass-${std.id}` ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Passed Tasks */}
                      <td className="p-3">
                        <span className="font-bold text-zinc-200">
                          {std.passed_count}
                        </span>
                        <span className="text-zinc-500 text-[11px]"> / 32</span>
                      </td>

                      {/* Score */}
                      <td className="p-3">
                        <span className="font-bold text-emerald-400">
                          {std.total_score} б.
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            title="Сбросить Google Authenticator (2FA)"
                            onClick={() => setStudentToReset2FA(std)}
                            className="p-1.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-cyan-300 transition-colors"
                          >
                            <ShieldOff className="w-3.5 h-3.5" />
                          </button>

                          <button
                            title="Сменить пароль"
                            onClick={() => {
                              setPasswordStudent(std);
                              setChangePasswordVal(handleGeneratePassword());
                            }}
                            className="p-1.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-amber-300 transition-colors"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>

                          <button
                            title="Редактировать данные"
                            onClick={() => setEditStudent(std)}
                            className="p-1.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            title="Удалить студента"
                            onClick={() => setStudentToDelete(std)}
                            className="p-1.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-500 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: ADD SINGLE STUDENT                               */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-md p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-sm uppercase">Новый студент</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateStudent} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-zinc-400 uppercase text-[10px] font-bold block">
                  ФИО студента *
                </label>
                <Input
                  type="text"
                  required
                  placeholder="Иванов Иван Иванович"
                  value={newFullName}
                  onChange={(e) => handleFullNameChange(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-white font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 uppercase text-[10px] font-bold block">
                  Учебная группа *
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    required
                    placeholder="9СА-421"
                    value={newGroup}
                    onChange={(e) => setNewGroup(e.target.value)}
                    className="bg-zinc-900 border-zinc-800 text-white font-mono text-xs"
                  />
                  {availableGroups.length > 0 && (
                    <select
                      onChange={(e) => setNewGroup(e.target.value)}
                      value={newGroup}
                      className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-2 text-xs font-mono"
                    >
                      {availableGroups.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 uppercase text-[10px] font-bold block">
                  Логин для входа *
                </label>
                <Input
                  type="text"
                  required
                  placeholder="ivanov"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-white font-mono text-xs"
                />
                <span className="text-[10px] text-zinc-500">
                  Генерируется автоматически из фамилии, можно изменить
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-400 uppercase text-[10px] font-bold">
                    Пароль *
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewPassword(handleGeneratePassword())}
                    className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Сгенерировать</span>
                  </button>
                </div>
                <Input
                  type="text"
                  required
                  placeholder="student123"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-white font-mono text-xs font-bold"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Отмена
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Сохранение...' : 'Создать студента'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: BULK IMPORT (PASTE FROM LIST / EXCEL)             */}
      {/* ========================================================= */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-2xl p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-sm uppercase">
                  Массовый импорт списка группы
                </h3>
              </div>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            {bulkResult && (
              <div className="p-3 bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Успешно добавлено студентов: {bulkResult.created}</span>
                </div>
                {bulkResult.skipped.length > 0 && (
                  <div className="text-zinc-400 text-[11px] pt-1">
                    Пропущено (дубликаты): {bulkResult.skipped.join(', ')}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-zinc-400 uppercase text-[10px] font-bold">
                  Группа по умолчанию:
                </label>
                <Input
                  type="text"
                  placeholder="9СА-421"
                  value={bulkDefaultGroup}
                  onChange={(e) => setBulkDefaultGroup(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-white font-mono text-xs w-48"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 uppercase text-[10px] font-bold block">
                  Вставьте список студентов (по одной записи на строку):
                </label>
                <Textarea
                  rows={8}
                  placeholder={`Иванов Иван Иванович
Петров Алексей Сергеевич, 9СА-421
Сидоров Денис Михайлович, 9СА-421, sidorov, pass123`}
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-white font-mono text-xs leading-relaxed"
                />
              </div>

              <div className="p-3 bg-zinc-900/60 border border-zinc-800 space-y-1 text-zinc-400 text-[11px]">
                <strong className="text-zinc-200">Поддерживаемые форматы строк:</strong>
                <div>1. <code>ФИО</code> — группа берётся из поля выше, логин и пароль генерируются автоматически.</div>
                <div>2. <code>ФИО, Группа</code> — логин и пароль генерируются автоматически.</div>
                <div>3. <code>ФИО, Группа, Логин, Пароль</code> — явное указание реквизитов.</div>
              </div>

              {parsedBulkRows.length > 0 && (
                <div className="text-emerald-400 text-[11px] font-bold">
                  Распознано записей для импорта: {parsedBulkRows.length}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setIsBulkModalOpen(false)}
              >
                Закрыть
              </Button>
              <Button
                variant="primary"
                onClick={handleBulkImport}
                disabled={isSubmitting || parsedBulkRows.length === 0}
              >
                {isSubmitting
                  ? 'Импорт...'
                  : `Импортировать ${parsedBulkRows.length > 0 ? `(${parsedBulkRows.length})` : ''}`}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: EDIT STUDENT                                     */}
      {/* ========================================================= */}
      {editStudent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-md p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-sky-400" />
                <h3 className="font-bold text-white text-sm uppercase">Редактирование студента</h3>
              </div>
              <button
                onClick={() => setEditStudent(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-950/50 border border-rose-800 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-zinc-400 uppercase text-[10px] font-bold block">
                  ФИО студента
                </label>
                <Input
                  type="text"
                  required
                  value={editStudent.full_name}
                  onChange={(e) =>
                    setEditStudent({ ...editStudent, full_name: e.target.value })
                  }
                  className="bg-zinc-900 border-zinc-800 text-white font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 uppercase text-[10px] font-bold block">
                  Группа
                </label>
                <Input
                  type="text"
                  required
                  value={editStudent.group_name}
                  onChange={(e) =>
                    setEditStudent({ ...editStudent, group_name: e.target.value })
                  }
                  className="bg-zinc-900 border-zinc-800 text-white font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 uppercase text-[10px] font-bold block">
                  Логин
                </label>
                <Input
                  type="text"
                  required
                  value={editStudent.username}
                  onChange={(e) =>
                    setEditStudent({ ...editStudent, username: e.target.value })
                  }
                  className="bg-zinc-900 border-zinc-800 text-white font-mono text-xs"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setEditStudent(null)}
                >
                  Отмена
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: RESET / CHANGE PASSWORD                          */}
      {/* ========================================================= */}
      {passwordStudent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-sm p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-sm uppercase">Смена пароля</h3>
              </div>
              <button
                onClick={() => setPasswordStudent(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-zinc-400 text-xs">
              Студент: <strong className="text-white">{passwordStudent.full_name}</strong> (
              <span className="text-sky-300 font-bold">{passwordStudent.username}</span>)
            </div>

            <form onSubmit={handleSavePassword} className="space-y-3.5">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-400 uppercase text-[10px] font-bold">
                    Новый пароль
                  </label>
                  <button
                    type="button"
                    onClick={() => setChangePasswordVal(handleGeneratePassword())}
                    className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Сгенерировать</span>
                  </button>
                </div>
                <Input
                  type="text"
                  required
                  value={changePasswordVal}
                  onChange={(e) => setChangePasswordVal(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-white font-mono text-xs font-bold"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setPasswordStudent(null)}
                >
                  Отмена
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Сохранение...' : 'Обновить пароль'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: CONFIRM RESET 2FA                                */}
      {/* ========================================================= */}
      {studentToReset2FA && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-sm p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldOff className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-sm uppercase">Сброс 2FA</h3>
              </div>
              <button
                onClick={() => setStudentToReset2FA(null)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-zinc-400 text-xs">
              Студент: <strong className="text-white">{studentToReset2FA.full_name}</strong> (
              <span className="text-sky-300 font-bold">{studentToReset2FA.username}</span>, группа{' '}
              <span className="text-amber-300 font-bold">{studentToReset2FA.group_name}</span>)
            </div>

            <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 text-cyan-200/90 leading-relaxed text-[11px] space-y-2">
              <p>
                Вы действительно хотите сбросить двухэтапную аутентификацию (Google Authenticator) для этого студента?
              </p>
              <p className="text-zinc-400 text-[10px]">
                При следующем входе студенту потребуется войти по паролю и выполнить привязку приложения Authenticator заново.
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStudentToReset2FA(null)}
                disabled={isSubmitting}
              >
                Отмена
              </Button>
              <Button
                type="button"
                onClick={() => handleReset2FA(studentToReset2FA.id, studentToReset2FA.full_name)}
                disabled={isSubmitting}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
              >
                {isSubmitting ? 'Сброс...' : 'Сбросить 2FA'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 6: CONFIRM DELETE STUDENT                           */}
      {/* ========================================================= */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-sm p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-500" />
                <h3 className="font-bold text-white text-sm uppercase">Удаление аккаунта</h3>
              </div>
              <button
                onClick={() => setStudentToDelete(null)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-zinc-400 text-xs">
              Студент: <strong className="text-white">{studentToDelete.full_name}</strong> (
              <span className="text-sky-300 font-bold">{studentToDelete.username}</span>, группа{' '}
              <span className="text-amber-300 font-bold">{studentToDelete.group_name}</span>)
            </div>

            <div className="p-3 bg-rose-950/25 border border-rose-800/40 text-rose-200/90 leading-relaxed text-[11px] flex gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                Внимание! Это действие нельзя отменить. Учётная запись, все отправленные решения и история оценивания будут безвозвратно удалены.
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStudentToDelete(null)}
                disabled={isSubmitting}
              >
                Отмена
              </Button>
              <Button
                type="button"
                onClick={() => handleDeleteStudent(studentToDelete.id)}
                disabled={isSubmitting}
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold"
              >
                {isSubmitting ? 'Удаление...' : 'Да, удалить'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
