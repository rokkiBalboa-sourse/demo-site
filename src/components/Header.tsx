import React from 'react';
import Link from 'next/link';
import { SessionUser } from '@/lib/types';
import { Logo } from './Logo';
import { ExternalLink, LogOut, ShieldAlert, BookOpen, Layers, Compass } from 'lucide-react';

interface HeaderProps {
  user: SessionUser | null;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand & Companion Link */}
        <div className="flex items-center gap-5">
          <Link href={user?.role === 'admin' ? '/admin' : '/'} className="group">
            <Logo size="sm" showSubtitle={false} />
          </Link>

          <nav className="hidden md:flex items-center gap-1 font-mono text-xs">
            <Link
              href="/#preparation"
              className="px-2.5 py-1 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Подготовка</span>
            </Link>

            <Link
              href="/#modules"
              className="px-2.5 py-1 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Модули</span>
            </Link>

            <a
              href="https://demo.sudostudy.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors flex items-center gap-1"
            >
              <span>База знаний</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </a>
          </nav>
        </div>

        {/* Navigation & User Menu */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.role === 'admin' ? (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 font-mono text-xs bg-white text-zinc-950 px-2 py-0.5 font-bold">
                    <ShieldAlert className="w-3 h-3" />
                    <span>ПРЕПОДАВАТЕЛЬ</span>
                  </span>
                  <Link
                    href="/admin"
                    className="text-xs font-mono text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-500 px-2.5 py-1 bg-zinc-900"
                  >
                    Журнал отчётов
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block font-mono">
                    <div className="text-xs font-medium text-zinc-200 leading-tight">
                      {user.full_name}
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      Группа: <span className="text-zinc-300 font-semibold">{user.group_name}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Logout Button */}
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  title="Выйти из системы"
                  className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="text-xs font-mono font-medium text-zinc-950 bg-white hover:bg-zinc-200 border border-white px-3 py-1"
            >
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
